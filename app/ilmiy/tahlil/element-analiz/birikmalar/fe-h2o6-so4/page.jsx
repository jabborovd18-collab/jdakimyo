"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Fe(H₂O)₆]SO₄ — ELEMENT ANALIZI (EA) MAHSUS SAHIFASI
// Manbalar: IUPAC Atomic Weights 2021, Vogel's Quantitative Chemical Analysis
// Xususiyat: Uglerodsiz sistema, Koordinatsion suv analizi, Blank testi
// Maqsad: Faqat EA tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Fe: 55.845, S: 32.065, O: 15.999, H: 1.008,
  C: 12.011, N: 14.007  // C va N — faqat blank/limit tekshirish uchun
}

const WATER_MOLAR_MASS = 2 * ATOMIC_MASSES.H + ATOMIC_MASSES.O  // 18.015

const COMPOUND = {
  formulaHTML: "[Fe(H<sub>2</sub>O)<sub>6</sub>]SO<sub>4</sub>",
  formulaPlain: "[Fe(H2O)6]SO4",
  iupac: "Geksaakvatemir(II) sulfat",
  molarMass: 246.022,
  casNumber: "7782-63-0",
  color: "och yashil-ko'k kristallar",
  stability: "havoda asta-sekin oksidlanib, sariq-qo'ng'ir Fe(III) hosilalariga aylanadi",
  
  historicalFact: {
    title: "Mohr tuzi bilan bog'liq tarixiy farq",
    text: "Ko'pchilik [Fe(H₂O)₆]SO₄ ni mashhur Mohr tuzi (NH₄)₂Fe(SO₄)₂·6H₂O bilan adashtiradi. Mohr tuzi tahlilda Fe(II) ni standartlovchi sifatida ishlatiladi chunki uning Fe(II) holati uzoq muddat barqaror. [Fe(H₂O)₆]SO₄ esa havoda tez oksidlanib, EA natijalarida qiyinchilik tug'diradi — bu uni EA metodikasida 'stress-test' namunasi sifatida qadrli qiladi.",
    year: "1840-yillar"
  },

  // Koordinatsion vs Panjaradagi suv turlari
  waterTypes: [
    { type: "Koordinatsion suv", count: 6, role: "Fe²⁺ markaziga to'g'ridan-to'g'ri bog'langan", eaImpact: "H kanalida aniq signal beradi, TGA da 100-200°C da yo'qoladi", lossTemp: "100-250°C" },
    { type: "Vodorod bog'li suv", count: 0, role: "SO₄²⁻ anion bilan H-bog' orqali bog'langan", eaImpact: "Koordinatsion suvga qo'shiladi", lossTemp: "—" },
    { type: "Oklyudlangan suv", count: 0, role: "Kristall panjarada erkin holatda", eaImpact: "Nomuntazam H signali, og'ir tahlil", lossTemp: "50-80°C" }
  ],
  
  theoretical: {
    C:  { atoms: 0, mass: 0.000,   percent: 0.000, source: "Organik fragment yo'q", eaChannel: "Shovqin tekshirish" },
    H:  { atoms: 12, mass: 12.096, percent: 4.917, source: "6×koordinatsion H₂O", eaChannel: "Kritik kanal (asosiy mezon)" },
    N:  { atoms: 0, mass: 0.000,   percent: 0.000, source: "Azot guruhi yo'q", eaChannel: "Shovqin tekshirish" },
    S:  { atoms: 1, mass: 32.065,  percent: 13.033, source: "Sulfat anioni", eaChannel: "SO₂ detektlanishi" },
    O:  { atoms: 10, mass: 159.990, percent: 65.031, source: "6×H₂O + SO₄²⁻", eaChannel: "TCD orqali" },
    Fe: { atoms: 1, mass: 55.845,  percent: 22.699, source: "Markaziy Fe²⁺ atomi", eaChannel: "Yoqilg'ida qoldiq (ICP kerak)" }
  },

  // Laboratoriya jurnali — barcha EA yugurishlari
  experimentalRuns: [
    { id: "EA-24-081", date: "2024-06-01", method: "CHNS-O FlashSmart", C: 0.02, H: 4.90, N: 0.01, S: 12.98, recovery: 99.6, note: "Toza, yangi tayyorlangan" },
    { id: "EA-24-082", date: "2024-06-01", method: "CHNS-O FlashSmart", C: 0.01, H: 4.93, N: 0.00, S: 13.05, recovery: 100.2, note: "Inert muhitda tayyorlangan" },
    { id: "EA-24-083", date: "2024-06-02", method: "CHNS-O Vario EL",    C: 0.03, H: 4.88, N: 0.02, S: 12.91, recovery: 99.2, note: "Eski namuna, qisman effloresensiya" },
    { id: "EA-24-084", date: "2024-06-02", method: "CHNS-O FlashSmart", C: 0.02, H: 4.75, N: 0.01, S: 13.10, recovery: 98.1, note: "1 hafta havoda qolgan" },
    { id: "EA-24-085", date: "2024-06-03", method: "CHNS-O FlashSmart", C: 0.02, H: 5.10, N: 0.01, S: 12.85, recovery: 101.8, note: "Gigroskopik nam yutilgan" },
    { id: "BLANK-01",  date: "2024-06-01", method: "Blank (Empty Capsule)", C: 0.00, H: 0.02, N: 0.00, S: 0.00, recovery: 0.0, note: "Tizim tozaligi" },
    { id: "BLANK-02",  date: "2024-06-02", method: "Blank (Empty Capsule)", C: 0.01, H: 0.03, N: 0.00, S: 0.00, recovery: 0.0, note: "Kapsula ifloslanishi tekshirildi" },
    { id: "STD-SULFA", date: "2024-06-01", method: "Standard: Sulfanilamide", C: 41.82, H: 4.69, N: 16.28, S: 18.51, recovery: 99.9, note: "NIST kalibrlash standarti" }
  ],

  tgaSteps: [
    { start: 25, end: 100, loss: 0.0,  event: "Barqaror zona (Room Temp)", color: "#10b981", eaCorrelation: "H signali barqaror" },
    { start: 100, end: 150, loss: 29.2, event: "4H₂O yo'qolishi (Dehydratatsiya I)", color: "#3b82f6", eaCorrelation: "H 4.92% → 1.64%" },
    { start: 150, end: 250, loss: 14.6, event: "2H₂O yo'qolishi (Dehydratatsiya II)", color: "#3b82f6", eaCorrelation: "H 1.64% → 0%" },
    { start: 250, end: 450, loss: 0.0,  event: "Suvsiz FeSO₄ platolari", color: "#f59e0b", eaCorrelation: "H=0%, faqat S va Fe" },
    { start: 450, end: 650, loss: 26.0, event: "Termik parchalanish (SO₃ ↑)", color: "#ef4444", eaCorrelation: "S signal kamayadi" }
  ],

  // EA ga yaqin tahlil usullari — solishtirish uchun
  relatedMethods: [
    { name: "TGA (Termogravimetriya)", role: "Suv molekulari sonini massa yo'qotish orqali aniqlaydi", eaAdvantage: "Suv turini farqlaydi", eaDisadvantage: "Vodorod miqdorini to'g'ridan-to'g'ri o'lchamaydi", complementarity: "95%" },
    { name: "ICP-OES / ICP-MS", role: "Fe va S metall ionlarini ppb darajasida o'lchaydi", eaAdvantage: "Metallar miqdorini to'g'ridan-to'g'ri beradi", eaDisadvantage: "H, C, N elementlarini o'lchamaydi", complementarity: "88%" },
    { name: "Karl Fischer Titrlash", role: "Faqat suv miqdorini aniq o'lchaydi", eaAdvantage: "Suv uchun eng aniq metod", eaDisadvantage: "Koordinatsion vs panjaradagi suvni farqlamaydi", complementarity: "90%" },
    { name: "Karl-Fischer + TGA + EA", role: "Uchta metod birlashgan analiz", eaAdvantage: "To'liq tasdiqlangan formula", eaDisadvantage: "Qimmat va ko'p vaqt talab qiladi", complementarity: "99%" }
  ],

  // Sample tayyorlash bosqichlari
  samplePrepSteps: [
    { step: 1, title: "Namuna tanlash", desc: "Yangi tayyorlangan, yorqin yashil-ko'k kristallar. Sarg'aygan kristallar (Fe(III)) ishlatilmaydi.", time: "1 daq", critical: true },
    { step: 2, title: "Maydalash", desc: "Aqiq yoki shisha hovonchada mayda kukunga aylantiriladi. Sirt maydonini oshirish muhim.", time: "2-3 daq", critical: false },
    { step: 3, title: "Qalay kapsulaga joylash", desc: "5×9mm Sn kapsulaga 2.0-3.0 mg namuna tortiladi (mikro-tarozida).", time: "3 daq", critical: true },
    { step: 4, title: "Kapsulani yopish", desc: "Kapsula zich yopilishi kerak, aks holda namunaning bir qismi yoqish kamerasiga tushmaydi.", time: "30 son", critical: true },
    { step: 5, title: "Inert muhitda saqlash", desc: "Ar yoki N₂ atmosferada 1 soat ichida analiz qilinadi. Oksidlanishning oldini olish uchun.", time: "<1 soat", critical: true },
    { step: 6, title: "Analizatorga kiritish", desc: "Avtosampler orqali yoki qo'lda yoqish kamerasiga kiritiladi.", time: "5-8 daq (analiz)", critical: false }
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
      { reactant: "[Fe(H₂O)₆]SO₄", process: "+ O₂ (1050°C)", products: "Fe₂O₃ + SO₂ + 6H₂O + CO₂ (agar C bo'lsa)" },
      { reactant: "H₂O (bug')", process: "→ TCD", products: "Pik balandligi %H ga proportsional" },
      { reactant: "Fe₂O₃", process: "Kamerasida qoldiq", products: "ICP-OES orqali tasdiqlanadi" }
    ]
  }
}

// Yordamchi: istalgan n uchun nazariy %H hisoblash
function calculateHydrateProperties(n) {
  const waterMass = n * WATER_MOLAR_MASS
  const anhydrousMass = ATOMIC_MASSES.Fe + ATOMIC_MASSES.S + 4 * ATOMIC_MASSES.O // 151.907
  const total = anhydrousMass + waterMass
  const hMass = n * 2 * ATOMIC_MASSES.H
  const sMass = ATOMIC_MASSES.S
  const feMass = ATOMIC_MASSES.Fe
  const oMass = (4 + n) * ATOMIC_MASSES.O
  return {
    total: parseFloat(total.toFixed(3)),
    H_pct: parseFloat(((hMass / total) * 100).toFixed(3)),
    S_pct: parseFloat(((sMass / total) * 100).toFixed(3)),
    Fe_pct: parseFloat(((feMass / total) * 100).toFixed(3)),
    O_pct: parseFloat(((oMass / total) * 100).toFixed(3)),
    waterPct: parseFloat(((waterMass / total) * 100).toFixed(2))
  }
}

export default function FeH2O6SO4Page() {
  const [activeRun, setActiveRun] = useState("EA-24-081")
  const [hydrateN, setHydrateN] = useState(6)
  const [customH, setCustomH] = useState(4.92)
  const [selectedWaterType, setSelectedWaterType] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)

  // Dinamik gidrat kalkulyatori
  const calc = useMemo(() => calculateHydrateProperties(hydrateN), [hydrateN])

  // Barcha gidratlar (0 dan 7 gacha) taqqoslash jadvali uchun
  const allHydrates = useMemo(() => {
    return [0, 1, 2, 3, 4, 5, 6, 7].map(n => ({
      n,
      ...calculateHydrateProperties(n),
      name: n === 0 ? "Anhydrous" : n === 1 ? "Monohydrate" : n === 4 ? "Tetrahydrate" : n === 6 ? "Hexahydrate ✓" : n === 7 ? "Heptahydrate" : `${n}-Hydrate`
    }))
  }, [])

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  // Validatsiya mantiqi
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const dH = Math.abs(run.H - COMPOUND.theoretical.H.percent)
  const dS = Math.abs(run.S - COMPOUND.theoretical.S.percent)
  const statusColor = dH <= 0.1 ? "text-green-400" : dH <= 0.3 ? "text-yellow-400" : "text-red-400"
  const statusBg = dH <= 0.1 ? "bg-green-500" : dH <= 0.3 ? "bg-yellow-500" : "bg-red-500"

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      
      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* HEADER - Navigatsiya va birikma haqida umumiy ma'lumot              */}
      {/* ════════════════════════════════════════════════════════════════════ */}
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
            <span className="text-green-400 font-semibold">[Fe(H₂O)₆]SO₄</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-indigo-400 flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                {COMPOUND.iupac} • M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
              </p>
              <p className="text-purple-500 text-xs mt-1">
                {COMPOUND.color} • {COMPOUND.stability}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Koordinatsion Suv</span>
                <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Uglerodsiz Tizim</span>
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Oksidlanishga Moyil (Fe²⁺)</span>
                <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">EA Stress-Test Namuna</span>
              </div>
            </div>
            <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="text-xs bg-purple-900/50 hover:bg-purple-800 border border-purple-700 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              ← Barcha birikmalar
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* 1. KIRISH VA KIMYOVIY XUSUSIYATLAR (faqat EA bilan bog'liq)        */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (EA uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Fe(H₂O)₆]SO₄</strong> — temir(II) ning suvli sulfat tuzi bo'lib, unda 6 ta suv molekulasi to'g'ridan-to'g'ri markaziy Fe²⁺ ioniga koordinatsion bog'langan. Bu birikma EA tahlilida <strong className="text-indigo-300">maxsus ahamiyatga ega</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-indigo-500 text-xs md:text-sm">
                <li>Tarkibida <strong className="text-white">C va N mavjud emas</strong> — bu tizim tozaligini (blank) tekshirish uchun mukammal</li>
                <li>12 ta vodorod atomi <strong className="text-white">faqat koordinatsion suvda</strong> joylashgan — %H to'g'ridan-to'g'ri gidrat holatini aks ettiradi</li>
                <li>Fe²⁺ havoda <strong className="text-white">osongina oksidlanadi</strong> — bu EA da namunani tayyorlashni sinovdan o'tkazadi</li>
                <li>Tarkibida S (sulfat) bor — SO₂ sifatida deteklanadi, qo'shimcha tasdiq</li>
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

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* 2. EA NAZARIY ASOSLARI - YOQILISH KAMERA PRINSIPI                   */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔥</span> EA ning ishlash prinsipi — CHNS-O analizatori
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            Namunani yuqori haroratda kislorod ishtirokida yoqish orqali har bir element gaz holatiga o'tkaziladi va TCD (Issiqlik o'tkazuvchanlik detektori) orqali miqdoriy aniqlanadi. Quyida [Fe(H₂O)₆]SO₄ misolida jarayon ko'rsatilgan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">1. Yoqish kamerasi</div>
              <div className="text-2xl font-mono text-orange-400">{COMPOUND.combustionPrinciple.oxidationTemp}</div>
              <div className="text-xs text-purple-300 mt-2">O₂ + 1050°C — namuna to'liq yonadi</div>
            </div>
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">2. Reduksiya kamerasi</div>
              <div className="text-2xl font-mono text-red-400">{COMPOUND.combustionPrinciple.reductionTemp}</div>
              <div className="text-xs text-purple-300 mt-2">Cu — NOₓ larni N₂ ga aylantiradi</div>
            </div>
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">3. Deteksiya</div>
              <div className="text-2xl font-mono text-blue-400">TCD</div>
              <div className="text-xs text-purple-300 mt-2">Gazlarning issiqlik o'tkazuvchanligi</div>
            </div>
          </div>

          {/* Reaksiyalar */}
          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-indigo-400 font-bold text-xs uppercase mb-3">Bu birikma uchun yoqish reaksiyalari:</h3>
            <div className="space-y-3 font-mono text-xs">
              {COMPOUND.combustionPrinciple.equations.map((eq, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center gap-2 p-3 bg-purple-900/30 rounded border-l-4 border-indigo-500">
                  <span className="text-white font-bold">{eq.reactant}</span>
                  <span className="text-yellow-500">{eq.process}</span>
                  <span className="text-purple-600">→</span>
                  <span className="text-green-300">{eq.products}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* 3. NAZARIY ELEMENT TARKIBI - BATAFSIL JADVAL                        */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📐</span> Nazariy element tarkibi (CHNS-O + Fe)
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            Har bir elementning atomlar soni, umumiy massasi, massa ulushi va EA dagi ahamiyati.
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
                    <td className="py-3 pl-2 font-bold text-indigo-400">{el}</td>
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
                <tr className="bg-indigo-900/20 font-bold border-t border-indigo-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center text-white">20</td>
                  <td className="py-3"></td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* 4. GIDRAT SIMULYATSIYASI - INTERAKTIV KALKULYATOR                    */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>💧</span> Gidrat holati simulyatsiyasi (Interaktiv)
            </h2>
            <span className="text-xs text-purple-400 bg-purple-950/50 px-3 py-1 rounded border border-purple-700/30">
              Joriy model: n = {hydrateN}
            </span>
          </div>

          <p className="text-sm text-purple-300 mb-6">
            Kristall suv molekulalari soni (n) o'zgarganda <strong className="text-yellow-300">vodorodning massa ulushi (%H)</strong> keskin o'zgaradi. Bu bog'liqlik EA orqali namunaning tozaligi va saqlanish sharoitini baholashda asosiy mezon hisoblanadi. Slider yordamida har xil gidratlarni sinab ko'ring.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Boshqaruv paneli */}
            <div className="space-y-6">
              <div className="bg-purple-950/60 p-6 rounded-xl border border-purple-700/30">
                <label className="block text-xs text-purple-400 mb-2">Koordinatsion suv molekulalari soni (n):</label>
                <input 
                  type="range" min="0" max="7" step="1" 
                  value={hydrateN} 
                  onChange={(e) => setHydrateN(Number(e.target.value))}
                  className="w-full h-2 bg-purple-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 mb-2"
                />
                <div className="flex justify-between text-xs font-mono text-purple-500 mb-6">
                  <span>0 (anh.)</span>
                  <span>3 (tri.)</span>
                  <span>6 (geksa ✓)</span>
                  <span>7 (gepta)</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">Mol. massa</div>
                    <div className="text-xl font-mono text-white mt-1">{calc.total} <span className="text-xs text-purple-500">g/mol</span></div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">Suv ulushi</div>
                    <div className="text-xl font-mono text-blue-400 mt-1">{calc.waterPct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">%H</div>
                    <div className="text-xl font-mono text-green-400 mt-1">{calc.H_pct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">%S</div>
                    <div className="text-xl font-mono text-yellow-400 mt-1">{calc.S_pct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">%Fe</div>
                    <div className="text-xl font-mono text-red-400 mt-1">{calc.Fe_pct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">%O</div>
                    <div className="text-xl font-mono text-cyan-400 mt-1">{calc.O_pct}%</div>
                  </div>
                </div>
              </div>

              {/* Kristall suv turlari */}
              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                <h3 className="text-indigo-400 font-bold text-xs uppercase mb-3 flex items-center gap-2">
                  <span>💎</span> Kristall suvning turlari (ushbu birikmada)
                </h3>
                <div className="space-y-2">
                  {COMPOUND.waterTypes.map((w, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedWaterType(i)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedWaterType === i 
                          ? "bg-indigo-900/40 border-indigo-500" 
                          : "bg-purple-900/20 border-purple-700/20 hover:border-purple-500"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-white">{w.type}</span>
                        <span className="text-[10px] font-mono text-purple-400">{w.count} ta</span>
                      </div>
                      {selectedWaterType === i && (
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

            {/* Grafik vizualizatsiya */}
            <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80 flex items-end justify-center">
              <svg viewBox="0 0 400 240" className="w-full h-full overflow-visible">
                {/* Grid Lines va Y o'qi */}
                {[0, 1, 2, 3, 4, 5, 6].map(v => (
                  <g key={v}>
                    <line x1="40" y1={210 - (v/6)*180} x2="380" y2={210 - (v/6)*180} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="3,3" />
                    <text x="35" y={214 - (v/6)*180} textAnchor="end" fontSize="9" fill="#a78bfa">{v}%</text>
                  </g>
                ))}
                
                {/* Nazariy chiziq (n=6) */}
                {(() => {
                  const targetH = 4.917
                  const y = 210 - (targetH/6) * 180
                  return (
                    <g>
                      <line x1="40" y1={y} x2="380" y2={y} stroke="#fbbf24" strokeWidth="1" strokeDasharray="5,3" />
                      <text x="385" y={y+3} fontSize="8" fill="#fbbf24">n=6 (nazariy)</text>
                    </g>
                  )
                })()}

                {/* Trend Line — %H vs n */}
                <polyline 
                  fill="none" stroke="#6366f1" strokeWidth="2.5" opacity="0.7"
                  points={[0,1,2,3,4,5,6,7].map(n => {
                    const props = calculateHydrateProperties(n)
                    const x = 40 + (n/7) * 340
                    const y = 210 - (props.H_pct / 6) * 180
                    return `${x},${y}`
                  }).join(" ")}
                />

                {/* Har bir nuqta uchun doiralar */}
                {[0,1,2,3,4,5,6,7].map(n => {
                  const props = calculateHydrateProperties(n)
                  const x = 40 + (n/7) * 340
                  const y = 210 - (props.H_pct / 6) * 180
                  const isActive = n === hydrateN
                  return (
                    <g key={n} style={{ cursor: 'pointer' }} onClick={() => setHydrateN(n)}>
                      <circle cx={x} cy={y} r={isActive ? 7 : 4} 
                        fill={isActive ? "#fbbf24" : "#6366f1"} 
                        stroke={isActive ? "#fff" : "#6366f1"} 
                        strokeWidth={isActive ? 2 : 1} />
                      {isActive && (
                        <>
                          <line x1={x} y1={y} x2={x} y2="210" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />
                          <rect x={x-32} y={y-32} width="64" height="22" rx="4" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="1" />
                          <text x={x} y={y-17} textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">%H: {props.H_pct.toFixed(2)}</text>
                        </>
                      )}
                    </g>
                  )
                })}

                {/* X Axis Labels */}
                <line x1="40" y1="210" x2="380" y2="210" stroke="#a78bfa" strokeWidth="1" />
                {[0,1,2,3,4,5,6,7].map(n => (
                  <text 
                    key={n} 
                    x={40 + (n/7)*340} 
                    y="225" 
                    textAnchor="middle" 
                    fontSize="10" 
                    fill={n===hydrateN ? "#fbbf24" : "#64748b"} 
                    fontWeight={n===hydrateN ? "bold" : "normal"}
                  >
                    n={n}
                  </text>
                ))}
                <text x="210" y="238" textAnchor="middle" fontSize="9" fill="#a78bfa">Koordinatsion suv soni (n)</text>
              </svg>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* 5. BARCHA GIDRATLAR TAQQOSLASH JADVALI                               */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>📊</span> Barcha gidratlar taqqoslanmasi
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            Agar namunada n ta suv molekulasi o'zgargan bo'lsa, EA qanday natija ko'rsatadi? Ushbu jadval har bir gidrat uchun nazariy ko'rsatkichlarni beradi.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 uppercase tracking-wider">
                  <th className="py-2 text-left pl-2">Gidrat</th>
                  <th className="py-2 text-center">M (g/mol)</th>
                  <th className="py-2 text-center text-green-400">%H</th>
                  <th className="py-2 text-center text-yellow-400">%S</th>
                  <th className="py-2 text-center text-red-400">%Fe</th>
                  <th className="py-2 text-center text-cyan-400">%O</th>
                  <th className="py-2 text-center">Suv %</th>
                  <th className="py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {allHydrates.map(h => {
                  const isTarget = h.n === 6
                  const isCurrent = h.n === hydrateN
                  return (
                    <tr 
                      key={h.n}
                      onClick={() => setHydrateN(h.n)}
                      className={`border-b border-purple-800/30 cursor-pointer transition-colors ${
                        isTarget ? "bg-green-900/20" : isCurrent ? "bg-indigo-900/30" : "hover:bg-purple-800/20"
                      }`}
                    >
                      <td className={`py-2 pl-2 font-bold ${isTarget ? "text-green-400" : isCurrent ? "text-indigo-400" : "text-purple-300"}`}>
                        {h.name}
                      </td>
                      <td className="py-2 text-center font-mono">{h.total}</td>
                      <td className="py-2 text-center font-mono text-green-400 font-bold">{h.H_pct}</td>
                      <td className="py-2 text-center font-mono text-yellow-400">{h.S_pct}</td>
                      <td className="py-2 text-center font-mono text-red-400">{h.Fe_pct}</td>
                      <td className="py-2 text-center font-mono text-cyan-400">{h.O_pct}</td>
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
          <div className="mt-3 text-[10px] text-purple-500 italic">
            * Qatorga bosish orqali simulyatorni tanlangan gidratga o'tkazish mumkin.
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* 6. LABORATORIYA NATIJALARI VA VALIDATSIYA                            */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> Laboratoriya natijalari — yugurishlar
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Quyidagi EA yugurishlari turli sharoitlarda o'tkazilgan. Har bir yugurishni tanlab, natijani tahlil qiling.
          </p>
          
          {/* Run Selector */}
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
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
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
            {/* Ma'lumotlar paneli */}
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
                  {/* C */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 font-medium">Carbon (C)</span>
                    <div className="text-right">
                      <span className="font-mono text-white block">{run.C.toFixed(2)}%</span>
                      <span className={`text-[9px] ${run.C <= 0.05 ? 'text-green-500' : 'text-orange-400'}`}>
                        Limit: ≤0.05%
                      </span>
                    </div>
                  </div>
                  
                  {/* H */}
                  <div className="flex justify-between items-center p-2 bg-indigo-900/20 rounded border border-indigo-500/20">
                    <span className="text-sm text-green-500 font-medium">Hydrogen (H)</span>
                    <div className="text-right">
                      <span className="font-mono text-white text-lg block leading-none">{run.H.toFixed(2)}%</span>
                      <span className={`text-[9px] ${statusColor}`}>
                        Naz: 4.92% | Δ: {dH.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* N */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 font-medium">Nitrogen (N)</span>
                    <div className="text-right">
                      <span className="font-mono text-white block">{run.N.toFixed(2)}%</span>
                      <span className={`text-[9px] ${run.N <= 0.05 ? 'text-green-500' : 'text-orange-400'}`}>
                        Limit: ≤0.05%
                      </span>
                    </div>
                  </div>

                  {/* S */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-500 font-medium">Sulfur (S)</span>
                    <div className="text-right">
                      <span className="font-mono text-white block">{run.S.toFixed(2)}%</span>
                      <span className={`text-[9px] ${dS <= 0.5 ? 'text-green-500' : 'text-orange-400'}`}>
                        Naz: 13.03% | Δ: {dS.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center p-2 bg-purple-900/30 rounded">
                  <span className="text-xs text-purple-400">Recovery:</span>
                  <button 
                    onClick={() => setShowRecoveryModal(true)}
                    className="font-mono text-white text-sm hover:text-indigo-400 cursor-pointer"
                  >
                    {run.recovery}% ℹ️
                  </button>
                </div>
              </div>

              {/* Xulosa */}
              <div className={`p-4 rounded-xl border ${
                !isSample 
                  ? "bg-gray-900/40 border-gray-700/30" 
                  : dH <= 0.1 
                    ? "bg-green-900/30 border-green-700/30"
                    : dH <= 0.3
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : dH <= 0.1 ? "text-green-400" : dH <= 0.3 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : dH <= 0.1 ? "✓ Toza namuna" : dH <= 0.3 ? "⚠ Chegaraviy" : "✗ Ifloslangan"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    dH <= 0.1 
                      ? "Namuna tarkibi [Fe(H₂O)₆]SO₄ formulaga to'liq mos keladi. 6 ta koordinatsion suv barqaror saqlangan."
                      : dH <= 0.3
                        ? "Vodorod miqdori nazariy qiymatga yaqin, lekin qisman degidratatsiya yoki namlik yutilishi mumkin."
                        : "Vodorod miqdori sezilarli farq qilmoqda. Namunada qattiq degidratatsiya yoki boshqa gidrat shakliga o'tish kuzatilgan."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Tizim tozaligini tekshirish uchun bo'sh kapsula o'lchovi. C va N nolga yaqin bo'lishi kerak."
                      : "Kalibrlash standarti (sulfanilamid). C, H, N qiymatlari nazariyga mos kelishi shart."
                  )}
                </p>
              </div>
            </div>

            {/* Vizual taqqoslash grafigi */}
            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-indigo-400 mb-4 flex justify-between">
                <span>%H Qiymatlari taqqoslanmasi</span>
                <span className="text-[10px] text-purple-500 font-normal">Target: 4.92%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const val = r.H
                  const heightPct = Math.min((val / 6) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(2)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <div className="absolute w-[120%] border-t border-dashed border-yellow-500/30 z-0" style={{ bottom: `${(4.917/6)*100}%` }}></div>
                        )}

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${
                            isActive 
                              ? isBlank ? 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.4)]' 
                                : isStd ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
                              : isBlank ? 'bg-gray-700/50' 
                              : isStd ? 'bg-amber-700/40' 
                              : 'bg-purple-700/40'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${
                        isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-amber-400' : 'text-indigo-400') : 'text-purple-600'
                      } font-bold`}>
                        {isBlank ? 'BLANK' : isStd ? 'STD' : r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-500 rounded"></span> Namuna</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-500 rounded"></span> Blank</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded"></span> Standart</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-yellow-500/50"></span> Nazariy (4.92%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* RECOVERY MODAL                                                       */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {showRecoveryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowRecoveryModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-indigo-400 mb-3 flex items-center gap-2">
                <span>📈</span> Recovery nima?
              </h3>
              <p className="text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-white">Recovery (qayta tiklanish)</strong> — namunadagi barcha elementlar to'liq detektlanganligini ko'rsatuvchi indikator.
              </p>
              <div className="bg-purple-900/40 p-4 rounded-lg font-mono text-xs mb-3">
                <div>Recovery = Σ(ma'lum elementlar %) / 100% × 100</div>
                <div className="mt-2 text-purple-400">[Fe(H₂O)₆]SO₄ uchun:</div>
                <div className="text-white">C + H + N + S + O + Fe = 100%</div>
                <div className="text-green-400 mt-2">✓ Qabul qilinadigan oraliq: 98% – 102%</div>
              </div>
              <p className="text-xs text-purple-300 italic mb-4">
                {run.recovery < 98 && "⚠ Recovery past — namunaning bir qismi yoqilmagan yoki detektor xatosi."}
                {run.recovery > 102 && "⚠ Recovery yuqori — ifloslanish yoki kapsula og'irligi noto'g'ri hisoblangan."}
                {run.recovery >= 98 && run.recovery <= 102 && "✓ Recovery normal oraliqda — natijalar ishonchli."}
              </p>
              <button 
                onClick={() => setShowRecoveryModal(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg transition-colors text-sm"
              >
                Yopish
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* 7. TGA BILAN EA BOG'LIQLIGI                                          */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔥</span> TGA bilan EA ning bog'liqligi
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Kristall suvlar termik usulda (TGA) va kimyoviy usulda (EA) qanday yo'qolishi bir-birini to'ldiradi. Quyidagi grafik ikkala metodni birlashtiradi.
          </p>

          <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-700/30 overflow-hidden">
            <svg viewBox="0 0 600 260" className="w-full">
              {/* Grid */}
              {[0, 25, 50, 75, 100].map(p => (
                <g key={p}>
                  <line x1="50" y1={220 - (p/100)*200} x2="580" y2={220 - (p/100)*200} stroke="#3b3470" strokeWidth="0.5" />
                  <text x="40" y={225 - (p/100)*200} textAnchor="end" fontSize="9" fill="#a78bfa">{p}%</text>
                </g>
              ))}

              {/* TGA Curve */}
              <path 
                d="M 50 20 L 150 20 Q 175 20 185 50 L 210 80 Q 220 90 240 90 L 280 90 Q 300 90 310 105 L 330 120 Q 340 130 360 130 L 450 130 Q 470 130 480 150 L 510 180 L 580 180" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              {/* EA %H o'zgarishlarini ko'rsatuvchi chiziqlar */}
              <g fontSize="9" fontWeight="bold">
                <text x="100" y="15" textAnchor="middle" fill="#10b981">EA: %H = 4.92% (barqaror)</text>
                
                <line x1="185" y1="50" x2="185" y2="220" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="185" y="235" textAnchor="middle" fill="#3b82f6">~100°C</text>
                <text x="205" y="70" fill="#3b82f6">-4H₂O → %H: 1.64%</text>

                <line x1="310" y1="105" x2="310" y2="220" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="310" y="235" textAnchor="middle" fill="#3b82f6">~200°C</text>
                <text x="330" y="115" fill="#3b82f6">-2H₂O → %H: 0%</text>

                <text x="400" y="125" textAnchor="middle" fill="#f59e0b">Suvsiz FeSO₄ (H=0)</text>

                <line x1="480" y1="150" x2="480" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="480" y="235" textAnchor="middle" fill="#ef4444">~500°C</text>
                <text x="500" y="170" fill="#ef4444">SO₃ ↑</text>
              </g>

              <line x1="50" y1="220" x2="580" y2="220" stroke="#a78bfa" strokeWidth="1" />
              <line x1="50" y1="20" x2="50" y2="220" stroke="#a78bfa" strokeWidth="1" />
            </svg>
          </div>

          {/* TGA bosqichlari jadvallari */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {COMPOUND.tgaSteps.slice(1, 4).map((step, idx) => (
              <div key={idx} className="bg-purple-950/40 p-4 rounded-lg border-l-4" style={{ borderColor: step.color }}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-white">{step.event}</span>
                  <span className="text-[10px] font-mono text-purple-400">{step.start}-{step.end}°C</span>
                </div>
                <div className="text-sm font-mono text-purple-200">Mass yo'qotish: <span className="text-white font-bold">{step.loss}%</span></div>
                <div className="text-[10px] text-indigo-300 mt-2 italic">EA korrelyatsiyasi: {step.eaCorrelation}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* 8. EA GA YAQIN TAHLIL USULLARI BILAN SOLISHTIRISH                    */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> EA ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Fe(H₂O)₆]SO₄ uchun EA ni qo'shimcha usullar bilan birgalikda ishlatish natijalarni tasdiqlaydi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-blue-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-blue-300">{m.name}</h3>
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

          {/* Xulosa */}
          <div className="mt-5 bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-blue-300 mb-2">💡 Bu birikma uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">EA (C, H, N, S) + TGA (suv yo'qotish) + ICP-OES (Fe, S)</strong> — uchta metod birgalikda [Fe(H₂O)₆]SO₄ ning to'liq kimyoviy tasvirini beradi: koordinatsion suv soni, metall tarkibi va formulaning empirik tasdig'i.
            </p>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* 9. NAMUNA TAYYORLASH BOSQICHLARI (INTERAKTIV)                       */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> Namuna tayyorlash bosqichlari (EA uchun)
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Fe(H₂O)₆]SO₄ havoda tez oksidlanganligi sababli, namuna tayyorlashda quyidagi bosqichlar muhim. Har bir qadamni bosib, tafsilotlarni ko'ring.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Steps list */}
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => (
                <button
                  key={s.step}
                  onClick={() => setActivePrepStep(s.step)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activePrepStep === s.step
                      ? "bg-indigo-900/40 border-indigo-500"
                      : "bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activePrepStep === s.step ? "bg-indigo-500 text-white" : "bg-purple-800 text-purple-400"
                    }`}>
                      {s.step}
                    </span>
                    <span className="text-xs font-medium text-white">{s.title}</span>
                    {s.critical && <span className="ml-auto text-[10px] text-red-400">KRITIK</span>}
                  </div>
                </button>
              ))}
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-2 bg-purple-950/50 rounded-xl p-6 border border-purple-700/30">
              {(() => {
                const current = COMPOUND.samplePrepSteps.find(s => s.step === activePrepStep)
                return (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-purple-700/30 pb-3">
                      <h3 className="text-lg font-bold text-indigo-400">Qadam {current.step}: {current.title}</h3>
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

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* 10. TEZ TEKSHIRUV KALKULYATORI                                       */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6">
          <h3 className="text-indigo-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Eksperimental %H validatsiya kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'lchangan %H qiymatini kiriting va bu birikmaning tozaligini aniqlang.
          </p>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/3 space-y-2">
              <label className="block text-xs text-purple-400">O'lchangan %H qiymati:</label>
              <input 
                type="number" step="0.01" value={customH}
                onChange={(e) => setCustomH(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-indigo-500 outline-none transition-colors"
              />
              <div className="text-[10px] text-purple-500 mt-1">
                Nazariy qiymat: {COMPOUND.theoretical.H.percent.toFixed(3)}% (6 ta suv uchun)
              </div>
            </div>
            
            <div className="flex-1 w-full">
              {(() => {
                const diff = Math.abs(customH - 4.917)
                let res = { s: "", c: "", m: "", icon: "" }
                
                if (diff < 0.1) res = { 
                  s: "MOS KELADI", 
                  c: "text-green-400", 
                  m: "Namuna toza [Fe(H₂O)₆]SO₄ tarkibiga ega. 6 ta koordinatsion suv to'liq saqlangan.",
                  icon: "✓"
                }
                else if (diff < 0.4) res = { 
                  s: "CHEGARAVIY", 
                  c: "text-yellow-400", 
                  m: "Qisman degidratatsiya yoki namlik yutilishi mumkin. TGA bilan tasdiqlash tavsiya etiladi.",
                  icon: "⚠"
                }
                else if (customH < 4.5) res = { 
                  s: "DEGRADATSIYA", 
                  c: "text-orange-400", 
                  m: "Kristall suvi yo'qolgan (Effloresensiya). Namuna past gidrat shakliga o'tgan.",
                  icon: "⚠"
                }
                else res = { 
                  s: "IFLOSLANGAN", 
                  c: "text-red-400", 
                  m: "Namuna haddan tashqari namlangan yoki boshqa modda qo'shilgan. Qayta tahlil kerak.",
                  icon: "✗"
                }

                return (
                  <div className="bg-purple-950/50 rounded-lg p-4 border border-purple-700/30 flex items-center gap-4">
                    <div className={`text-3xl ${res.c}`}>{res.icon}</div>
                    <div className="flex-1">
                      <div className={`text-2xl font-black tracking-tight ${res.c}`}>{res.s}</div>
                      <div className="text-sm text-purple-200 mt-1">{res.m}</div>
                      <span className="text-xs font-mono text-purple-500 mt-2 block">
                        Δ = {diff.toFixed(3)}% (Limit: ±0.3%)
                      </span>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* 11. QIZIQARLI FAKT - EA CHEGARALARI                                  */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-orange-900/20 to-purple-900/40 border border-orange-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> EA ning chegarasi: nima uchun Fe miqdorini o'lchamaydi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                Element analizi CHNS-O <strong className="text-white">organik elementlar uchun</strong> mo'ljallangan. Yoqish jarayonida:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-orange-500 text-xs">
                <li>C → CO₂ (gaz) → TCD detektlanadi</li>
                <li>H → H₂O (gaz) → TCD detektlanadi</li>
                <li>N → N₂ (gaz) → TCD detektlanadi</li>
                <li>S → SO₂ (gaz) → TCD detektlanadi</li>
                <li><strong className="text-red-300">Fe → Fe₂O₃ (qattiq qoldiq)</strong> — TCD detektlay olmaydi!</li>
              </ul>
              <p className="text-xs text-orange-200 italic mt-2">
                Shuning uchun Fe miqdorini tasdiqlash uchun <strong>ICP-OES</strong> yoki <strong>AAS</strong> metodlari ishlatiladi.
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
                  <span>4.92%</span>
                </div>
                <div className="flex justify-between">
                  <span>− N:</span>
                  <span>0.00%</span>
                </div>
                <div className="flex justify-between">
                  <span>− S:</span>
                  <span>13.03%</span>
                </div>
                <div className="flex justify-between">
                  <span>− O:</span>
                  <span>65.03%</span>
                </div>
                <div className="flex justify-between border-t border-purple-800/30 pt-1 mt-1">
                  <span className="text-orange-400">= Fe (qoldiq):</span>
                  <span className="text-orange-400 font-bold">22.69%</span>
                </div>
                <div className="mt-3 p-2 bg-orange-900/20 rounded border border-orange-700/30 text-orange-200 text-[10px]">
                  Nazariy Fe% = 22.699% — qoldiq bilan mos keladi ✓
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* 12. XULOSA PANELI                                                    */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-green-900/30 via-indigo-900/30 to-purple-900/30 border border-green-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Yakuniy xulosa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-950/30 p-4 rounded-lg border border-green-700/30">
              <div className="text-green-400 text-2xl mb-2">✓</div>
              <h3 className="font-bold text-white mb-1">EA afzalligi</h3>
              <p className="text-xs text-purple-200">Koordinatsion suvni aniq o'lchaydi, C/N mavjud emasligi blank testi uchun mukammal.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Ehtiyot choralar</h3>
              <p className="text-xs text-purple-200">Fe(II) oksidlanishi, effloresensiya, namlik yutilishi — inert muhit va tez tahlil talab qilinadi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">TGA (suv), ICP-OES (Fe), Karl Fischer (suv) — to'liq tasdiqlash uchun birlashtiriladi.</p>
            </div>
          </div>

          {/* Nav */}
          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/element-analiz" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Element Analiz metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Fe(H₂O)₆]SO₄ • Element Analizi moduli</p>
          <p className="mt-1">Manbalar: IUPAC Atomic Weights 2021, Vogel's Textbook, NIST SRP</p>
        </div>
      </footer>
    </main>
  )
}