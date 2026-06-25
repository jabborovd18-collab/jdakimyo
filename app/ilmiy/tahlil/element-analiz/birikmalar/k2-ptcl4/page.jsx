"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// K₂[PtCl₄] — ELEMENT ANALIZI (EA) MAHSUS SAHIFASI
// Manbalar: IUPAC Atomic Weights 2021, Vogel's Quantitative Chemical Analysis
// Xususiyat: C, H, N, S, O MUTLAQO YO'Q — EA ishlamaydigan "anti-namuna"
// Maqsad: Faqat EA tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Pt: 195.084, K: 39.098, Cl: 35.450,
  C: 12.011, H: 1.008, N: 14.007, O: 15.999, S: 32.065
}

const COMPOUND = {
  formulaHTML: "K<sub>2</sub>[PtCl<sub>4</sub>]",
  formulaPlain: "K2[PtCl4]",
  iupac: "Kaliy tetraxloroplatinat(II)",
  formulaExpanded: "K₂PtCl₄",
  molarMass: 415.080,
  casNumber: "13683-63-1",
  color: "qizil-jigar rang kristallar",
  stability: "havoda barqaror, suvda eriydi, yorug'likda sezgir emas",
  
  historicalFact: {
    title: "Magnus yashil tuzi va birinchi koordinatsion polimer",
    text: "K₂[PtCl₄] — 1820-yillarda Heinrich Gustav Magnus tomonidan o'rganilgan va [Pt(NH₃)₄][PtCl₄] (Magnus yashil tuzi) sintezida asosiy reagent sifatida ishlatilgan. Bu birikma koordinatsion kimyoning eng qadimgi namunalaridan biri. Zeise tuzi K[PtCl₃(C₂H₄)]·H₂O (1827) ham K₂[PtCl₄] dan olingan — bu birinchi organometallik birikma edi. EA tahlilida K₂[PtCl₄] eng qiyin namuna hisoblanadi: uning tarkibida C, H, N, S, O — barcha organik elementlar mutlaqo yo'q. CHNS-O analizatori bu birikma uchun hech narsa o'lchay olmaydi — recovery 0%! Bu EA metodining eng katta cheklovini ko'rsatadigan ideal 'anti-namuna'.",
    year: "1820-1827"
  },

  ligandTypes: [
    { type: "Koordinatsion Cl⁻", count: 4, role: "Pt²⁺ ga kvadrat-tekis geometriyada bog'langan (d⁸)", eaImpact: "CHNS-O da detektlanmaydi — Schöniger kerak", lossTemp: "{'>400°C (Cl₂ ↑)'}" },
    { type: "K⁺ ionlari", count: 2, role: "Tashqi sfera — ion bog'lar orqali", eaImpact: "EA da detektlanmaydi (alkali metall)", lossTemp: "{'>800°C (KCl sifatida)'}" },
    { type: "Organik ligandlar", count: 0, role: "Mavjud emas!", eaImpact: "C, H, N — barchasi 0%", lossTemp: "—" }
  ],
  
  theoretical: {
    C:  { atoms: 0, mass: 0.000,   percent: 0.000, source: "Organik fragment YO'Q", eaChannel: "❌ Detektlanmaydi" },
    H:  { atoms: 0, mass: 0.000,   percent: 0.000, source: "Vodorod YO'Q", eaChannel: "❌ Detektlanmaydi" },
    N:  { atoms: 0, mass: 0.000,   percent: 0.000, source: "Azot YO'Q", eaChannel: "❌ Detektlanmaydi" },
    S:  { atoms: 0, mass: 0.000,   percent: 0.000, source: "Sulfur YO'Q", eaChannel: "❌ Detektlanmaydi" },
    O:  { atoms: 0, mass: 0.000,   percent: 0.000, source: "Kislorod YO'Q", eaChannel: "❌ Detektlanmaydi" },
    K:  { atoms: 2, mass: 78.196,  percent: 18.839, source: "Tashqi sfera K⁺", eaChannel: "Yoqilg'ida K₂O/KCl qoldig'i" },
    Pt: { atoms: 1, mass: 195.084, percent: 47.002, source: "Markaziy Pt²⁺", eaChannel: "Yoqilg'ida Pt qoldig'i" },
    Cl: { atoms: 4, mass: 141.800, percent: 34.159, source: "Koordinatsion Cl⁻", eaChannel: "❌ Standart CHNS-O da yo'q" }
  },

  experimentalRuns: [
    { id: "EA-24-351", date: "2024-12-01", method: "CHNS-O FlashSmart", C: 0.01, H: 0.02, N: 0.01, S: 0.00, recovery: 0.04, note: "Toza K₂[PtCl₄] — EA deyarli hech narsa ko'rmaydi!" },
    { id: "EA-24-352", date: "2024-12-01", method: "CHNS-O FlashSmart", C: 0.02, H: 0.03, N: 0.00, S: 0.01, recovery: 0.06, note: "Qayta o'lchov" },
    { id: "EA-24-353", date: "2024-12-02", method: "CHNS-O Vario EL",    C: 0.01, H: 0.02, N: 0.01, S: 0.00, recovery: 0.04, note: "Boshqa analizator — bir xil natija" },
    { id: "EA-24-354", date: "2024-12-02", method: "CHNS-O FlashSmart", C: 2.10, H: 0.15, N: 0.50, S: 0.02, recovery: 2.77, note: "Kapsula yomon yopilgan — organik ifloslanish!" },
    { id: "EA-24-355", date: "2024-12-03", method: "CHNS-O FlashSmart", C: 0.03, H: 0.05, N: 0.02, S: 0.01, recovery: 0.11, note: "Namlik yutilgan (H ozgina oshgan)" },
    { id: "EA-24-356", date: "2024-12-03", method: "CHNS-O FlashSmart", C: 15.20, H: 2.80, N: 4.50, S: 0.03, recovery: 22.5, note: "K[PtCl₃(NH₃)] aralashmasi — organik modda bor!" },
    { id: "BLANK-10",  date: "2024-12-01", method: "Blank (Empty Capsule)", C: 0.00, H: 0.02, N: 0.01, S: 0.00, recovery: 0.03, note: "Tizim tozaligi — K₂[PtCl₄] bilan bir xil!" },
    { id: "STD-SULFA", date: "2024-12-01", method: "Standard: Sulfanilamide", C: 41.82, H: 4.69, N: 16.28, S: 18.51, recovery: 99.9, note: "NIST kalibrlash standarti" }
  ],

  tgaSteps: [
    { start: 25,  end: 400, loss: 0.0,  event: "Termik barqaror zona", color: "#10b981", eaCorrelation: "EA da hech narsa o'zgarmaydi (0% signal)" },
    { start: 400, end: 550, loss: 8.5,  event: "2 Cl⁻ yo'qolishi (Cl₂ ↑)", color: "#ef4444", eaCorrelation: "EA da o'zgarish yo'q — Cl detektlanmaydi" },
    { start: 550, end: 750, loss: 8.5,  event: "Qolgan 2 Cl⁻ yo'qolishi", color: "#ef4444", eaCorrelation: "EA da o'zgarish yo'q" },
    { start: 750, end: 900, loss: 18.8, event: "K₂O/KCl sublimatsiyasi", color: "#f59e0b", eaCorrelation: "ICP-OES bilan tasdiqlash kerak" },
    { start: 900, end: 1000, loss: 0.0, event: "Pt metali qoldig'i", color: "#6366f1", eaCorrelation: "Gravimetriya — 47% qoldiq" }
  ],

  relatedMethods: [
    { name: "ICP-OES / ICP-MS", role: "Pt, K, va boshqa metallarni ppb darajasida o'lchaydi", eaAdvantage: "Formulaning 65.8% (Pt+K) to'g'ridan-to'g'ri o'lchanadi", eaDisadvantage: "Cl ni aniq o'lchay olmaydi (polyatomik interferensiya)", complementarity: "98%" },
    { name: "Schöniger usuli (halogen)", role: "Oksigen kolbasida yoqish + AgNO₃ titrlash orqali Cl%", eaAdvantage: "Cl% (34.16%) aniq miqdoriy beradi", eaDisadvantage: "Pt va K ni o'lchamaydi", complementarity: "92%" },
    { name: "AAS (Atom-Absorbsion)", role: "K⁺ ionini alanga fotometriyasi orqali o'lchaydi", eaAdvantage: "K% (18.84%) aniq o'lchanadi", eaDisadvantage: "Pt va Cl ni o'lchamaydi", complementarity: "88%" },
    { name: "XRD (SCXRD/PXRD)", role: "Kristall panjara, Pt-Cl masofa, K⁺ joylashuvi", eaAdvantage: "To'liq struktura — barcha atomlar aniqlanadi", eaDisadvantage: "Miqdoriy emas (faqat sifat)", complementarity: "95%" },
    { name: "IQ spektroskopiya", role: "Pt-Cl tebranishlari (330-340 cm⁻¹)", eaAdvantage: "Kvadrat-tekis geometriyani tasdiqlaydi", eaDisadvantage: "Elementar tarkib bermaydi", complementarity: "80%" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tanlash", desc: "Qizil-jigar rang kristallar. Sariq rang — K₂[PtCl₆] aralashmasi (Pt(IV)). Och rang — suyultirilgan.", time: "1 daq", critical: true },
    { step: 2, title: "Namlikdan himoya", desc: "K₂[PtCl₄] gigroskopik emas, lekin sirt namligi bo'lishi mumkin. 105°C da 1 soat quritish tavsiya etiladi.", time: "1 soat", critical: false },
    { step: 3, title: "Maydalash", desc: "Aqiq hovonchada mayda kukunga aylantiriladi. Bu noorganik birikma — organik ligandlar uchib ketmaydi.", time: "2-3 daq", critical: false },
    { step: 4, title: "Qalay kapsulaga joylash", desc: "5×9mm Sn kapsulaga 3.0-5.0 mg namuna tortiladi.", time: "3 daq", critical: true },
    { step: 5, title: "EA ni ishga tushirish", desc: "Kutilgan natija: C≈0%, H≈0%, N≈0%, S≈0%. Recovery ~0%!", time: "5-8 daq (analiz)", critical: false },
    { step: 6, title: "Xulosa chiqarish", desc: "Agar recovery 0% bo'lsa — bu namuna EA uchun mos EMAS. ICP-OES va Schöniger ga o'ting!", time: "darhol", critical: true }
  ],

  combustionPrinciple: {
    oxidationTemp: "1050°C",
    reductionTemp: "650°C (Cu)",
    products: {
      C: "CO₂ (TCD detektori) — YO'Q",
      H: "H₂O (TCD detektori) — YO'Q",
      N: "N₂ (TCD detektori) — YO'Q",
      S: "SO₂ (TCD detektori) — YO'Q",
      Cl: "HCl (standart TCD da detektlanmaydi)",
      Pt: "Pt metali (qattiq qoldiq)",
      K: "K₂O/KCl (qattiq qoldiq)"
    },
    equations: [
      { reactant: "K₂[PtCl₄]", process: "+ O₂ (1050°C)", products: "Pt (qattiq) + K₂O + KCl + Cl₂ ↑" },
      { reactant: "Organik elementlar", process: "→", products: "❌ MAVJUD EMAS — TCD da signal yo'q" },
      { reactant: "Pt²⁺", process: "Kamerasida qoldiq", products: "Pt metali — ICP-OES bilan tasdiqlanadi" }
    ]
  }
}

function calculatePlatinumChloride(ptCount, kCount, clCount) {
  const ptMass = ptCount * ATOMIC_MASSES.Pt
  const kMass = kCount * ATOMIC_MASSES.K
  const clMass = clCount * ATOMIC_MASSES.Cl
  const total = ptMass + kMass + clMass
  return {
    total: parseFloat(total.toFixed(3)),
    Pt_pct: parseFloat(((ptMass / total) * 100).toFixed(3)),
    K_pct: parseFloat(((kMass / total) * 100).toFixed(3)),
    Cl_pct: parseFloat(((clMass / total) * 100).toFixed(3)),
    eaRecovery: 0.00
  }
}

export default function K2PtCl4Page() {
  const [activeRun, setActiveRun] = useState("EA-24-351")
  const [selectedCompound, setSelectedCompound] = useState(2)
  const [customCl, setCustomCl] = useState(34.16)
  const [selectedLigandType, setSelectedLigandType] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)

  const platinumChlorides = useMemo(() => [
    { name: "PtCl₂", formula: "PtCl₂", ptCount: 1, kCount: 0, clCount: 2, props: calculatePlatinumChloride(1, 0, 2) },
    { name: "K[PtCl₃]", formula: "K[PtCl₃]", ptCount: 1, kCount: 1, clCount: 3, props: calculatePlatinumChloride(1, 1, 3) },
    { name: "K₂[PtCl₄] ✓", formula: "K₂[PtCl₄]", ptCount: 1, kCount: 2, clCount: 4, props: calculatePlatinumChloride(1, 2, 4) },
    { name: "K₂[PtCl₆]", formula: "K₂[PtCl₆]", ptCount: 1, kCount: 2, clCount: 6, props: calculatePlatinumChloride(1, 2, 6) },
    { name: "K[PtCl₅]", formula: "K[PtCl₅]", ptCount: 1, kCount: 1, clCount: 5, props: calculatePlatinumChloride(1, 1, 5) }
  ], [])

  const calc = platinumChlorides[selectedCompound].props

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const totalSignal = run.C + run.H + run.N + run.S

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      
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
            <span className="text-rose-400 font-semibold">K₂[PtCl₄]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-rose-400 flex items-center gap-2">
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
                <span className="px-2 py-1 rounded bg-rose-900/30 border border-rose-700/50 text-rose-400 text-[10px] uppercase tracking-wide">Noorganik</span>
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">EA Ishlamaydi!</span>
                <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">Kvadrat-Tekis</span>
                <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Recovery 0%</span>
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
        <div className="bg-gradient-to-r from-rose-900/40 to-purple-900/40 border border-rose-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (EA uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">K₂[PtCl₄]</strong> — platina(II) ning to'liq noorganik kompleksi. EA tahlilida <strong className="text-rose-300">eng qiyin 'anti-namuna'</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-rose-500 text-xs md:text-sm">
                <li><strong className="text-red-400">C, H, N, S, O — BARCHASI 0%</strong> — EA ning barcha kanallari bo'sh</li>
                <li><strong className="text-rose-300">Recovery ~0%</strong> — CHNS-O hech narsa o'lchay olmaydi</li>
                <li>Formulaning <strong className="text-white">100%</strong> metallar (Pt+K = 65.8%) va halogenlardan (Cl = 34.2%) iborat</li>
                <li>EA bu birikma uchun <strong className="text-red-300">umuman foydasiz</strong> — boshqa metodlar kerak</li>
                <li>Blank test bilan bir xil natija — tizim tozaligini ko'rsatadi</li>
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

        {/* 1b. EA NIMA UCHUN ISHLAMAYDI */}
        <div className="bg-gradient-to-r from-red-900/40 to-rose-900/40 border border-red-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🚫</span> Nima uchun EA bu birikma uchun ishlamaydi?
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            <strong className="text-red-300">Standart CHNS-O Element Analizatori</strong> faqat quyidagi elementlarni o'lchaydi: <strong>C, H, N, S (va maxsus rejimda O)</strong>. K₂[PtCl₄] da bularning hech biri yo'q!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {['C', 'H', 'N', 'S'].map(el => (
              <div key={el} className="bg-red-950/40 p-4 rounded-xl border border-red-700/30 text-center">
                <div className="text-2xl font-bold text-red-400">{el}</div>
                <div className="text-xs text-purple-400 mt-1">Atomlar soni</div>
                <div className="text-3xl font-mono text-white mt-2">0</div>
                <div className="text-[10px] text-red-300 mt-1">❌ Mavjud emas</div>
              </div>
            ))}
          </div>

          <div className="bg-purple-950/50 p-4 rounded-xl border border-rose-700/30">
            <h3 className="text-rose-400 font-bold text-sm mb-3">EA o'rniga nima ishlatish kerak?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-green-900/20 p-3 rounded border border-green-700/30">
                <strong className="text-green-400">Pt uchun:</strong>
                <p className="text-purple-200 mt-1">ICP-OES / ICP-MS</p>
              </div>
              <div className="bg-green-900/20 p-3 rounded border border-green-700/30">
                <strong className="text-green-400">Cl uchun:</strong>
                <p className="text-purple-200 mt-1">Schöniger usuli</p>
              </div>
              <div className="bg-green-900/20 p-3 rounded border border-green-700/30">
                <strong className="text-green-400">K uchun:</strong>
                <p className="text-purple-200 mt-1">AAS / Alanga fotometriyasi</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. EA PRINSIPI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔥</span> EA ning ishlash prinsipi — va nima uchun bu safar bo'sh
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            CHNS-O analizatori namunani 1050°C da yoqadi va hosil bo'lgan gazlarni TCD detektori bilan o'lchaydi. K₂[PtCl₄] da <strong className="text-rose-300">organik gazlar hosil bo'lmaydi</strong> — faqat Pt va K qoldig'i qoladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">1. Yoqish kamerasi</div>
              <div className="text-2xl font-mono text-orange-400">{COMPOUND.combustionPrinciple.oxidationTemp}</div>
              <div className="text-xs text-purple-300 mt-2">O₂ + 1050°C — organik gazlar YO'Q</div>
            </div>
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">2. Reduksiya kamerasi</div>
              <div className="text-2xl font-mono text-red-400">{COMPOUND.combustionPrinciple.reductionTemp}</div>
              <div className="text-xs text-purple-300 mt-2">Cu — NOₓ larni N₂ ga aylantiradi (N YO'Q)</div>
            </div>
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">3. Deteksiya</div>
              <div className="text-2xl font-mono text-blue-400">0.00%</div>
              <div className="text-xs text-purple-300 mt-2">TCD — signal yo'q (blank bilan bir xil)</div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-rose-400 font-bold text-xs uppercase mb-3">Bu birikma uchun yoqish reaksiyasi:</h3>
            <div className="space-y-3 font-mono text-xs">
              {COMPOUND.combustionPrinciple.equations.map((eq, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center gap-2 p-3 bg-purple-900/30 rounded border-l-4 border-rose-500">
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
            <span>📐</span> Nazariy element tarkibi
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            E'tibor bering: <strong className="text-rose-300">C, H, N, S, O — barchasi 0%</strong>. Faqat metallar va halogenlar bor.
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
                      <td className="py-3 pl-2 font-bold text-rose-400">{el}</td>
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
                <tr className="bg-rose-900/20 font-bold border-t border-rose-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center text-white">7</td>
                  <td className="py-3"></td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-rose-300">EA recovery: 0.00%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. PLATINA XLORIDLARI TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🧬</span> Platina xloridlari oilasi — EA barchasida 0%!
            </h2>
            <span className="text-xs text-rose-400 bg-rose-950/50 px-3 py-1 rounded border border-rose-700/30">
              Joriy: {platinumChlorides[selectedCompound].formula}
            </span>
          </div>

          <p className="text-sm text-purple-300 mb-6">
            <strong className="text-rose-300">Barcha noorganik platina xloridlari</strong> EA da bir xil natija beradi — <strong className="text-rose-300">recovery 0%</strong>. Chunki ularning hech birida organik elementlar yo'q. EA ularni farqlay OLMAYDI!
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
                <label className="block text-xs text-purple-400 mb-2">Birikmani tanlang:</label>
                <div className="grid grid-cols-2 gap-2">
                  {platinumChlorides.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedCompound(i)}
                      className={`p-2 rounded border transition-all text-xs ${
                        selectedCompound === i
                          ? "bg-rose-900/40 border-rose-500 text-white"
                          : "bg-purple-900/20 border-purple-700/30 text-purple-300 hover:border-rose-500/50"
                      }`}
                    >
                      <div className="font-bold">{c.formula}</div>
                      <div className="text-[10px] text-purple-400">{c.name}</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">Mol. massa</div>
                    <div className="text-xl font-mono text-white mt-1">{calc.total}</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-rose-400 uppercase">EA Recovery</div>
                    <div className="text-xl font-mono text-rose-400 mt-1">{calc.eaRecovery}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-red-400 uppercase">%Pt</div>
                    <div className="text-xl font-mono text-red-400 mt-1">{calc.Pt_pct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-cyan-400 uppercase">%Cl</div>
                    <div className="text-xl font-mono text-cyan-400 mt-1">{calc.Cl_pct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20 col-span-2">
                    <div className="text-[10px] text-yellow-400 uppercase">%K</div>
                    <div className="text-xl font-mono text-yellow-400 mt-1">{calc.K_pct}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                <h3 className="text-rose-400 font-bold text-xs uppercase mb-3 flex items-center gap-2">
                  <span>🧩</span> Ligand turlari
                </h3>
                <div className="space-y-2">
                  {COMPOUND.ligandTypes.map((w, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedLigandType(i)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedLigandType === i 
                          ? "bg-rose-900/40 border-rose-500" 
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
                {[0, 10, 20, 30, 40, 50].map(v => (
                  <g key={v}>
                    <line x1="40" y1={210 - (v/50)*180} x2="380" y2={210 - (v/50)*180} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="3,3" />
                    <text x="35" y={214 - (v/50)*180} textAnchor="end" fontSize="9" fill="#a78bfa">{v}%</text>
                  </g>
                ))}
                
                <line x1="40" y1="210" x2="380" y2="210" stroke="#ef4444" strokeWidth="2" />
                <text x="385" y="213" fontSize="8" fill="#ef4444">Recovery = 0%</text>

                <polyline 
                  fill="none" stroke="#f43f5e" strokeWidth="2.5" opacity="0.7"
                  points={platinumChlorides.map((c, i) => {
                    const x = 40 + (i/(platinumChlorides.length-1)) * 340
                    const y = 210 - (c.props.Pt_pct / 50) * 180
                    return `${x},${y}`
                  }).join(" ")}
                />

                {platinumChlorides.map((c, i) => {
                  const x = 40 + (i/(platinumChlorides.length-1)) * 340
                  const y = 210 - (c.props.Pt_pct / 50) * 180
                  const isActive = i === selectedCompound
                  return (
                    <g key={i} style={{ cursor: 'pointer' }} onClick={() => setSelectedCompound(i)}>
                      <circle cx={x} cy={y} r={isActive ? 7 : 4} 
                        fill={isActive ? "#fbbf24" : "#f43f5e"} 
                        stroke={isActive ? "#fff" : "#f43f5e"} 
                        strokeWidth={isActive ? 2 : 1} />
                      {isActive && (
                        <>
                          <line x1={x} y1={y} x2={x} y2="210" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />
                          <rect x={x-34} y={y-32} width="68" height="22" rx="4" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="1" />
                          <text x={x} y={y-17} textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">%Pt: {c.props.Pt_pct.toFixed(1)}</text>
                        </>
                      )}
                    </g>
                  )
                })}

                <line x1="40" y1="210" x2="380" y2="210" stroke="#a78bfa" strokeWidth="1" />
                {platinumChlorides.map((c, i) => (
                  <text 
                    key={i} 
                    x={40 + (i/(platinumChlorides.length-1))*340} 
                    y="225" 
                    textAnchor="middle" 
                    fontSize="8" 
                    fill={i===selectedCompound ? "#fbbf24" : "#64748b"} 
                    fontWeight={i===selectedCompound ? "bold" : "normal"}
                  >
                    {c.formula}
                  </text>
                ))}
                <text x="210" y="238" textAnchor="middle" fontSize="9" fill="#a78bfa">Platina xloridlari | Barchasida EA = 0%</text>
              </svg>
            </div>
          </div>
        </div>

        {/* 5. BARCHA PLATINA XLORIDLARI JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>📊</span> Barcha platina xloridlari — EA natijalari
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            <strong className="text-rose-300">Barchasida C, H, N, S = 0%</strong> — EA ularni farqlay OLMAYDI. Faqat ICP-OES va Schöniger farqlaydi.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 uppercase tracking-wider">
                  <th className="py-2 text-left pl-2">Birikma</th>
                  <th className="py-2 text-center">M (g/mol)</th>
                  <th className="py-2 text-center text-red-400">%Pt</th>
                  <th className="py-2 text-center text-yellow-400">%K</th>
                  <th className="py-2 text-center text-cyan-400">%Cl</th>
                  <th className="py-2 text-center text-rose-400">EA Recovery</th>
                  <th className="py-2 text-left">Izoh</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {platinumChlorides.map((c, i) => {
                  const isTarget = i === 2
                  const isCurrent = i === selectedCompound
                  return (
                    <tr 
                      key={i}
                      onClick={() => setSelectedCompound(i)}
                      className={`border-b border-purple-800/30 cursor-pointer transition-colors ${
                        isTarget ? "bg-rose-900/20" : isCurrent ? "bg-indigo-900/30" : "hover:bg-purple-800/20"
                      }`}
                    >
                      <td className={`py-2 pl-2 font-bold ${isTarget ? "text-rose-400" : isCurrent ? "text-indigo-400" : "text-purple-300"}`}>
                        {c.name}
                      </td>
                      <td className="py-2 text-center font-mono">{c.props.total}</td>
                      <td className="py-2 text-center font-mono text-red-400 font-bold">{c.props.Pt_pct}</td>
                      <td className="py-2 text-center font-mono text-yellow-400">{c.props.K_pct}</td>
                      <td className="py-2 text-center font-mono text-cyan-400">{c.props.Cl_pct}</td>
                      <td className="py-2 text-center font-mono text-rose-400 font-bold">{c.props.eaRecovery}%</td>
                      <td className="py-2 text-[10px] italic text-purple-400">
                        {isTarget ? "✓ Maqsad" : isCurrent ? "🎯 Joriy" : "EA = 0%"}
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
            Turli sharoitlarda o'tkazilgan EA yugurishlari. <strong className="text-rose-300">{"Recovery ~0%"}</strong> — bu normal va kutilgan natija! Agar <strong className="text-rose-300">{"recovery > 1%"}</strong> bo'lsa, bu <strong className="text-red-300">ifloslanish belgisi</strong>.
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
                      ? "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-500/20" 
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
                        Kutilgan: 0.00%
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

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 font-medium">Nitrogen (N)</span>
                    <div className="text-right">
                      <span className="font-mono text-white block">{run.N.toFixed(2)}%</span>
                      <span className={`text-[9px] ${run.N <= 0.05 ? 'text-green-500' : 'text-red-400'}`}>
                        Kutilgan: 0.00%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 font-medium">Sulfur (S)</span>
                    <div className="text-right">
                      <span className="font-mono text-white block">{run.S.toFixed(2)}%</span>
                      <span className={`text-[9px] ${run.S <= 0.05 ? 'text-green-500' : 'text-red-400'}`}>
                        Kutilgan: 0.00%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center p-2 bg-purple-900/30 rounded">
                  <span className="text-xs text-purple-400">Recovery:</span>
                  <button 
                    onClick={() => setShowRecoveryModal(true)}
                    className="font-mono text-white text-sm hover:text-rose-400 cursor-pointer"
                  >
                    {run.recovery}% ℹ️
                  </button>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                !isSample 
                  ? "bg-gray-900/40 border-gray-700/30" 
                  : totalSignal <= 0.10
                    ? "bg-green-900/30 border-green-700/30"
                    : totalSignal <= 0.50
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : totalSignal <= 0.10 ? "text-green-400" : totalSignal <= 0.50 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : totalSignal <= 0.10 ? "✓ Kutilgan natija" : totalSignal <= 0.50 ? "⚠ Ozgina signal" : "✗ Ifloslangan!"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    totalSignal <= 0.10
                      ? "Kutilgan natija — K₂[PtCl₄] da organik elementlar yo'q. Recovery ~0% — bu TO'G'RI."
                      : totalSignal <= 0.50
                        ? "Ozgina signal — namlik yutilgan yoki sirt ifloslanishi bo'lishi mumkin."
                        : run.C > 1
                          ? "Jiddiy organik ifloslanish — kapsula yoki boshqa modda aralashgan."
                          : "Namuna boshqa birikma bo'lishi mumkin (masalan, organik ligandli platina kompleksi)."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Tizim tozaligi — K₂[PtCl₄] bilan deyarli bir xil natija!"
                      : "Kalibrlash standarti — bu yerda EA to'g'ri ishlaydi."
                  )}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-rose-400 mb-4 flex justify-between">
                <span>Umumiy organik signal (C+H+N+S)</span>
                <span className="text-[10px] text-purple-500 font-normal">Kutilgan: ~0%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const val = r.C + r.H + r.N + r.S
                  const heightPct = Math.min((val / 30) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(2)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        <div className="absolute w-[120%] border-t border-dashed border-red-500/30 z-0" style={{ bottom: '2%' }}></div>

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${
                            isActive 
                              ? isBlank ? 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.4)]' 
                                : isStd ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : val > 1 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
                              : isBlank ? 'bg-gray-700/50' 
                              : isStd ? 'bg-amber-700/40' 
                              : 'bg-purple-700/40'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${
                        isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-amber-400' : 'text-rose-400') : 'text-purple-600'
                      } font-bold`}>
                        {isBlank ? 'BLANK' : isStd ? 'STD' : r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-rose-500 rounded"></span> Namuna</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-500 rounded"></span> Blank</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded"></span> Standart</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-red-500/50"></span> Kutilgan (0%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RECOVERY MODAL */}
        {showRecoveryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowRecoveryModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-rose-400 mb-3 flex items-center gap-2">
                <span>📈</span> Nima uchun Recovery 0%?
              </h3>
              <p className="text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-white">K₂[PtCl₄]</strong> uchun recovery 0% bo'lishi <strong className="text-rose-300">kutilgan va to'g'ri natija</strong>. Sababi — formulada <strong>C, H, N, S, O — hech qaysi organik element yo'q</strong>.
              </p>
              <div className="bg-purple-900/40 p-4 rounded-lg font-mono text-xs mb-3">
                <div className="text-purple-400">EA detektlaydi:</div>
                <div className="text-green-400">C (0%) + H (0%) + N (0%) + S (0%) + O (0%) = <strong>0.00%</strong></div>
                <div className="mt-2 text-purple-400">EA detektlay olmaydi:</div>
                <div className="text-red-300">Pt (47.00%) + K (18.84%) + Cl (34.16%) = <strong>100.00%</strong></div>
                <div className="mt-2 text-white">JAMI: 100%</div>
                <div className="text-rose-400 mt-2">✓ Recovery 0% = Toza noorganik birikma!</div>
              </div>
              <p className="text-xs text-purple-300 italic mb-4">
                Bu birikma uchun <strong>ICP-OES</strong> (Pt, K), <strong>Schöniger</strong> (Cl) va <strong>AAS</strong> (K) metodlari kerak.
              </p>
              <button 
                onClick={() => setShowRecoveryModal(false)}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white py-2 rounded-lg transition-colors text-sm"
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
            K₂[PtCl₄] da Cl₂ yo'qolishi TGA da ko'rinadi, lekin EA da <strong className="text-rose-300">hech narsa o'zgarmaydi</strong> — chunki Cl standart CHNS-O da detektlanmaydi.
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
                d="M 50 20 L 250 20 Q 270 20 280 40 L 310 80 Q 320 95 340 95 L 380 95 Q 400 95 410 110 L 440 140 Q 450 155 470 155 L 510 155 Q 530 155 540 175 L 580 200" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="150" y="15" textAnchor="middle" fill="#10b981">EA: C=0%, H=0%, N=0%, S=0%</text>
                
                <line x1="310" y1="80" x2="310" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="310" y="235" textAnchor="middle" fill="#ef4444">~450°C</text>
                <text x="330" y="70" fill="#ef4444">-2 Cl⁻</text>

                <line x1="440" y1="140" x2="440" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="440" y="235" textAnchor="middle" fill="#ef4444">~650°C</text>
                <text x="460" y="130" fill="#ef4444">-2 Cl⁻</text>

                <text x="495" y="150" textAnchor="middle" fill="#f59e0b">K₂O/Pt</text>

                <line x1="540" y1="175" x2="540" y2="220" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="540" y="235" textAnchor="middle" fill="#6366f1">~850°C</text>
                <text x="560" y="170" fill="#6366f1">K sublim.</text>
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
                <div className="text-[10px] text-rose-300 mt-2 italic">EA korrelyatsiyasi: {step.eaCorrelation}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. YAQIN USULLAR */}
        <div className="bg-gradient-to-r from-rose-900/40 to-purple-900/40 border border-rose-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> EA ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            K₂[PtCl₄] uchun EA <strong className="text-rose-300">umuman foydasiz</strong>. Quyidagi metodlar zarur:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-rose-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-rose-300">{m.name}</h3>
                  <div className="text-right">
                    <div className="text-[10px] text-purple-400">To'ldiruvchi</div>
                    <div className="text-lg font-bold text-green-400">{m.complementarity}</div>
                  </div>
                </div>
                <p className="text-xs text-purple-200 mb-3">{m.role}</p>
                <div className="space-y-2 text-[10px]">
                  <div className="flex gap-2">
                    <span className="text-green-400">✓ EA dan ustun:</span>
                    <span className="text-purple-300">{m.eaAdvantage}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-400">✗ Kamchilik:</span>
                    <span className="text-purple-300">{m.eaDisadvantage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 bg-rose-900/20 border border-rose-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-rose-300 mb-2">💡 Bu birikma uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">ICP-OES (Pt, K) + Schöniger (Cl%) + AAS (K%) + XRD (struktura) + IQ (Pt-Cl)</strong> — beshta metod birgalikda K₂[PtCl₄] ni to'liq tasdiqlaydi. <strong className="text-rose-300">EA bu ro'yxatda YO'Q!</strong>
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> Namuna tayyorlash bosqichlari
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            K₂[PtCl₄] noorganik birikma — organik ligandlar uchib ketmaydi. Lekin EA uchun tayyorlash <strong className="text-rose-300">foydasiz</strong> — natija baribir 0% bo'ladi. Shuning uchun ICP-OES yoki Schöniger uchun tayyorlash kerak.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => (
                <button
                  key={s.step}
                  onClick={() => setActivePrepStep(s.step)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activePrepStep === s.step
                      ? "bg-rose-900/40 border-rose-500"
                      : "bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activePrepStep === s.step ? "bg-rose-500 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-rose-400">Qadam {current.step}: {current.title}</h3>
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
        <div className="bg-rose-900/20 border border-rose-500/30 rounded-2xl p-6">
          <h3 className="text-rose-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Eksperimental %Cl validatsiya kalkulyatori (Schöniger usuli uchun)
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            <strong className="text-rose-300">EA bu birikma uchun ishlamaydi!</strong> O'rniga Schöniger usulida o'lchangan %Cl ni kiriting.
          </p>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/3 space-y-2">
              <label className="block text-xs text-purple-400">O'lchangan %Cl qiymati (Schöniger):</label>
              <input 
                type="number" step="0.01" value={customCl}
                onChange={(e) => setCustomCl(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-rose-500 outline-none transition-colors"
              />
              <div className="text-[10px] text-purple-500 mt-1">
                Nazariy qiymat: {COMPOUND.theoretical.Cl.percent.toFixed(3)}% (K₂[PtCl₄] uchun)
              </div>
            </div>
            
            <div className="flex-1 w-full">
              {(() => {
                const diff = Math.abs(customCl - 34.159)
                let res = { s: "", c: "", m: "", icon: "" }
                
                if (diff < 0.5) res = { 
                  s: "K₂[PtCl₄]", 
                  c: "text-green-400", 
                  m: "Namuna toza kaliy tetraxloroplatinat(II) tarkibiga ega. 4 ta Cl to'liq saqlangan.",
                  icon: "✓"
                }
                else if (customCl > 38 && customCl < 42) res = { 
                  s: "K₂[PtCl₆]", 
                  c: "text-yellow-400", 
                  m: "6 ta Cl bor — bu K₂[PtCl₆] (Pt(IV)) bo'lishi mumkin.",
                  icon: "⚠"
                }
                else if (customCl > 42) res = { 
                  s: "KO'P XLORLI", 
                  c: "text-orange-400", 
                  m: "Cl juda ko'p — boshqa xlorid aralashmasi bo'lishi mumkin.",
                  icon: "⚠"
                }
                else if (customCl < 28 && customCl > 20) res = { 
                  s: "K[PtCl₃] YOKI PtCl₂", 
                  c: "text-orange-400", 
                  m: "Cl kamroq — K[PtCl₃] yoki PtCl₂ aralashmasi bo'lishi mumkin.",
                  icon: "⚠"
                }
                else if (customCl < 20) res = { 
                  s: "JUDA KAM XLOR", 
                  c: "text-red-400", 
                  m: "Cl juda kam — boshqa birikma yoki ifloslanish.",
                  icon: "✗"
                }
                else res = { 
                  s: "ARALASHMA", 
                  c: "text-red-400", 
                  m: "Cl qiymati kutilgan oraliqda emas. Qayta tahlil kerak.",
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

        {/* 11. QIZIQ FAKT */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> EA ning chegarasi: Nima uchun bu birikma uchun ishlamaydi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                K₂[PtCl₄] — <strong className="text-white">to'liq noorganik</strong> birikma. Standart CHNS-O analizatori faqat organik elementlarni o'lchaydi:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li>C → CO₂ — <strong className="text-red-300">Mavjud emas</strong></li>
                <li>H → H₂O — <strong className="text-red-300">Mavjud emas</strong></li>
                <li>N → N₂ — <strong className="text-red-300">Mavjud emas</strong></li>
                <li>S → SO₂ — <strong className="text-red-300">Mavjud emas</strong></li>
                <li><strong className="text-red-300">Pt → qattiq qoldiq</strong> — detektlanmaydi</li>
                <li><strong className="text-red-300">K → qattiq qoldiq</strong> — detektlanmaydi</li>
                <li><strong className="text-red-300">Cl → HCl</strong> — standart TCD da detektlanmaydi</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Natija: <strong>Recovery = 0%</strong>. Bu birikma EA metodining <strong>eng katta cheklovini</strong> ko'rsatadi.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-red-400 font-bold text-xs uppercase mb-3">Tarkibni hisoblash:</h4>
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
                  <span>0.00%</span>
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
                  <span className="text-red-400">= Pt + K + Cl (qoldiq):</span>
                  <span className="text-red-400 font-bold">100.00%</span>
                </div>
                <div className="mt-3 p-2 bg-red-900/20 rounded border border-red-700/30 text-red-200 text-[10px]">
                  EA recovery: 0.00% — formulaning 100% detektlanmaydi ✗
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
            <div className="bg-red-950/30 p-4 rounded-lg border border-red-700/30">
              <div className="text-red-400 text-2xl mb-2">✗</div>
              <h3 className="font-bold text-white mb-1">EA kamchiligi</h3>
              <p className="text-xs text-purple-200">K₂[PtCl₄] da C, H, N, S, O — barchasi 0%. EA hech narsa o'lchay olmaydi. Recovery 0% — bu birikma EA uchun <strong>umuman mos emas</strong>.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">EA ning cheklovi</h3>
              <p className="text-xs text-purple-200">Bu misol EA ning <strong>eng katta cheklovini</strong> ko'rsatadi — faqat organik elementlarni o'lchaydi. Noorganik birikmalar uchun boshqa metodlar kerak.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Zarur metodlar</h3>
              <p className="text-xs text-purple-200">ICP-OES (Pt, K), Schöniger (Cl%), AAS (K%), XRD (struktura), IQ (Pt-Cl) — to'liq tasdiqlash uchun birlashtiriladi.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/element-analiz" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Element Analiz metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="text-sm bg-rose-600 hover:bg-rose-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • K₂[PtCl₄] • Element Analizi moduli</p>
          <p className="mt-1">Manbalar: IUPAC Atomic Weights 2021, Vogel's Textbook, NIST SRP, Magnus (1828)</p>
        </div>
      </footer>
    </main>
  )
}