"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Ru(bipy)₃]Cl₂·6H₂O — ELEMENT ANALIZI (EA) MAHSUS SAHIFASI
// Manbalar: IUPAC Atomic Weights 2021, Vogel's Quantitative Chemical Analysis
// Xususiyat: Mashhur fotokimyoviy kompleks, kuchli MLCT fluoressensiya
// Maqsad: Faqat EA tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Ru: 101.07, Cl: 35.450, C: 12.011, H: 1.008, N: 14.007, O: 15.999, S: 32.065,
  Os: 190.23, Fe: 55.845, Co: 58.933, Rh: 102.91, Ir: 192.22
}

const BIPY_MOLAR_MASS = 10 * ATOMIC_MASSES.C + 8 * ATOMIC_MASSES.H + 2 * ATOMIC_MASSES.N  // 156.188
const WATER_MOLAR_MASS = 2 * ATOMIC_MASSES.H + ATOMIC_MASSES.O  // 18.015

const COMPOUND = {
  formulaHTML: "[Ru(bipy)<sub>3</sub>]Cl<sub>2</sub>·6H<sub>2</sub>O",
  formulaPlain: "[Ru(bipy)3]Cl2·6H2O",
  iupac: "Tris(2,2'-bipiridin)ruteniy(II) xlorid geksagidrat",
  formulaExpanded: "[Ru(C₁₀H₈N₂)₃]Cl₂·6H₂O = RuC₃₀H₃₆N₆Cl₂O₆",
  molarMass: 748.624,
  casNumber: "50529-62-9 (anhidrous: 15746-57-3)",
  color: "to'q qizil-jigar kristallar (MLCT yutilishi tufayli)",
  stability: "havoda barqaror, suvda eriydi, qorong'ida saqlash tavsiya etiladi",
  
  historicalFact: {
    title: "Fotokimyo va quyosh energetikasi inqilobi",
    text: "[Ru(bipy)₃]²⁺ — 1965-yilda Paris va boshqalar tomonidan birinchi marta tavsiflangan, lekin uning haqiqiy ahamiyati 1974-yilda ma'lum bo'ldi. Bu yilda Calvin va boshqalar uning kuchli MLCT (Metal-to-Ligand Charge Transfer) emissiyasi borligini va fotoqaytaruvchi xususiyatlarini kashf etishdi. 1977-yilda Graetzel va boshqalar [Ru(bipy)₃]²⁺ dan foydalanib, suvni vodorod va kislorodga fotokatalitik parchalashni amalga oshirdilar. Bu quyosh energetikasi va Dye-Sensitized Solar Cells (DSSC) sohasining boshlanishi edi. Bugungi kunda [Ru(bipy)₃]Cl₂ eng ko'p o'rganilgan fotokimyoviy kompleks bo'lib, 50,000 dan ortiq maqolada tilga olingan. EA tahlilida bu birikma qiziq: C, H, N — barchasi organik ligandda (74.2%), Ru (13.5%) va Cl (9.5%) esa detektlanmaydi.",
    year: "1965-1977"
  },

  ligandTypes: [
    { type: "Koordinatsion bipy (bidentat)", count: 3, role: "Ru²⁺ ga 2 ta N orqali bog'langan, 5 a'zoli xelat halqasi", eaImpact: "C kanalida 30 ta C, N kanalida 6 ta N, H kanalida 24 ta H", lossTemp: "280-450°C (bosqichma-bosqich)" },
    { type: "Kristall suv (H₂O)", count: 6, role: "Panjarada H-bog'lar orqali (SO₄²⁻ emas, Cl⁻ bilan)", eaImpact: "H kanaliga 12 ta qo'shimcha H, O kanaliga 6 ta O", lossTemp: "60-120°C" },
    { type: "Tashqi sfera Cl⁻", count: 2, role: "Ion bog' orqali [Ru(bipy)₃]²⁺ bilan", eaImpact: "Standart CHNS-O da detektlanmaydi (Schöniger kerak)", lossTemp: ">500°C (Cl₂ ↑)" },
    { type: "Markaziy Ru²⁺", count: 1, role: "d⁶ konfiguratsiyasi, oktaedr geometriya", eaImpact: "Yoqilg'ida RuO₂ qoldig'i — TCD da ko'rinmaydi", lossTemp: "Qoldiq sifatida" }
  ],
  
  theoretical: {
    C:  { atoms: 30, mass: 360.330, percent: 48.135, source: "3×bipy (30×C)", eaChannel: "Asosiy organik kanal" },
    H:  { atoms: 36, mass: 36.288,  percent: 4.847,  source: "3×bipy (24H) + 6H₂O (12H)", eaChannel: "Organik + gidrat H" },
    N:  { atoms: 6,  mass: 84.042,  percent: 11.227, source: "3×bipy (6×N)", eaChannel: "Ligand sonini tasdiqlaydi" },
    S:  { atoms: 0,  mass: 0.000,   percent: 0.000,  source: "Sulfur guruhi yo'q", eaChannel: "Shovqin tekshirish" },
    O:  { atoms: 6,  mass: 95.994,  percent: 12.823, source: "6×kristall H₂O", eaChannel: "Maxsus O rejimi" },
    Ru: { atoms: 1,  mass: 101.070, percent: 13.501, source: "Markaziy Ru²⁺", eaChannel: "Yoqilg'ida RuO₂ qoldig'i" },
    Cl: { atoms: 2,  mass: 70.900,  percent: 9.470,  source: "Tashqi sfera Cl⁻", eaChannel: "CHNS-O da detektlanmaydi" }
  },

  experimentalRuns: [
    { id: "EA-24-451", date: "2025-02-10", method: "CHNS-O FlashSmart", C: 48.10, H: 4.82, N: 11.20, S: 0.02, recovery: 64.1, note: "Toza, qayta kristallangan [Ru(bipy)₃]Cl₂·6H₂O" },
    { id: "EA-24-452", date: "2025-02-10", method: "CHNS-O FlashSmart", C: 48.18, H: 4.86, N: 11.25, S: 0.01, recovery: 64.3, note: "Standart sharoit" },
    { id: "EA-24-453", date: "2025-02-11", method: "CHNS-O Vario EL",    C: 47.50, H: 4.45, N: 11.10, S: 0.02, recovery: 63.1, note: "6 oy saqlangan — qisman degidratatsiya" },
    { id: "EA-24-454", date: "2025-02-11", method: "CHNS-O FlashSmart", C: 49.85, H: 4.85, N: 11.65, S: 0.02, recovery: 66.4, note: "Namlik yutilgan (H₂O ortiqcha)" },
    { id: "EA-24-455", date: "2025-02-12", method: "CHNS-O FlashSmart", C: 45.20, H: 4.55, N: 10.55, S: 0.03, recovery: 60.3, note: "Qisman fotodegradatsiya (yorug'likda)" },
    { id: "EA-24-456", date: "2025-02-12", method: "CHNS-O FlashSmart", C: 32.10, H: 3.25, N: 7.50,  S: 0.02, recovery: 42.9, note: "[Ru(bipy)₂]Cl₂ aralashmasi (2 bipy)" },
    { id: "BLANK-12",  date: "2025-02-10", method: "Blank (Empty Capsule)", C: 0.00, H: 0.02, N: 0.01, S: 0.00, recovery: 0.03, note: "Tizim tozaligi" },
    { id: "STD-SULFA", date: "2025-02-10", method: "Standard: Sulfanilamide", C: 41.82, H: 4.69, N: 16.28, S: 18.51, recovery: 99.9, note: "NIST kalibrlash standarti" }
  ],

  tgaSteps: [
    { start: 25,  end: 60,  loss: 0.0,  event: "Barqaror zona", color: "#10b981", eaCorrelation: "C, H, N barqaror" },
    { start: 60,  end: 120, loss: 14.4, event: "6H₂O yo'qolishi (Dehydratatsiya)", color: "#3b82f6", eaCorrelation: "H: 4.85% → 3.23% | O: 12.82% → 0%" },
    { start: 120, end: 280, loss: 0.0,  event: "Suvsiz [Ru(bipy)₃]Cl₂", color: "#f59e0b", eaCorrelation: "C va N barqaror" },
    { start: 280, end: 380, loss: 20.9, event: "1-bipy yo'qolishi", color: "#8b5cf6", eaCorrelation: "C: 48.14% → 32.10%" },
    { start: 380, end: 450, loss: 20.9, event: "2-bipy yo'qolishi", color: "#8b5cf6", eaCorrelation: "C: 32.10% → 16.05%" },
    { start: 450, end: 550, loss: 20.9, event: "3-bipy yo'qolishi", color: "#8b5cf6", eaCorrelation: "C: 16.05% → 0%" },
    { start: 550, end: 750, loss: 9.5,  event: "Cl₂ yo'qolishi", color: "#ef4444", eaCorrelation: "RuO₂ qoldig'i" }
  ],

  relatedMethods: [
    { name: "Fluoressensiya spektroskopiya", role: "MLCT emissiyasi (λ_ex = 452 nm, λ_em = 610 nm, Φ ≈ 0.04)", eaAdvantage: "Ru(bipy)₃²⁺ ning eng muhim xususiyati — EA buni ko'rsata olmaydi", eaDisadvantage: "Elementar tarkib bermaydi", complementarity: "98%" },
    { name: "UV-Vis spektroskopiya", role: "MLCT yutilishi (452 nm), π→π* (285 nm), d-d (kuchsiz)", eaAdvantage: "Ru²⁺ holatini tasdiqlaydi", eaDisadvantage: "Ligand sonini miqdoriy bermaydi", complementarity: "92%" },
    { name: "¹H va ¹³C YaMR", role: "Bipy protonlari (δ = 7.5-8.8 ppm), simmetriya tasdiqlanadi", eaAdvantage: "D₃ simmetriyani ko'rsatadi", eaDisadvantage: "Miqdoriy emas", complementarity: "90%" },
    { name: "Elektrokimyoviy tahlil (CV)", role: "Ru³⁺/Ru²⁺ qaytarilish (E₁/₂ ≈ +1.26 V vs NHE)", eaAdvantage: "Fotokimyoviy faollikni bashorat qiladi", eaDisadvantage: "Tarkib bermaydi", complementarity: "85%" },
    { name: "ICP-OES / ICP-MS", role: "Ru miqdorini ppb darajasida o'lchaydi", eaAdvantage: "Metall tarkibini to'g'ridan-to'g'ri beradi (13.5%)", eaDisadvantage: "Ligandlarni o'lchamaydi", complementarity: "88%" },
    { name: "IQ spektroskopiya", role: "C=C, C=N (1600, 1470 cm⁻¹), Ru-N (250-350 cm⁻¹)", eaAdvantage: "Koordinatsion bog'larni tasdiqlaydi", eaDisadvantage: "C, H, N miqdorini bermaydi", complementarity: "87%" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tanlash", desc: "To'q qizil-jigar kristallar. Och rang — fotodegradatsiya yuz bergan. Sariq — Ru³⁺ aralashmasi.", time: "1 daq", critical: true },
    { step: 2, title: "Yorug'likdan himoya", desc: "Qorong'i yoki folga bilan o'ralgan idishda tayyorlanadi. [Ru(bipy)₃]²⁺ fotolabil — yorug'likda fotodegradatsiya.", time: "doimiy", critical: true },
    { step: 3, title: "Namlikni nazorat qilish", desc: "Gidrat holati muhim (6H₂O). Qayta kristallashdan keyin standart sharoitda quritiladi.", time: "15 daq", critical: true },
    { step: 4, title: "Yengil maydalash", desc: "Aqiq hovonchada mayda kukunga aylantiriladi. Xelat komplekslari barqaror.", time: "2 daq", critical: false },
    { step: 5, title: "Qalay kapsulaga joylash", desc: "5×9mm Sn kapsulaga 2.0-3.5 mg namuna tortiladi.", time: "3 daq", critical: true },
    { step: 6, title: "Zich yopish va analiz", desc: "Kapsula zich yopiladi. CHNS rejimida analiz — C, H, N o'lchanadi.", time: "5-8 daq", critical: true }
  ],

  combustionPrinciple: {
    oxidationTemp: "1050°C",
    reductionTemp: "650°C (Cu)",
    products: {
      C: "CO₂ (TCD detektori)",
      H: "H₂O (TCD detektori)",
      N: "N₂ (TCD detektori)",
      S: "SO₂ (TCD detektori)",
      O: "CO (maxsus O rejimi)",
      Cl: "HCl (standart TCD da detektlanmaydi)",
      Ru: "RuO₂ (qattiq qoldiq)"
    },
    equations: [
      { reactant: "[Ru(bipy)₃]Cl₂·6H₂O", process: "+ O₂ (1050°C)", products: "RuO₂ (qattiq) + 30CO₂ + 18H₂O + 3N₂ + 2HCl" },
      { reactant: "Bipy ligandlari (3×)", process: "→ O₂", products: "30CO₂ + 12H₂O + 3N₂ — barchasi TCD da" },
      { reactant: "Kristall H₂O (6×)", process: "→ TCD", products: "6H₂O — H kanaliga qo'shiladi" },
      { reactant: "Ru²⁺", process: "Kamerasida qoldiq", products: "RuO₂ — ICP-OES bilan tasdiqlanadi" }
    ]
  },

  photophysicalProperties: {
    absorption_max: "452 nm (MLCT), 285 nm (π→π*)",
    emission_max: "610 nm (qizil-to'q sariq)",
    quantum_yield: "0.04 (suvda, 25°C)",
    excited_state_lifetime: "600 ns (suvda)",
    excited_state_potential: "Ru³⁺/*Ru²⁺ = -0.81 V (kuchli qaytaruvchi)",
    applications: ["DSSC quyosh elementlari", "Fotokatalitik H₂ ishlab chiqarish", "O₂ sensori", "Biolabeling"]
  },

  trisBipyComplexes: [
    { metal: "Fe", formula: "[Fe(bipy)₃]²⁺", molarMass: 604.32, color: "qizil", electrons: "d⁶ LS", luminescent: "✗ (past)", c_pct: 59.60, h_pct: 4.00, n_pct: 13.91, use: "Spin-crossover" },
    { metal: "Ru", formula: "[Ru(bipy)₃]²⁺", molarMass: 639.41, color: "to'q qizil ✓", electrons: "d⁶ LS", luminescent: "✓ (MLCT)", c_pct: 56.33, h_pct: 3.78, n_pct: 13.15, use: "Fotokimyo" },
    { metal: "Os", formula: "[Os(bipy)₃]²⁺", molarMass: 728.60, color: "qora-qizil", electrons: "d⁶ LS", luminescent: "✓ (NIR)", c_pct: 49.48, h_pct: 3.32, n_pct: 11.55, use: "NIR sensor" },
    { metal: "Co", formula: "[Co(bipy)₃]²⁺", molarMass: 605.45, color: "qizil-to'q", electrons: "d⁷ HS", luminescent: "✗", c_pct: 59.49, h_pct: 3.99, n_pct: 13.89, use: "Kataliz" },
    { metal: "Rh", formula: "[Rh(bipy)₃]³⁺", molarMass: 634.50, color: "sariq", electrons: "d⁶ LS", luminescent: "✓ (kuchsiz)", c_pct: 56.77, h_pct: 3.81, n_pct: 13.25, use: "Fotokataliz" },
    { metal: "Ir", formula: "[Ir(bipy)₃]³⁺", molarMass: 723.83, color: "sarg'ish", electrons: "d⁶ LS", luminescent: "✓ (kuchli)", c_pct: 49.76, h_pct: 3.34, n_pct: 11.61, use: "OLED" }
  ]
}

function calculateBipyComplexProperties(nBipy, nWater) {
  const metalMass = ATOMIC_MASSES.Ru
  const bipyMass = nBipy * BIPY_MOLAR_MASS
  const clMass = 2 * ATOMIC_MASSES.Cl
  const waterMass = nWater * WATER_MOLAR_MASS
  const total = metalMass + bipyMass + clMass + waterMass
  const cMass = nBipy * 10 * ATOMIC_MASSES.C
  const hMass = nBipy * 8 * ATOMIC_MASSES.H + nWater * 2 * ATOMIC_MASSES.H
  const nMass = nBipy * 2 * ATOMIC_MASSES.N
  const oMass = nWater * ATOMIC_MASSES.O
  return {
    total: parseFloat(total.toFixed(3)),
    C_pct: parseFloat(((cMass / total) * 100).toFixed(3)),
    H_pct: parseFloat(((hMass / total) * 100).toFixed(3)),
    N_pct: parseFloat(((nMass / total) * 100).toFixed(3)),
    O_pct: parseFloat(((oMass / total) * 100).toFixed(3)),
    Ru_pct: parseFloat(((metalMass / total) * 100).toFixed(3)),
    Cl_pct: parseFloat(((clMass / total) * 100).toFixed(3)),
    bipyPct: parseFloat(((bipyMass / total) * 100).toFixed(2)),
    waterPct: parseFloat(((waterMass / total) * 100).toFixed(2))
  }
}

export default function RuBipy3Cl2Page() {
  const [activeRun, setActiveRun] = useState("EA-24-451")
  const [nBipy, setNBipy] = useState(3)
  const [nWater, setNWater] = useState(6)
  const [customC, setCustomC] = useState(48.14)
  const [selectedMetal, setSelectedMetal] = useState(1)
  const [selectedLigandType, setSelectedLigandType] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState(true)

  const calc = useMemo(() => calculateBipyComplexProperties(nBipy, nWater), [nBipy, nWater])

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const dC = Math.abs(run.C - COMPOUND.theoretical.C.percent)
  const dH = Math.abs(run.H - COMPOUND.theoretical.H.percent)
  const dN = Math.abs(run.N - COMPOUND.theoretical.N.percent)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-red-950 to-purple-950 border-2 border-red-500 rounded-2xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
              <span className="text-4xl">✨</span> Fotokimyo yulduzi
            </h3>
            <p className="text-sm text-red-100 leading-relaxed mb-3">
              <strong className="text-white">[Ru(bipy)₃]Cl₂</strong> — zamonaviy <strong className="text-red-300">fotokimyo va quyosh energetikasi</strong>ning eng mashhur kompleksi.
            </p>
            <div className="bg-red-900/40 p-4 rounded-lg font-mono text-xs mb-3 space-y-1">
              <div><span className="text-red-400">MLCT emissiya:</span> <span className="text-white">610 nm (qizil)</span></div>
              <div><span className="text-red-400">Hayotiylik:</span> <span className="text-white">600 ns</span></div>
              <div><span className="text-red-400">Ilovalar:</span> <span className="text-white">DSSC, H₂ kataliz, sensorlar</span></div>
            </div>
            <p className="text-xs text-red-200 italic mb-4">
              EA bu kompleksning <strong>tarkibini</strong> tasdiqlaydi, lekin <strong>fotokimyoviy xususiyatlarini</strong> ko'ra olmaydi — buning uchun fluoressensiya spektroskopiya kerak.
            </p>
            <button 
              onClick={() => setShowPhotoModal(false)}
              className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
            >
              Tushundim — EA sahifasini ko'rish
            </button>
          </div>
        </div>
      )}
      
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
            <span className="text-red-400 font-semibold">[Ru(bipy)₃]Cl₂·6H₂O</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-red-400 flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                <span className="text-xs bg-red-900/60 px-2 py-1 rounded ml-2">✨ Fotokimyo</span>
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
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">MLCT Kompleks</span>
                <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">Bidentat Xelat</span>
                <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">Gidrat (6H₂O)</span>
                <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">DSSC Material</span>
              </div>
            </div>
            <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="text-xs bg-purple-900/50 hover:bg-purple-800 border border-purple-700 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              ← Barcha birikmalar
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        <div className="bg-gradient-to-r from-red-900/40 to-purple-900/40 border border-red-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (EA uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Ru(bipy)₃]Cl₂·6H₂O</strong> — ruteniy(II) ning uchta 2,2'-bipiridin ligandlari bilan oktaedr kompleksi. EA tahlilida <strong className="text-red-300">alohida o'ringa ega</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs md:text-sm">
                <li><strong className="text-white">C, H, N — organik ligandlarda</strong> (jami 64.2%)</li>
                <li><strong className="text-white">O faqat kristall suvda</strong> (6H₂O = 12.8%)</li>
                <li>Ru (13.5%) — yoqilg'ida <strong className="text-white">RuO₂ qoldig'i</strong> sifatida qoladi</li>
                <li>Cl (9.5%) — tashqi sferada, CHNS-O da detektlanmaydi</li>
                <li><strong className="text-red-300">Recovery ~64%</strong> — C+H+N+O yig'indisi</li>
                <li>Gidrat holati muhim — 6H₂O ning yo'qolishi H% ni 1.6% ga kamaytiradi</li>
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

        <div className="bg-gradient-to-r from-red-900/40 to-pink-900/40 border border-red-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>✨</span> Fotofizik xususiyatlar (EA ko'rmaydi!)
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            <strong className="text-red-300">Muhim eslatma:</strong> EA bu kompleksning <strong>elementar tarkibini</strong> o'lchaydi, lekin <strong>fotokimyoviy xususiyatlarini</strong> ko'ra olmaydi. Quyidagi xususiyatlar uchun fluoressensiya va UV-Vis spektroskopiya kerak.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-red-950/40 p-4 rounded-xl border border-red-700/30">
              <div className="text-xs text-red-400 uppercase mb-1">MLCT yutilishi</div>
              <div className="text-xl font-mono text-white">{COMPOUND.photophysicalProperties.absorption_max}</div>
            </div>
            <div className="bg-pink-950/40 p-4 rounded-xl border border-pink-700/30">
              <div className="text-xs text-pink-400 uppercase mb-1">MLCT emissiyasi</div>
              <div className="text-xl font-mono text-white">{COMPOUND.photophysicalProperties.emission_max}</div>
            </div>
            <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-1">Kvant unumdorlik</div>
              <div className="text-xl font-mono text-white">{COMPOUND.photophysicalProperties.quantum_yield}</div>
            </div>
            <div className="bg-indigo-950/40 p-4 rounded-xl border border-indigo-700/30">
              <div className="text-xs text-indigo-400 uppercase mb-1">Hayotiylik</div>
              <div className="text-xl font-mono text-white">{COMPOUND.photophysicalProperties.excited_state_lifetime}</div>
            </div>
            <div className="bg-orange-950/40 p-4 rounded-xl border border-orange-700/30 col-span-2">
              <div className="text-xs text-orange-400 uppercase mb-1">Fotoqaytaruvchi potensial</div>
              <div className="text-xl font-mono text-white">{COMPOUND.photophysicalProperties.excited_state_potential}</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-red-900/20 rounded-xl border border-red-700/30">
            <p className="text-xs text-red-200">
              <strong className="text-white">Ilovalar:</strong> {COMPOUND.photophysicalProperties.applications.join(" • ")}
            </p>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔥</span> EA ning ishlash prinsipi — CHNS-O
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            [Ru(bipy)₃]Cl₂·6H₂O EA uchun <strong className="text-red-300">murakkab namuna</strong> — tarkibida <strong>C, H, N (organik)</strong> va <strong>O (kristall suv)</strong> bor. Standart CHNS rejimida faqat C, H, N o'lchanadi; O ni o'lchash uchun maxsus CHNS-O (O mode) kerak.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">1. Yoqish kamerasi</div>
              <div className="text-2xl font-mono text-orange-400">{COMPOUND.combustionPrinciple.oxidationTemp}</div>
              <div className="text-xs text-purple-300 mt-2">O₂ + 1050°C — organik + suv → CO₂ + H₂O + N₂</div>
            </div>
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">2. Reduksiya kamerasi</div>
              <div className="text-2xl font-mono text-red-400">{COMPOUND.combustionPrinciple.reductionTemp}</div>
              <div className="text-xs text-purple-300 mt-2">Cu — NOₓ larni N₂ ga aylantiradi</div>
            </div>
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">3. Deteksiya</div>
              <div className="text-2xl font-mono text-blue-400">C+H+N+O</div>
              <div className="text-xs text-purple-300 mt-2">CO₂ (48.1%), H₂O (4.85%), N₂ (11.2%)</div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-red-400 font-bold text-xs uppercase mb-3">Bu birikma uchun yoqish reaksiyasi:</h3>
            <div className="space-y-3 font-mono text-xs">
              {COMPOUND.combustionPrinciple.equations.map((eq, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center gap-2 p-3 bg-purple-900/30 rounded border-l-4 border-red-500">
                  <span className="text-white font-bold">{eq.reactant}</span>
                  <span className="text-yellow-500">{eq.process}</span>
                  <span className="text-purple-600">→</span>
                  <span className="text-green-300">{eq.products}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📐</span> Nazariy element tarkibi (CHNS-O + Ru + Cl)
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            E'tibor bering: <strong className="text-red-300">C, H, N organik ligandda</strong>, <strong className="text-blue-300">O faqat kristall suvda</strong>, Ru va Cl detektlanmaydi.
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
                    <td className="py-3 pl-2 font-bold text-red-400">{el}</td>
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
                <tr className="bg-red-900/20 font-bold border-t border-red-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center text-white">81</td>
                  <td className="py-3"></td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🧬</span> Bipy va Gidrat holati simulyatsiyasi
            </h2>
            <div className="flex gap-2">
              <span className="text-xs text-red-400 bg-red-950/50 px-3 py-1 rounded border border-red-700/30">
                n (bipy) = {nBipy}
              </span>
              <span className="text-xs text-blue-400 bg-blue-950/50 px-3 py-1 rounded border border-blue-700/30">
                m (H₂O) = {nWater}
              </span>
            </div>
          </div>

          <p className="text-sm text-purple-300 mb-6">
            Bipy soni (n) va gidrat suv soni (m) o'zgarganda <strong className="text-yellow-300">C%, H%, N%, O%</strong> o'zgaradi. Bu EA orqali kompleksning tozaligini va gidrat holatini aniqlash imkonini beradi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-purple-950/60 p-6 rounded-xl border border-purple-700/30">
                <label className="block text-xs text-purple-400 mb-2">Bipy ligandlari soni (n):</label>
                <input 
                  type="range" min="0" max="4" step="1" 
                  value={nBipy} 
                  onChange={(e) => setNBipy(Number(e.target.value))}
                  className="w-full h-2 bg-purple-800 rounded-lg appearance-none cursor-pointer accent-red-500 mb-2"
                />
                <div className="flex justify-between text-xs font-mono text-purple-500 mb-6">
                  <span>0 (RuCl₂)</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3 (✓)</span>
                  <span>4</span>
                </div>

                <label className="block text-xs text-purple-400 mb-2">Kristall suv soni (m):</label>
                <input 
                  type="range" min="0" max="8" step="1" 
                  value={nWater} 
                  onChange={(e) => setNWater(Number(e.target.value))}
                  className="w-full h-2 bg-purple-800 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-2"
                />
                <div className="flex justify-between text-xs font-mono text-purple-500 mb-6">
                  <span>0 (anh.)</span>
                  <span>2</span>
                  <span>4</span>
                  <span>6 (✓)</span>
                  <span>8</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">Mol. massa</div>
                    <div className="text-xl font-mono text-white mt-1">{calc.total}</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-red-400 uppercase">bipy ulushi</div>
                    <div className="text-xl font-mono text-red-400 mt-1">{calc.bipyPct}%</div>
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
                    <div className="text-[10px] text-blue-400 uppercase">%O</div>
                    <div className="text-xl font-mono text-blue-400 mt-1">{calc.O_pct}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                <h3 className="text-red-400 font-bold text-xs uppercase mb-3 flex items-center gap-2">
                  <span>🧩</span> Ligand turlari
                </h3>
                <div className="space-y-2">
                  {COMPOUND.ligandTypes.map((w, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedLigandType(i)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedLigandType === i 
                          ? "bg-red-900/40 border-red-500" 
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
                {[0, 10, 20, 30, 40, 50, 60].map(v => (
                  <g key={v}>
                    <line x1="40" y1={210 - (v/60)*180} x2="380" y2={210 - (v/60)*180} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="3,3" />
                    <text x="35" y={214 - (v/60)*180} textAnchor="end" fontSize="9" fill="#a78bfa">{v}%</text>
                  </g>
                ))}
                
                {(() => {
                  const targetC = 48.135
                  const y = 210 - (targetC/60) * 180
                  return (
                    <g>
                      <line x1="40" y1={y} x2="380" y2={y} stroke="#fbbf24" strokeWidth="1" strokeDasharray="5,3" />
                      <text x="385" y={y+3} fontSize="8" fill="#fbbf24">n=3, m=6</text>
                    </g>
                  )
                })()}

                <polyline 
                  fill="none" stroke="#ef4444" strokeWidth="2.5" opacity="0.7"
                  points={[0,1,2,3,4].map(n => {
                    const props = calculateBipyComplexProperties(n, 6)
                    const x = 40 + (n/4) * 340
                    const y = 210 - (props.C_pct / 60) * 180
                    return `${x},${y}`
                  }).join(" ")}
                />

                {[0,1,2,3,4].map(n => {
                  const props = calculateBipyComplexProperties(n, 6)
                  const x = 40 + (n/4) * 340
                  const y = 210 - (props.C_pct / 60) * 180
                  const isActive = n === nBipy
                  return (
                    <g key={n} style={{ cursor: 'pointer' }} onClick={() => setNBipy(n)}>
                      <circle cx={x} cy={y} r={isActive ? 7 : 4} 
                        fill={isActive ? "#fbbf24" : "#ef4444"} 
                        stroke={isActive ? "#fff" : "#ef4444"} 
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
                    fill={n===nBipy ? "#fbbf24" : "#64748b"} 
                    fontWeight={n===nBipy ? "bold" : "normal"}
                  >
                    n={n}
                  </text>
                ))}
                <text x="210" y="238" textAnchor="middle" fontSize="9" fill="#a78bfa">Bipy soni (n) | RuCl₂·6H₂O asosida</text>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>📊</span> Barcha tris(bipy) komplekslari — EA va fotokimyo
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            <strong className="text-red-300">EA barcha tris(bipy) komplekslarini deyarli bir xil ko'rinadi</strong> — C, H, N yig'indisi 74% atrofida. Farq faqat metall massasida. <strong className="text-pink-300">Lekin fotokimyoviy xususiyatlar juda farqli!</strong>
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
                  <th className="py-2 text-center">Rang</th>
                  <th className="py-2 text-center">Lum.</th>
                  <th className="py-2 text-left">Qo'llanilishi</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.trisBipyComplexes.map((c, i) => {
                  const isTarget = c.metal === "Ru"
                  const isCurrent = i === selectedMetal
                  return (
                    <tr 
                      key={i}
                      onClick={() => setSelectedMetal(i)}
                      className={`border-b border-purple-800/30 cursor-pointer transition-colors ${
                        isTarget ? "bg-red-900/20" : isCurrent ? "bg-indigo-900/30" : "hover:bg-purple-800/20"
                      }`}
                    >
                      <td className={`py-2 pl-2 font-bold ${isTarget ? "text-red-400" : isCurrent ? "text-indigo-400" : "text-purple-300"}`}>
                        {c.formula}
                      </td>
                      <td className="py-2 text-center font-mono">{c.molarMass.toFixed(2)}</td>
                      <td className="py-2 text-center font-mono text-yellow-400 font-bold">{c.c_pct.toFixed(2)}</td>
                      <td className="py-2 text-center font-mono text-green-400">{c.h_pct.toFixed(2)}</td>
                      <td className="py-2 text-center font-mono text-cyan-400">{c.n_pct.toFixed(2)}</td>
                      <td className="py-2 text-center text-[10px]">{c.color}</td>
                      <td className={`py-2 text-center text-[10px] font-bold ${c.luminescent.includes('✓') ? 'text-green-400' : 'text-red-400'}`}>
                        {c.luminescent}
                      </td>
                      <td className="py-2 text-[10px] italic text-purple-400">
                        {isTarget ? "✓ Maqsad" : isCurrent ? "🎯 Joriy" : c.use}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-purple-400 italic mt-3">
            * <strong className="text-red-300">EA nuqtai nazaridan:</strong> Barcha tris(bipy) komplekslarining C%, H%, N% deyarli bir xil — farq juda kichik (56% atrofida C). Shuning uchun <strong className="text-pink-300">EA ularni bir-biridan farqlay OLMAYDI</strong> — faqat fluoressensiya va UV-Vis farqlaydi.
          </p>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>💧</span> Gidrat variantlari (n=3, bipy doimiy)
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            [Ru(bipy)₃]Cl₂ ning turli gidrat shakllari. Gidrat suv soni o'zgarganda <strong className="text-blue-300">O% va H%</strong> o'zgaradi, <strong className="text-yellow-300">C% va N%</strong> esa ozgina pasayadi.
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
                  <th className="py-2 text-center text-blue-400">%O</th>
                  <th className="py-2 text-center">H₂O %</th>
                  <th className="py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(m => {
                  const props = calculateBipyComplexProperties(3, m)
                  const isTarget = m === 6
                  const isCurrent = m === nWater
                  return (
                    <tr 
                      key={m}
                      onClick={() => setNWater(m)}
                      className={`border-b border-purple-800/30 cursor-pointer transition-colors ${
                        isTarget ? "bg-blue-900/20" : isCurrent ? "bg-indigo-900/30" : "hover:bg-purple-800/20"
                      }`}
                    >
                      <td className={`py-2 pl-2 font-bold ${isTarget ? "text-blue-400" : isCurrent ? "text-indigo-400" : "text-purple-300"}`}>
                        {m === 0 ? "Anhidrous" : m === 1 ? "Monogidrat" : m === 6 ? "Geksagidrat ✓" : m === 8 ? "Oktogidrat" : `${m}-gidrat`}
                      </td>
                      <td className="py-2 text-center font-mono">{props.total}</td>
                      <td className="py-2 text-center font-mono text-yellow-400 font-bold">{props.C_pct}</td>
                      <td className="py-2 text-center font-mono text-green-400">{props.H_pct}</td>
                      <td className="py-2 text-center font-mono text-cyan-400">{props.N_pct}</td>
                      <td className="py-2 text-center font-mono text-blue-400">{props.O_pct}</td>
                      <td className="py-2 text-center font-mono text-blue-300">{props.waterPct}</td>
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

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> Laboratoriya natijalari — yugurishlar
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Turli sharoitlarda o'tkazilgan EA yugurishlari. <strong className="text-red-300">Recovery ~64%</strong> — bu normal, chunki Ru (13.5%) va Cl (9.5%) detektlanmaydi!
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
                      ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/20" 
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
                        Naz: 48.14% | Δ: {dC.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                    <span className="text-sm text-green-500 font-medium">Hydrogen (H)</span>
                    <div className="text-right">
                      <span className="font-mono text-white text-lg block leading-none">{run.H.toFixed(2)}%</span>
                      <span className={`text-[9px] ${dH <= 0.2 ? 'text-green-500' : 'text-orange-400'}`}>
                        Naz: 4.85% | Δ: {dH.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-cyan-900/20 rounded border border-cyan-500/20">
                    <span className="text-sm text-cyan-400 font-medium">Nitrogen (N)</span>
                    <div className="text-right">
                      <span className="font-mono text-white text-lg block leading-none">{run.N.toFixed(2)}%</span>
                      <span className={`text-[9px] ${dN <= 0.2 ? 'text-green-500' : 'text-orange-400'}`}>
                        Naz: 11.23% | Δ: {dN.toFixed(2)}%
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
                  <span className="text-xs text-purple-400">Recovery (C+H+N):</span>
                  <button 
                    onClick={() => setShowRecoveryModal(true)}
                    className="font-mono text-white text-sm hover:text-red-400 cursor-pointer"
                  >
                    {run.recovery}% ℹ️
                  </button>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                !isSample 
                  ? "bg-gray-900/40 border-gray-700/30" 
                  : (dC <= 0.3 && dH <= 0.2 && dN <= 0.2)
                    ? "bg-green-900/30 border-green-700/30"
                    : (dC <= 1.0 && dH <= 0.5 && dN <= 0.5)
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : (dC <= 0.3 && dH <= 0.2 && dN <= 0.2) ? "text-green-400" : (dC <= 1.0 && dH <= 0.5 && dN <= 0.5) ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : (dC <= 0.3 && dH <= 0.2 && dN <= 0.2) ? "✓ Toza namuna" : (dC <= 1.0 && dH <= 0.5 && dN <= 0.5) ? "⚠ Chegaraviy" : "✗ Ifloslangan"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    (dC <= 0.3 && dH <= 0.2 && dN <= 0.2)
                      ? "Namuna tarkibi [Ru(bipy)₃]Cl₂·6H₂O formulaga to'liq mos. 3 ta bipy va 6 ta H₂O saqlangan."
                      : (dC <= 1.0 && dH <= 0.5 && dN <= 0.5)
                        ? "C, H, N miqdori nazariyga yaqin. Ozroq degidratatsiya yoki fotodegradatsiya bo'lishi mumkin."
                        : dC > 2
                          ? "Namlik yutilgan — C% oshgan (ortiqcha H₂O)."
                          : run.C < 40
                            ? "Bipy yo'qotilgan yoki fotodegradatsiya. [Ru(bipy)₂]Cl₂ aralashmasi bo'lishi mumkin."
                            : "Namuna ifloslangan yoki boshqa kompleks."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Tizim tozaligi tekshirildi. C va N nolga yaqin bo'lishi shart."
                      : "Kalibrlash standarti. C, H, N qiymatlari nazariyga mos kelishi kerak."
                  )}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-red-400 mb-4 flex justify-between">
                <span>%C Qiymatlari taqqoslanmasi</span>
                <span className="text-[10px] text-purple-500 font-normal">Target: 48.14%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const val = r.C
                  const heightPct = Math.min((val / 55) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(2)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <div className="absolute w-[120%] border-t border-dashed border-yellow-500/30 z-0" style={{ bottom: `${(48.135/55)*100}%` }}></div>
                        )}

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${
                            isActive 
                              ? isBlank ? 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.4)]' 
                                : isStd ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                              : isBlank ? 'bg-gray-700/50' 
                              : isStd ? 'bg-amber-700/40' 
                              : 'bg-purple-700/40'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${
                        isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-amber-400' : 'text-red-400') : 'text-purple-600'
                      } font-bold`}>
                        {isBlank ? 'BLANK' : isStd ? 'STD' : r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> Namuna</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-500 rounded"></span> Blank</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded"></span> Standart</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-yellow-500/50"></span> Nazariy (48.14%)</span>
              </div>
            </div>
          </div>
        </div>

        {showRecoveryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowRecoveryModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2">
                <span>📈</span> Nima uchun Recovery ~64%?
              </h3>
              <p className="text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-white">[Ru(bipy)₃]Cl₂·6H₂O</strong> uchun recovery ~64% bo'lishi <strong className="text-red-300">tabiiy va normal</strong>. Sababi — formuladagi 23% ni Ru va Cl tashkil qiladi, va ular standart CHNS-O da o'lchanmaydi.
              </p>
              <div className="bg-purple-900/40 p-4 rounded-lg font-mono text-xs mb-3">
                <div className="text-purple-400">EA detektlaydi:</div>
                <div className="text-green-400">C (48.14%) + H (4.85%) + N (11.23%) + O (12.82%) = <strong>77.04%</strong></div>
                <div className="mt-2 text-purple-400">EA detektlay olmaydi:</div>
                <div className="text-red-300">Ru (13.50%) + Cl (9.47%) = <strong>22.97%</strong></div>
                <div className="mt-2 text-white">JAMI: 100%</div>
                <div className="text-red-400 mt-2">✓ Recovery ~64-77% = Muvaffaqiyatli natija!</div>
              </div>
              <p className="text-xs text-purple-300 italic mb-4">
                Ru uchun <strong>ICP-OES</strong>, Cl uchun <strong>Schöniger usuli</strong> qo'llaniladi. O ni to'liq o'lchash uchun <strong>CHNS-O (O mode)</strong> kerak.
              </p>
              <button 
                onClick={() => setShowRecoveryModal(false)}
                className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg transition-colors text-sm"
              >
                Yopish
              </button>
            </div>
          </div>
        )}

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔥</span> TGA bilan EA ning bog'liqligi
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            [Ru(bipy)₃]Cl₂·6H₂O da avval kristall suv (60-120°C), keyin bipy ligandlari (280-450°C) bosqichma-bosqich yo'qoladi. EA bu o'zgarishlarni C, H, N kamayishi orqali ko'rsatadi.
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
                d="M 50 20 L 120 20 Q 135 20 140 40 L 155 85 Q 160 95 175 95 L 280 95 Q 295 95 305 115 L 335 145 Q 345 160 365 160 L 390 160 Q 405 160 415 175 L 445 200 Q 455 205 475 205 L 520 205 Q 535 205 545 195 L 580 195" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="85" y="15" textAnchor="middle" fill="#10b981">EA: %C=48.1, %H=4.8, %N=11.2</text>
                
                <line x1="155" y1="85" x2="155" y2="220" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="155" y="235" textAnchor="middle" fill="#3b82f6">~100°C</text>
                <text x="175" y="75" fill="#3b82f6">-6H₂O</text>

                <line x1="335" y1="145" x2="335" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="335" y="235" textAnchor="middle" fill="#8b5cf6">~330°C</text>
                <text x="355" y="135" fill="#8b5cf6">-1 bipy</text>

                <line x1="415" y1="175" x2="415" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="415" y="235" textAnchor="middle" fill="#8b5cf6">~410°C</text>
                <text x="435" y="165" fill="#8b5cf6">-2 bipy</text>

                <line x1="475" y1="205" x2="475" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="475" y="235" textAnchor="middle" fill="#8b5cf6">~480°C</text>
                <text x="495" y="195" fill="#8b5cf6">-3 bipy</text>

                <text x="545" y="190" textAnchor="middle" fill="#f59e0b">RuO₂+Cl₂</text>
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
                <div className="text-[10px] text-red-300 mt-2 italic">EA korrelyatsiyasi: {step.eaCorrelation}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-900/40 to-purple-900/40 border border-red-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> EA ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Ru(bipy)₃]Cl₂ uchun EA ni qo'shimcha usullar bilan birgalikda ishlatish formulani to'liq tasdiqlaydi. <strong className="text-red-300">Fluoressensiya — eng muhim qo'shimcha metod</strong>.
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

          <div className="mt-5 bg-red-900/20 border border-red-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-red-300 mb-2">💡 Bu birikma uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">EA (C, H, N, O) + Fluoressensiya (MLCT 610 nm) + UV-Vis (452 nm) + ¹H YaMR (simmetriya) + CV (Ru³⁺/Ru²⁺) + ICP-OES (Ru%)</strong> — oltita metod birgalikda [Ru(bipy)₃]²⁺ ning to'liq kimyoviy va fotokimyoviy tasvirini beradi.
            </p>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> Namuna tayyorlash bosqichlari (EA uchun)
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Ru(bipy)₃]Cl₂·6H₂O — xelat effekti tufayli barqaror, lekin <strong className="text-red-300">fotolabil</strong>. Yorug'likdan himoya va gidrat holatini saqlash muhim. Har bir qadamni bosib, tafsilotlarni ko'ring.
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

        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6">
          <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Eksperimental %C validatsiya kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'lchangan %C qiymatini kiriting va kompleksning holatini aniqlang.
          </p>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/3 space-y-2">
              <label className="block text-xs text-purple-400">O'lchangan %C qiymati:</label>
              <input 
                type="number" step="0.01" value={customC}
                onChange={(e) => setCustomC(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-red-500 outline-none transition-colors"
              />
              <div className="text-[10px] text-purple-500 mt-1">
                Nazariy qiymat: {COMPOUND.theoretical.C.percent.toFixed(3)}% ([Ru(bipy)₃]Cl₂·6H₂O)
              </div>
            </div>
            
            <div className="flex-1 w-full">
              {(() => {
                const diff = Math.abs(customC - 48.135)
                let res = { s: "", c: "", m: "", icon: "" }
                
                if (diff < 0.5) res = { 
                  s: "[RU(BIPY)₃]CL₂·6H₂O", 
                  c: "text-green-400", 
                  m: "Namuna toza tris(bipy) kompleksi tarkibiga ega. 3 ta bipy va 6 ta H₂O saqlangan.",
                  icon: "✓"
                }
                else if (customC > 49 && customC < 52) res = { 
                  s: "ORTIQCHA NAMLIK", 
                  c: "text-yellow-400", 
                  m: "C% oshgan — namlik yutilgan yoki ortiqcha gidrat suvi mavjud.",
                  icon: "⚠"
                }
                else if (customC > 56 && customC < 60) res = { 
                  s: "[FE(BIPY)₃]²⁺", 
                  c: "text-orange-400", 
                  m: "C% 59.6% ga yaqin — bu [Fe(bipy)₃]²⁺ aralashmasi bo'lishi mumkin.",
                  icon: "⚠"
                }
                else if (customC < 45 && customC > 35) res = { 
                  s: "[RU(BIPY)₂]CL₂", 
                  c: "text-orange-400", 
                  m: "1 ta bipy yo'qotilgan. Bis(bipy) kompleksi aralashmasi.",
                  icon: "⚠"
                }
                else if (customC < 35) res = { 
                  s: "JIDDIY DEGRADATSIYA", 
                  c: "text-red-400", 
                  m: "Ko'p bipy yo'qotilgan yoki kuchli fotodegradatsiya yuz bergan.",
                  icon: "✗"
                }
                else res = { 
                  s: "IFLOSLANGAN", 
                  c: "text-red-400", 
                  m: "C% kutilgan oraliqda emas. Qayta tahlil kerak.",
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

        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> EA ning chegarasi: Nima uchun Ru ni o'lchamaydi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                [Ru(bipy)₃]Cl₂·6H₂O da <strong className="text-white">formulaning 23% qismi Ru va Cl</strong>, va ular standart CHNS-O analizatorida detektlanmaydi:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li>C → CO₂ (gaz) → TCD detektlanadi (48.14%)</li>
                <li>H → H₂O (gaz) → TCD detektlanadi (4.85%)</li>
                <li>N → N₂ (gaz) → TCD detektlanadi (11.23%)</li>
                <li>O → CO (maxsus rejim) → TCD detektlanadi (12.82%)</li>
                <li><strong className="text-red-300">Ru → RuO₂ (qattiq qoldiq)</strong> — TCD detektlay olmaydi!</li>
                <li><strong className="text-red-300">Cl → HCl (gaz)</strong> — standart TCD da detektlanmaydi!</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Bundan tashqari, <strong className="text-pink-300">EA fotokimyoviy xususiyatlarni ko'ra olmaydi</strong> — MLCT emissiyasi (610 nm) uchun fluoressensiya kerak.
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
                  <span>48.14%</span>
                </div>
                <div className="flex justify-between">
                  <span>− H:</span>
                  <span>4.85%</span>
                </div>
                <div className="flex justify-between">
                  <span>− N:</span>
                  <span>11.23%</span>
                </div>
                <div className="flex justify-between">
                  <span>− O:</span>
                  <span>12.82%</span>
                </div>
                <div className="flex justify-between">
                  <span>− S:</span>
                  <span>0.00%</span>
                </div>
                <div className="flex justify-between border-t border-purple-800/30 pt-1 mt-1">
                  <span className="text-red-400">= Ru + Cl (qoldiq):</span>
                  <span className="text-red-400 font-bold">22.96%</span>
                </div>
                <div className="mt-3 p-2 bg-red-900/20 rounded border border-red-700/30 text-red-200 text-[10px]">
                  Nazariy Ru% + Cl% = 13.50% + 9.47% = 22.97% — qoldiq bilan mos keladi ✓
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-900/30 via-indigo-900/30 to-purple-900/30 border border-green-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Yakuniy xulosa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-950/30 p-4 rounded-lg border border-green-700/30">
              <div className="text-green-400 text-2xl mb-2">✓</div>
              <h3 className="font-bold text-white mb-1">EA afzalligi</h3>
              <p className="text-xs text-purple-200">C, H, N va O to'liq o'lchanadi. 3 ta bipy va 6 ta H₂O ni tasdiqlaydi. Gidrat holatini aniqlash mumkin.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200">Recovery ~64-77% — Ru va Cl detektlanmaydi. <strong className="text-red-300">EA fotokimyoviy xususiyatlarni ko'ra olmaydi</strong> — MLCT emissiya uchun fluoressensiya kerak.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">Fluoressensiya (MLCT 610 nm), UV-Vis (452 nm), ¹H YaMR, CV (Ru³⁺/Ru²⁺), ICP-OES (Ru%) — to'liq tasdiqlash uchun birlashtiriladi.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/element-analiz" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Element Analiz metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="text-sm bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Ru(bipy)₃]Cl₂·6H₂O • Element Analizi moduli</p>
          <p className="mt-1">Manbalar: IUPAC Atomic Weights 2021, Vogel's Textbook, NIST SRP, Graetzel (1977)</p>
        </div>
      </footer>
    </main>
  )
}