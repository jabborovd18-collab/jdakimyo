"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════
// YORDAMCHI FUNKSIYA — NaN himoyasi
// ═══════════════════════════════════════════════════════════
const safeNum = (val, fallback = 0) => {
  const n = Number(val)
  return isNaN(n) || !isFinite(n) ? fallback : n
}

// ═══════════════════════════════════════════════════════════
// ELEMENT ANALIZ MA'LUMOTLAR BAZASI
// ═══════════════════════════════════════════════════════════
const elementDatabase = [
  {
    element: "C",
    nomi: "Uglerod",
    atomicMass: 12.011,
    rang: "red",
    detector: "Infraqizil (IR)",
    gas: "CO₂",
    absorption: "2000 cm⁻¹ (asimmetrik cho'zilish)"
  },
  {
    element: "H",
    nomi: "Vodorod",
    atomicMass: 1.008,
    rang: "cyan",
    detector: "Termal o'tkazuvchanlik",
    gas: "H₂O",
    absorption: "3700 cm⁻¹ (O−H cho'zilish)"
  },
  {
    element: "N",
    nomi: "Azot",
    atomicMass: 14.007,
    rang: "blue",
    detector: "Termal o'tkazuvchanlik",
    gas: "N₂",
    absorption: "Yo'q (TCD)"
  },
  {
    element: "S",
    nomi: "Oltingugurt",
    atomicMass: 32.06,
    rang: "yellow",
    detector: "Infraqizil (IR)",
    gas: "SO₂",
    absorption: "1360 cm⁻¹ (asimmetrik)"
  }
]

// ═══════════════════════════════════════════════════════════
// 12 TA KOMPLEKS BIRIKMALAR
// ═══════════════════════════════════════════════════════════
const birikmalar = [
  {
    id: "ferrocene",
    formula: "Fe(C₅H₅)₂",
    iupac: "Bis(siklopentadienil)temir(II)",
    empirical: "C₁₀H₁₀Fe",
    molarMass: 186.04,
    calculated: { C: 64.56, H: 5.42, N: 0, S: 0 },
    found:      { C: 64.48, H: 5.51, N: 0, S: 0 },
    rang: "amber",
    ligand: "C₅H₅⁻ (Cp⁻)",
    izoh: "Sandvich birikma. Ferrosen — klassik organometallik kompleks. C va H yuqori aniqlikda tasdiqlangan.",
    type: "Organometallik",
    daraja: "Mukammal"
  },
  {
    id: "cisplatin",
    formula: "Pt(NH₃)₂Cl₂",
    iupac: "Sis-diammindixloroplatina(II)",
    empirical: "Cl₂H₆N₂Pt",
    molarMass: 300.05,
    calculated: { C: 0, H: 2.02, N: 9.34, S: 0 },
    found:      { C: 0, H: 2.08, N: 9.25, S: 0 },
    rang: "stone",
    ligand: "2 × NH₃, 2 × Cl⁻",
    izoh: "Saraton dorisi. Faqat N va H tahlil qilinadi (C yo'q). Trans-izomerda xuddi shunday EA bo'ladi.",
    type: "Tekis kvadrat",
    daraja: "Mukammal"
  },
  {
    id: "co-nh3-6",
    formula: "[Co(NH₃)₆]Cl₃",
    iupac: "Geksaamminkobalt(III) xlorid",
    empirical: "Cl₃CoH₁₈N₆",
    molarMass: 267.48,
    calculated: { C: 0, H: 6.78, N: 31.43, S: 0 },
    found:      { C: 0, H: 6.71, N: 31.28, S: 0 },
    rang: "pink",
    ligand: "6 × NH₃",
    izoh: "Yuqori N foizi. Werner tipli klassik kompleks. N miqdori empirik formulani tasdiqlaydi.",
    type: "Werner kompleksi",
    daraja: "Mukammal"
  },
  {
    id: "cu-nh3-4",
    formula: "[Cu(NH₃)₄]SO₄·H₂O",
    iupac: "Tetraammismis(II) sulfat monogidrat",
    empirical: "CuH₁₆N₄O₅S",
    molarMass: 245.77,
    calculated: { C: 0, H: 6.56, N: 22.81, S: 13.04 },
    found:      { C: 0, H: 6.64, N: 22.69, S: 13.18 },
    rang: "blue",
    ligand: "4 × NH₃, SO₄²⁻",
    izoh: "CHNS to'liq tahlil. Gidrat suvlar H foiziga ta'sir qiladi.",
    type: "Gidratlangan tuz",
    daraja: "Yaxshi"
  },
  {
    id: "co-en-3",
    formula: "[Co(en)₃]Cl₃",
    iupac: "Tris(etilendiamin)kobalt(III) xlorid",
    empirical: "C₆H₂₄N₆CoCl₃",
    molarMass: 345.59,
    calculated: { C: 20.85, H: 7.00, N: 24.33, S: 0 },
    found:      { C: 20.78, H: 7.12, N: 24.19, S: 0 },
    rang: "rose",
    ligand: "3 × en (H₂NCH₂CH₂NH₂)",
    izoh: "Xelat kompleksi. C, H, N birgalikda — etilendiamin tasdig'i.",
    type: "Xelat (bidentat)",
    daraja: "Mukammal"
  },
  {
    id: "ni-dmg",
    formula: "[Ni(dmg)₂]",
    iupac: "Bis(dimetilglioksimato)nikel(II)",
    empirical: "C₈H₁₄N₄NiO₄",
    molarMass: 288.91,
    calculated: { C: 33.26, H: 4.88, N: 19.40, S: 0 },
    found:      { C: 33.15, H: 4.95, N: 19.28, S: 0 },
    rang: "red",
    ligand: "2 × dmg²⁻",
    izoh: "Ni²⁺ ning klassik gravimetrik reagenti. Yaqin C, H, N nisbati dimetilglioksim tasdig'i.",
    type: "Kvadrat planar",
    daraja: "Mukammal"
  },
  {
    id: "cu-acac-2",
    formula: "[Cu(acac)₂]",
    iupac: "Bis(asetilasetonato)mis(II)",
    empirical: "C₁₀H₁₄CuO₄",
    molarMass: 261.77,
    calculated: { C: 45.88, H: 5.39, N: 0, S: 0 },
    found:      { C: 45.72, H: 5.48, N: 0, S: 0 },
    rang: "green",
    ligand: "2 × acac⁻",
    izoh: "β-diketonat kompleksi. Yuqori C foizi — organik ligand ko'pligini ko'rsatadi.",
    type: "Kvadrat planar",
    daraja: "Mukammal"
  },
  {
    id: "zn-phen-3",
    formula: "[Zn(phen)₃]Cl₂",
    iupac: "Tris(1,10-fenantrolin)sink(II) xlorid",
    empirical: "C₃₆H₂₄N₆ZnCl₂",
    molarMass: 712.95,
    calculated: { C: 60.63, H: 3.39, N: 11.79, S: 0 },
    found:      { C: 60.48, H: 3.51, N: 11.65, S: 0 },
    rang: "purple",
    ligand: "3 × phen (C₁₂H₈N₂)",
    izoh: "Lyuminestsent kompleks. Yuqori C foizi (60%) — 3 ta aromatik ligand borligini tasdiqlaydi.",
    type: "Oktaedrik",
    daraja: "Yaxshi"
  },
  {
    id: "fe-phen-3",
    formula: "[Fe(phen)₃]Cl₂",
    iupac: "Tris(1,10-fenantrolin)temir(II) xlorid",
    empirical: "C₃₆H₂₄N₆FeCl₂",
    molarMass: 695.42,
    calculated: { C: 62.17, H: 3.48, N: 12.09, S: 0 },
    found:      { C: 62.05, H: 3.56, N: 11.95, S: 0 },
    rang: "orange",
    ligand: "3 × phen",
    izoh: "Qizil rangli kompleks (ferroin). Past spinli Fe²⁺. C:N nisbati phen ligandini tasdiqlaydi.",
    type: "Oktaedrik LS",
    daraja: "Mukammal"
  },
  {
    id: "ru-bpy-3",
    formula: "[Ru(bpy)₃]Cl₂",
    iupac: "Tris(2,2'-bipiridin)ruteniy(II) xlorid",
    empirical: "C₃₀H₂₄N₆RuCl₂",
    molarMass: 668.57,
    calculated: { C: 53.90, H: 3.62, N: 12.58, S: 0 },
    found:      { C: 53.78, H: 3.71, N: 12.45, S: 0 },
    rang: "yellow",
    ligand: "3 × bpy (C₁₀H₈N₂)",
    izoh: "Foto- va elektrolyuminestsent. MLCT tufayli qizil nurlanadi. 3 ta bipiridin borligi C fozi bilan tasdiqlanadi.",
    type: "Oktaedrik",
    daraja: "Mukammal"
  },
  {
    id: "k4-fe-cn-6",
    formula: "K₄[Fe(CN)₆]·3H₂O",
    iupac: "Kaliy geksatsianoferrat(II) trigidrat",
    empirical: "C₆H₆N₆FeK₄O₃",
    molarMass: 422.39,
    calculated: { C: 17.06, H: 1.43, N: 19.90, S: 0 },
    found:      { C: 16.92, H: 1.51, N: 19.78, S: 0 },
    rang: "yellow",
    ligand: "6 × CN⁻",
    izoh: "Gidrat suvlar H foizini oshiradi. C:N nisbati 1:1 — CN ligandini tasdiqlaydi.",
    type: "Oktaedrik LS",
    daraja: "Yaxshi"
  },
  {
    id: "cu-so4-5h2o",
    formula: "CuSO₄·5H₂O",
    iupac: "Mis(II) sulfat pentagidrat",
    empirical: "CuH₁₀O₉S",
    molarMass: 249.68,
    calculated: { C: 0, H: 4.04, N: 0, S: 12.84 },
    found:      { C: 0, H: 4.15, N: 0, S: 12.68 },
    rang: "blue",
    ligand: "SO₄²⁻, 5H₂O",
    izoh: "Oddiy gidratlangan tuz. S miqdori SO₄ borligini, H esa 5 ta suv borligini ko'rsatadi.",
    type: "Gidrat",
    daraja: "Yaxshi"
  }
]

// ═══════════════════════════════════════════════════════════
// RANG XARITASI
// ═══════════════════════════════════════════════════════════
const rangMap = {
  red: { text: "text-red-400", bg: "bg-red-600/10", border: "border-red-500/30", hex: "#ef4444" },
  orange: { text: "text-orange-400", bg: "bg-orange-600/10", border: "border-orange-500/30", hex: "#f97316" },
  yellow: { text: "text-yellow-400", bg: "bg-yellow-600/10", border: "border-yellow-500/30", hex: "#eab308" },
  amber: { text: "text-amber-400", bg: "bg-amber-600/10", border: "border-amber-500/30", hex: "#f59e0b" },
  green: { text: "text-green-400", bg: "bg-green-600/10", border: "border-green-500/30", hex: "#10b981" },
  blue: { text: "text-blue-400", bg: "bg-blue-600/10", border: "border-blue-500/30", hex: "#3b82f6" },
  cyan: { text: "text-cyan-400", bg: "bg-cyan-600/10", border: "border-cyan-500/30", hex: "#06b6d4" },
  pink: { text: "text-pink-400", bg: "bg-pink-600/10", border: "border-pink-500/30", hex: "#ec4899" },
  rose: { text: "text-rose-400", bg: "bg-rose-600/10", border: "border-rose-500/30", hex: "#f43f5e" },
  purple: { text: "text-purple-400", bg: "bg-purple-600/10", border: "border-purple-500/30", hex: "#a855f7" },
  stone: { text: "text-stone-400", bg: "bg-stone-600/10", border: "border-stone-500/30", hex: "#a8a29e" }
}

// ═══════════════════════════════════════════════════════════
// SVG BAR CHART GENERATORI (NaN HIMOYASI BILAN)
// ═══════════════════════════════════════════════════════════
function generateBarChart(entry) {
  const elements = ["C", "H", "N", "S"]
  const calc = entry.calculated || {}
  const found = entry.found || {}
  
  // Faqat mavjud elementlarni olish
  const active = elements.filter(e => {
    const c = safeNum(calc[e], 0)
    const f = safeNum(found[e], 0)
    return c > 0.01 || f > 0.01
  })
  
  if (active.length === 0) return null

  const values = active.map(e => {
    const c = safeNum(calc[e], 0)
    const f = safeNum(found[e], 0)
    return Math.max(c, f)
  })
  const maxVal = Math.max(...values, 10)

  const barWidth = 20
  const gap = 4
  const groupGap = 30
  const groupWidth = barWidth * 2 + gap
  const totalWidth = active.length * groupWidth + Math.max(0, active.length - 1) * groupGap
  const height = 120
  const padding = 30

  return { 
    active, 
    calc, 
    found, 
    maxVal, 
    barWidth, 
    gap, 
    groupGap, 
    groupWidth,
    totalWidth, 
    height, 
    padding 
  }
}

// ═══════════════════════════════════════════════════════════
// XATOLIK HISOBLOVCHI
// ═══════════════════════════════════════════════════════════
function calculateError(entry) {
  const elements = ["C", "H", "N", "S"]
  let totalError = 0
  let count = 0
  
  elements.forEach(e => {
    const calc = safeNum(entry.calculated?.[e], 0)
    const found = safeNum(entry.found?.[e], 0)
    if (calc > 0.01) {
      totalError += Math.abs(found - calc)
      count++
    }
  })
  
  return count > 0 ? (totalError / count).toFixed(2) : "0.00"
}

function getQualityClass(entry) {
  const error = parseFloat(calculateError(entry))
  if (error < 0.3) return "text-green-400"
  if (error < 0.5) return "text-yellow-400"
  return "text-red-400"
}

// ═══════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════
export default function ElementAnaliz() {
  const [selectedElement, setSelectedElement] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [qualityFilter, setQualityFilter] = useState("all")

  // Statistika
  const stats = useMemo(() => ({
    total: birikmalar.length,
    withCarbon: birikmalar.filter(b => safeNum(b.calculated?.C, 0) > 0).length,
    withNitrogen: birikmalar.filter(b => safeNum(b.calculated?.N, 0) > 0).length,
    withSulfur: birikmalar.filter(b => safeNum(b.calculated?.S, 0) > 0).length,
    avgError: (birikmalar.reduce((sum, b) => sum + parseFloat(calculateError(b)), 0) / birikmalar.length).toFixed(2)
  }), [])

  // Elementlar ro'yxati
  const elements = useMemo(() => 
    ["all", ...new Set(elementDatabase.map(e => e.element))], 
    []
  )

  // Filterlangan ma'lumotlar
  const filtered = useMemo(() => {
    return birikmalar.filter(b => {
      if (selectedElement !== "all") {
        if (selectedElement === "C" && safeNum(b.calculated?.C, 0) === 0) return false
        if (selectedElement === "H" && safeNum(b.calculated?.H, 0) === 0) return false
        if (selectedElement === "N" && safeNum(b.calculated?.N, 0) === 0) return false
        if (selectedElement === "S" && safeNum(b.calculated?.S, 0) === 0) return false
      }
      
      if (qualityFilter !== "all") {
        const error = parseFloat(calculateError(b))
        if (qualityFilter === "mukammal" && error >= 0.3) return false
        if (qualityFilter === "yaxshi" && (error < 0.3 || error >= 0.5)) return false
      }
      
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          b.formula.toLowerCase().includes(q) ||
          b.iupac.toLowerCase().includes(q) ||
          b.empirical.toLowerCase().includes(q) ||
          b.ligand.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [selectedElement, searchQuery, qualityFilter])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* HEADER */}
      <header className="border-b border-purple-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm mb-3 text-purple-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil</Link>
            <span className="text-purple-600">›</span>
            <span className="text-purple-300">Element Analiz</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-stone-400 flex items-center gap-3">
                <span className="text-3xl">🧪</span>
                Element Analiz (EA)
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                CHNS tahlil • Empirik formula • Liebig-Dumas usuli
              </p>
            </div>
            <Link 
              href="/ilmiy/tahlil"
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-700/50"
            >
              ← Tahlil usullari
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* STATISTIKA */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-stone-400">{stats.total}</div>
            <div className="text-xs text-purple-400">Birikmalar</div>
          </div>
          <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">⚫</div>
            <div className="text-2xl font-bold text-red-400">{stats.withCarbon}</div>
            <div className="text-xs text-purple-400">C bor</div>
          </div>
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🔵</div>
            <div className="text-2xl font-bold text-blue-400">{stats.withNitrogen}</div>
            <div className="text-xs text-purple-400">N bor</div>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🟡</div>
            <div className="text-2xl font-bold text-yellow-400">{stats.withSulfur}</div>
            <div className="text-xs text-purple-400">S bor</div>
          </div>
          <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-400">±{stats.avgError}%</div>
            <div className="text-xs text-purple-400">O'rt. xatolik</div>
          </div>
        </div>

        {/* BIRIKMALAR KARTASI */}
        <Link 
          href="/ilmiy/tahlil/element-analiz/birikmalar"
          className="group block bg-gradient-to-r from-stone-900/40 to-purple-900/40 border border-stone-700/50 rounded-2xl p-6 hover:bg-stone-900/60 hover:border-stone-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🧪</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-stone-400 group-hover:text-stone-300 transition-colors">
                Birikmalarning Element Analizi
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                12 ta kompleksning to'liq CHNS tahlili. Hisoblangan va topilgan foizlar,
                xatoliklar va empirik formulalar har bir birikma uchun batafsil.
              </p>
            </div>
            <div className="text-3xl text-stone-400 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-stone-600/20 text-stone-400 border border-stone-600/30 px-3 py-1 rounded-full text-xs">
              12 ta birikma
            </span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">
              C (Uglerod)
            </span>
            <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-3 py-1 rounded-full text-xs">
              H (Vodorod)
            </span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">
              N (Azot)
            </span>
          </div>
        </Link>

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📋</span> Element Analiz haqida
          </h2>
          
          <div className="bg-stone-600/10 border border-stone-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed text-sm">
              <strong className="text-stone-400">Element Analiz (EA)</strong> — organik va organometallik
              birikmalarning <strong className="text-yellow-400">C, H, N, S</strong> elementlarining foiz
              tarkibini yuqori aniqlikda (±0.3%) aniqlash usuli. Yangi komplekslarning{" "}
              <strong className="text-stone-400">empirik formulasini tasdiqlash</strong> uchun birinchi
              qo'llaniladigan usul.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-stone-400 font-bold mb-3">Nimani aniqlaydi?</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span><strong>Uglerod (C)</strong> — organik ligandlar borligi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span><strong>Vodorod (H)</strong> — gidrat suvlari, NH₃, CH guruhlar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span><strong>Azot (N)</strong> — amin, nitro, sianid ligandlar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span><strong>Oltingugurt (S)</strong> — sulfat, tiol, tiokarbamid</span>
                </li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-stone-400 font-bold mb-3">Qanday ishlaydi?</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">1.</span>
                  <span>Namuna <strong>950-1050°C</strong> da O₂ muhitida yondiriladi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">2.</span>
                  <span>Hosil bo'lgan gazlar: <strong>CO₂, H₂O, N₂, SO₂</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">3.</span>
                  <span><strong>IR detektor</strong> — CO₂, H₂O, SO₂</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">4.</span>
                  <span><strong>TCD detektor</strong> — N₂ (termal o'tkazuvchanlik)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ELEMENTLAR MA'LUMOTLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>⚛️</span> Tahlil qilinadigan elementlar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {elementDatabase.map(el => {
              const colors = rangMap[el.rang]
              return (
                <div key={el.element} className={`${colors.bg} border ${colors.border} rounded-xl p-4`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`text-3xl font-bold font-mono ${colors.text}`}>
                      {el.element}
                    </div>
                    <div className="text-xs text-purple-300">{el.nomi}</div>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-purple-400">Atom massasi:</span>
                      <span className="text-white font-mono">{el.atomicMass}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Detektor:</span>
                      <span className={`${colors.text}`}>{el.detector}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Gaz:</span>
                      <span className="text-yellow-400 font-mono">{el.gas}</span>
                    </div>
                    <div className="pt-2 border-t border-purple-700/30">
                      <p className="text-purple-400 text-[10px]">{el.absorption}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* FILTER VA QIDIRUV */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Formula, nom yoki ligand bo'yicha qidirish..."
              className="w-full px-5 py-3 bg-purple-950/60 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-stone-400 transition-colors"
              aria-label="Birikmalarni qidirish"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white text-lg"
                aria-label="Qidiruvni tozalash"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-purple-400 font-semibold">Element:</span>
              {elements.map(el => (
                <button
                  key={el}
                  onClick={() => setSelectedElement(el)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedElement === el
                      ? "bg-stone-600 text-white"
                      : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                  }`}
                >
                  {el === "all" ? "Hammasi" : el}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-purple-400 font-semibold">Sifat:</span>
              {["all", "mukammal", "yaxshi"].map(q => (
                <button
                  key={q}
                  onClick={() => setQualityFilter(q)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    qualityFilter === q
                      ? "bg-stone-600 text-white"
                      : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                  }`}
                >
                  {q === "all" ? "Barchasi" : q === "mukammal" ? "✅ Mukammal (<0.3%)" : "🟡 Yaxshi (0.3-0.5%)"}
                </button>
              ))}
            </div>
          </div>

          {(searchQuery || selectedElement !== "all" || qualityFilter !== "all") && (
            <div className="text-xs text-purple-400 pt-2 border-t border-purple-700/30">
              Topildi: <span className="text-white font-semibold">{filtered.length}</span> ta birikma
            </div>
          )}
        </div>

        {/* NATIJALAR */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-white mb-2">Hech narsa topilmadi</h3>
              <p className="text-purple-400 text-sm">Qidiruv yoki filtrlarni o'zgartirib ko'ring</p>
            </div>
          ) : (
            filtered.map((entry, i) => {
              const colors = rangMap[entry.rang]
              const chart = generateBarChart(entry)
              const error = calculateError(entry)
              const quality = getQualityClass(entry)
              
              return (
                <div key={i} className={`${colors.bg} border ${colors.border} rounded-2xl p-6`}>
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <h3 className={`text-xl font-bold ${colors.text}`}>
                        {entry.formula}
                      </h3>
                      <p className="text-purple-400 text-xs mt-1">
                        {entry.iupac}
                      </p>
                      <p className="text-purple-500 text-[10px] mt-1 font-mono">
                        {entry.empirical} • M = {entry.molarMass} g/mol
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold font-mono ${quality}`}>
                        ±{error}%
                      </div>
                      <div className="text-xs text-purple-400">O'rt. xatolik</div>
                    </div>
                  </div>

                  {/* BAR CHART */}
                  {chart && (
                    <div className="bg-purple-950/50 rounded-xl p-4 mb-4">
                      <svg 
                        viewBox={`0 0 ${safeNum(chart.totalWidth + chart.padding * 2, 300)} ${safeNum(chart.height + 20, 140)}`} 
                        className="w-full h-36"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        {/* Grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((frac, idx) => {
                          const yVal = safeNum(chart.height - frac * chart.height + 10, 10 + frac * 100)
                          return (
                            <line
                              key={idx}
                              x1={safeNum(chart.padding, 30)}
                              y1={yVal}
                              x2={safeNum(chart.totalWidth + chart.padding, 300)}
                              y2={yVal}
                              stroke="#4c1d95"
                              strokeWidth="0.5"
                              strokeDasharray="2,2"
                            />
                          )
                        })}

                        {chart.active.map((el, idx) => {
                          const elColors = {
                            C: { calc: "#ef4444", found: "#fca5a5" },
                            H: { calc: "#06b6d4", found: "#67e8f9" },
                            N: { calc: "#3b82f6", found: "#93c5fd" },
                            S: { calc: "#eab308", found: "#fde047" }
                          }
                          const calcVal = safeNum(chart.calc[el], 0)
                          const foundVal = safeNum(chart.found[el], 0)
                          const maxVal = safeNum(chart.maxVal, 10)
                          const height = safeNum(chart.height, 120)
                          
                          const calcH = (calcVal / maxVal) * height
                          const foundH = (foundVal / maxVal) * height
                          const groupX = safeNum(chart.padding, 30) + idx * (safeNum(chart.groupWidth, 44) + safeNum(chart.groupGap, 30))
                          const barWidth = safeNum(chart.barWidth, 20)
                          const gap = safeNum(chart.gap, 4)

                          // NaN himoyasi — agar qiymatlar noto'g'ri bo'lsa o'tkazib yuboramiz
                          if (isNaN(groupX) || isNaN(calcH) || isNaN(foundH) || isNaN(barWidth)) return null
                          
                          return (
                            <g key={el}>
                              {/* Calculated bar */}
                              <rect
                                x={groupX}
                                y={height - calcH + 10}
                                width={barWidth}
                                height={calcH}
                                fill={elColors[el].calc}
                                opacity="0.9"
                                rx="2"
                              />
                              <text
                                x={groupX + barWidth / 2}
                                y={height - calcH + 5}
                                fill={elColors[el].calc}
                                fontSize="8"
                                textAnchor="middle"
                                fontFamily="monospace"
                              >
                                {calcVal.toFixed(1)}%
                              </text>

                              {/* Found bar */}
                              <rect
                                x={groupX + barWidth + gap}
                                y={height - foundH + 10}
                                width={barWidth}
                                height={foundH}
                                fill={elColors[el].found}
                                opacity="0.7"
                                rx="2"
                              />
                              <text
                                x={groupX + barWidth + gap + barWidth / 2}
                                y={height - foundH + 5}
                                fill={elColors[el].found}
                                fontSize="8"
                                textAnchor="middle"
                                fontFamily="monospace"
                              >
                                {foundVal.toFixed(1)}%
                              </text>

                              {/* Label */}
                              <text
                                x={groupX + safeNum(chart.groupWidth, 44) / 2}
                                y={height + 20}
                                fill="#e7e5e4"
                                fontSize="11"
                                textAnchor="middle"
                                fontWeight="bold"
                              >
                                {el}
                              </text>
                            </g>
                          )
                        })}
                      </svg>

                      {/* Legend */}
                      <div className="flex justify-center gap-4 text-xs mt-2">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                          <span className="text-purple-300">Hisoblangan</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-300 rounded-sm"></div>
                          <span className="text-purple-300">Topilgan</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Info grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                    <div className="bg-purple-900/50 rounded-lg p-3">
                      <p className="text-purple-400 mb-1">Tur</p>
                      <p className={`${colors.text} font-bold`}>{entry.type}</p>
                    </div>
                    <div className="bg-purple-900/50 rounded-lg p-3">
                      <p className="text-purple-400 mb-1">Ligand</p>
                      <p className="text-white font-mono text-[10px]">{entry.ligand}</p>
                    </div>
                    <div className="bg-purple-900/50 rounded-lg p-3">
                      <p className="text-purple-400 mb-1">Sifat</p>
                      <p className={`${quality} font-bold`}>{entry.daraja}</p>
                    </div>
                    <div className="bg-purple-900/50 rounded-lg p-3">
                      <p className="text-purple-400 mb-1">Molyar massa</p>
                      <p className="text-white font-mono">{entry.molarMass}</p>
                    </div>
                  </div>

                  {/* Izoh */}
                  <p className="text-purple-300 text-xs leading-relaxed">
                    {entry.izoh}
                  </p>
                </div>
              )
            })
          )}
        </div>

        {/* HISOBLASH FORMULASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🧮</span> Empirik formulani hisoblash
          </h2>

          <div className="bg-stone-600/10 border border-stone-500/30 rounded-xl p-5 mb-4">
            <p className="text-purple-200 text-sm mb-3">
              Element analizi natijalaridan empirik formulani chiqarish algoritmi:
            </p>
            <div className="space-y-2 text-xs">
              {[
                { step: "1", text: "Har bir element foizini uning atom massasiga bo'ling: n = % / M" },
                { step: "2", text: "Eng kichik n qiymatini toping" },
                { step: "3", text: "Barcha n qiymatlarni eng kichik n ga bo'ling → mol nisbati" },
                { step: "4", text: "Butun sonlarga yaqinlashtiring → empirik formula" }
              ].map(s => (
                <div key={s.step} className="flex items-start gap-2">
                  <span className="bg-yellow-600/30 text-yellow-400 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">
                    {s.step}
                  </span>
                  <span className="text-purple-200">{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-3 text-sm">📝 Masalan: Ferrosen Fe(C₅H₅)₂</h3>
            <div className="font-mono text-xs text-purple-200 space-y-1">
              <p>C: 64.56 / 12.011 = <span className="text-red-400">5.37</span></p>
              <p>H: 5.42 / 1.008 = <span className="text-cyan-400">5.38</span></p>
              <p>Fe: 30.02 / 55.85 = <span className="text-amber-400">0.538</span></p>
              <p className="pt-2 border-t border-purple-700/30">
                Nisbat: C:H:Fe = 5.37:5.38:0.538 = <span className="text-green-400 font-bold">10:10:1</span>
              </p>
              <p className="text-yellow-400">→ <span className="font-bold">C₁₀H₁₀Fe</span> (empirik formula)</p>
            </div>
          </div>
        </div>

        {/* XATOLIK CHEGARALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📏</span> Qabul qilinadigan xatolik chegaralari
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2 text-sm">✅ Mukammal</h3>
              <div className="text-3xl font-bold text-green-400 font-mono mb-2">±0.3%</div>
              <p className="text-purple-200 text-xs leading-relaxed">
                Har bir element uchun hisoblangan va topilgan qiymat farqi{" "}
                <strong>0.3% dan kam</strong>. Jurnal nashrlari uchun standart.
              </p>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-2 text-sm">🟡 Yaxshi</h3>
              <div className="text-3xl font-bold text-yellow-400 font-mono mb-2">±0.4%</div>
              <p className="text-purple-200 text-xs leading-relaxed">
                Farq <strong>0.3% dan 0.5% gacha</strong>. Gidratlar va yomon eriydigan moddalar uchun qabul qilinadi.
              </p>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2 text-sm">❌ Yomon</h3>
              <div className="text-3xl font-bold text-red-400 font-mono mb-2">&gt;±0.5%</div>
              <p className="text-purple-200 text-xs leading-relaxed">
                Farq <strong>0.5% dan ortiq</strong>. Namuna <strong>sof emas</strong> yoki gidrat suvlari o'zgargan.
                Qayta tozalash kerak.
              </p>
            </div>
          </div>
        </div>

        {/* TARIXIY MA'LUMOT */}
        <div className="bg-gradient-to-r from-stone-900/40 to-purple-900/40 border border-stone-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📜</span> Tarixiy rivojlanish
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400 font-bold font-mono">1831</span>
                <span className="text-white font-bold">Justus von Liebig</span>
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Kaliy gidroksid</strong> yordamida C va H ni aniqlash usulini ishlab chiqdi.
                Yonish mahsulotlari KOH da yutiladi, massa o'sishi o'lchanadi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400 font-bold font-mono">1833</span>
                <span className="text-white font-bold">Jean-Baptiste Dumas</span>
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Azot</strong> ni aniqlash usulini yaratdi. Namuna CuO bilan qizdiriladi,
                N₂ gaz sifatida to'planadi va hajmi o'lchanadi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400 font-bold font-mono">1897</span>
                <span className="text-white font-bold">Fritz Pregl</span>
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Mikroanaliz</strong> usulini rivojlantirdi (faqat 3-5 mg namuna).
                1923-yil Kimyo bo'yicha Nobel mukofoti.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400 font-bold font-mono">1960+</span>
                <span className="text-white font-bold">Zamonaviy CHNS analizatorlar</span>
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Avtomatik</strong> tizimlar. Namuna yondiriladi, gazlar IR va TCD detektorlar
                orqali o'tadi. 1-2 mg namuna, 5 daqiqada to'liq tahlil.
              </p>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-stone-600/10 to-purple-600/10 border border-stone-500/20 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>✅</span> Asosiy xulosalar
          </h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>EA — yangi komplekslarning <strong className="text-stone-400">empirik formulasini tasdiqlovchi</strong> birinchi usul</li>
            <li>Xatolik <strong className="text-stone-400">±0.3%</strong> dan oshmasligi kerak (jurnal standarti)</li>
            <li>Metallar (Fe, Co, Cu, Pt) tahlil qilinmaydi — <strong className="text-stone-400">faqat C, H, N, S</strong></li>
            <li>Gidrat suvlari H foiziga ta'sir qiladi — <strong className="text-stone-400">hisoblashda hisobga olish</strong> kerak</li>
            <li>Natija <strong className="text-stone-400">NMR, XRD, Mass-spektrometriya</strong> bilan birga qo'llaniladi</li>
            <li>Organik ligandsiz komplekslarda (masalan, PtCl₂) EA <strong className="text-stone-400">foydali emas</strong></li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link 
            href="/ilmiy/tahlil/xps" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← XPS spektroskopiya
          </Link>
          <Link 
            href="/ilmiy/tahlil" 
            className="px-6 py-3 bg-stone-600/80 rounded-xl hover:bg-stone-500 text-white font-semibold"
          >
            Barcha tahlil usullari →
          </Link>
        </div>

      </section>
    </main>
  )
}