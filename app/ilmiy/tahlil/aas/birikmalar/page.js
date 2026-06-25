"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// MA'LUMOTLAR BAZASI — AAS (Atom-Absorbsion Spektroskopiya) uchun 12 ta Birikma
// Har bir birikma AAS ning ma'lum bir jihatini namoyish etadi
// ============================================================================
const birikmalar = [
  {
    id: "k4-fe-cn6-3h2o",
    slug: "k4-fe-cn6-3h2o",
    formula: "K₄[Fe(CN)₆]·3H₂O",
    iupac: "Kaliy geksatsianoferrat(II) trihidrat",
    metal: "Fe²⁺",
    config: "d⁶ (LS)",
    M: 422.39,
    lambda: 248.3,
    method: "FAAS",
    flame: "Havo-C₂H₂",
    slit: 0.2,
    current: 5,
    theoretical: { Fe: 13.22 },
    experimental: { Fe: 13.18 },
    delta: { Fe: 0.04 },
    rsd: 1.2,
    lod: 0.005,
    loq: 0.017,
    linearRange: "0.05−5.0",
    background: "Deuteriy",
    status: "A'lo",
    color: "yellow",
    special: "Klassik standart namuna",
    desc: "Sariq qon tuzi. FAAS uchun ideal standart. 3 ta gidrat suvi. 248.3 nm da yuqori sezgirlik."
  },
  {
    id: "k3-fe-cn6",
    slug: "k3-fe-cn6",
    formula: "K₃[Fe(CN)₆]",
    iupac: "Kaliy geksatsianoferrat(III)",
    metal: "Fe³⁺",
    config: "d⁵ (LS)",
    M: 329.24,
    lambda: 248.3,
    method: "FAAS",
    flame: "Havo-C₂H₂",
    slit: 0.2,
    current: 5,
    theoretical: { Fe: 16.96 },
    experimental: { Fe: 16.92 },
    delta: { Fe: 0.04 },
    rsd: 1.1,
    lod: 0.005,
    loq: 0.017,
    linearRange: "0.05−5.0",
    background: "Deuteriy",
    status: "A'lo",
    color: "orange",
    special: "Oksidlanish darajasi farqi",
    desc: "Qizil qon tuzi. Fe³⁺ oksidlangan shakl. Fe²⁺ bilan bir xil λ da o'lchanadi — AAS oksidlanish holatini farqlamaydi."
  },
  {
    id: "cr-h2o6-cl3",
    slug: "cr-h2o6-cl3",
    formula: "[Cr(H₂O)₆]Cl₃",
    iupac: "Geksaakvaxrom(III) xlorid",
    metal: "Cr³⁺",
    config: "d³",
    M: 266.44,
    lambda: 357.9,
    method: "FAAS",
    flame: "N₂O-C₂H₂",
    slit: 0.5,
    current: 7,
    theoretical: { Cr: 19.52 },
    experimental: { Cr: 19.45 },
    delta: { Cr: 0.07 },
    rsd: 2.1,
    lod: 0.003,
    loq: 0.010,
    linearRange: "0.03−3.0",
    background: "Zeyman",
    status: "Yaxshi",
    color: "violet",
    special: "Qiyin atomlashtiriladigan (refrakter)",
    desc: "Binafsha kristallar. Cr₂O₃ barqaror oksidi hosil qiladi — shuning uchun issiq N₂O-C₂H₂ alangasi (~2900°C) zarur."
  },
  {
    id: "co-nh3-6-cl3",
    slug: "co-nh3-6-cl3",
    formula: "[Co(NH₃)₆]Cl₃",
    iupac: "Geksaamminkobalt(III) xlorid",
    metal: "Co³⁺",
    config: "d⁶ (LS)",
    M: 267.48,
    lambda: 240.7,
    method: "FAAS",
    flame: "Havo-C₂H₂",
    slit: 0.2,
    current: 6,
    theoretical: { Co: 22.03 },
    experimental: { Co: 21.95 },
    delta: { Co: 0.08 },
    rsd: 1.4,
    lod: 0.007,
    loq: 0.023,
    linearRange: "0.07−5.0",
    background: "Deuteriy",
    status: "Yaxshi",
    color: "pink",
    special: "Werner klassik kompleksi",
    desc: "Sariq-to'q sariq kristallar. Co³⁺ inert kompleks. FAAS orqali to'liq validatsiya qilingan."
  },
  {
    id: "ni-en3-cl2",
    slug: "ni-en3-cl2",
    formula: "[Ni(en)₃]Cl₂",
    iupac: "Tris(etilendiamin)nikel(II) xlorid",
    metal: "Ni²⁺",
    config: "d⁸",
    M: 309.89,
    lambda: 232.0,
    method: "FAAS",
    flame: "Havo-C₂H₂",
    slit: 0.2,
    current: 8,
    theoretical: { Ni: 18.94 },
    experimental: { Ni: 18.88 },
    delta: { Ni: 0.06 },
    rsd: 1.2,
    lod: 0.006,
    loq: 0.020,
    linearRange: "0.06−5.0",
    background: "Deuteriy",
    status: "A'lo",
    color: "purple",
    special: "Xelat ligand ta'siri yo'q",
    desc: "Binafsha kristallar. Xelat ligandlar (en) yonib ketadi, Ni²⁺ atomlari FAAS da erkin. Ligand metall foiziga ta'sir qilmaydi."
  },
  {
    id: "cu-nh3-4-so4-h2o",
    slug: "cu-nh3-4-so4-h2o",
    formula: "[Cu(NH₃)₄]SO₄·H₂O",
    iupac: "Tetraammismis(II) sulfat monogidrat",
    metal: "Cu²⁺",
    config: "d⁹",
    M: 245.75,
    lambda: 324.8,
    method: "FAAS",
    flame: "Havo-C₂H₂",
    slit: 0.5,
    current: 4,
    theoretical: { Cu: 25.86 },
    experimental: { Cu: 25.78 },
    delta: { Cu: 0.08 },
    rsd: 0.9,
    lod: 0.002,
    loq: 0.007,
    linearRange: "0.02−5.0",
    background: "Deuteriy",
    status: "A'lo",
    color: "blue",
    special: "Eng yuqori sezgirlik (FAAS)",
    desc: "To'q ko'k kristallar. Cu²⁺ FAAS ning eng sezgir elementlaridan biri — LOD 0.002 mg/L. Jahn-Teller effekti."
  },
  {
    id: "k2-ptcl4",
    slug: "k2-ptcl4",
    formula: "K₂[PtCl₄]",
    iupac: "Kaliy tetraxloroplatinat(II)",
    metal: "Pt²⁺",
    config: "d⁸",
    M: 415.09,
    lambda: 265.9,
    method: "GFAAS",
    flame: "Grafit pechi",
    slit: 0.5,
    current: 12,
    theoretical: { Pt: 47.00 },
    experimental: { Pt: 46.82 },
    delta: { Pt: 0.18 },
    rsd: 2.3,
    lod: 0.50,
    loq: 1.65,
    linearRange: "0.5−50 μg/L",
    background: "Zeyman",
    modifier: "Pd/Mg(NO₃)₂",
    status: "Yaxshi",
    color: "red",
    special: "Og'ir metall — GFAAS talab",
    desc: "Qizil-jigar kristallar. Pt FAAS da juda past sezgirlik (LOD 0.05 mg/L) — GFAAS yoki ICP-MS talab qilinadi."
  },
  {
    id: "agno3",
    slug: "agno3",
    formula: "AgNO₃",
    iupac: "Kumush nitrat",
    metal: "Ag⁺",
    config: "d¹⁰",
    M: 169.87,
    lambda: 328.1,
    method: "FAAS",
    flame: "Havo-C₂H₂",
    slit: 0.5,
    current: 4,
    theoretical: { Ag: 63.50 },
    experimental: { Ag: 63.42 },
    delta: { Ag: 0.08 },
    rsd: 0.6,
    lod: 0.001,
    loq: 0.003,
    linearRange: "0.01−3.0",
    background: "Deuteriy",
    status: "A'lo",
    color: "gray",
    special: "FAAS da eng past LOD",
    desc: "Rangsiz kristallar. Ag⁺ AAS ning eng sezgir elementi — LOD 0.001 mg/L (1 ppb). RSD 0.6% — mukammal takrorlanish."
  },
  {
    id: "cdcl2",
    slug: "cdcl2",
    formula: "CdCl₂",
    iupac: "Kadmiy xlorid",
    metal: "Cd²⁺",
    config: "d¹⁰",
    M: 183.32,
    lambda: 228.8,
    method: "GFAAS",
    flame: "Grafit pechi",
    slit: 0.7,
    current: 4,
    theoretical: { Cd: 61.32 },
    experimental: { Cd: 61.15 },
    delta: { Cd: 0.17 },
    rsd: 1.8,
    lod: 0.005,
    loq: 0.017,
    linearRange: "0.05−10 μg/L",
    background: "Zeyman",
    modifier: "NH₄H₂PO₄",
    status: "Yaxshi",
    color: "stone",
    special: "Zaharli og'ir metall (GFAAS)",
    desc: "Oq kristallar. Cd²⁺ zaharli, atrof-muhit tahlilida GFAAS bilan ppb darajasida o'lchanadi. NH₄H₂PO₄ modifikatori."
  },
  {
    id: "na2-seo3",
    slug: "na2-seo3",
    formula: "Na₂[SeO₃]",
    iupac: "Natriy selenit",
    metal: "Se⁴⁺",
    config: "s²p⁰ (metalmas)",
    M: 172.94,
    lambda: 196.0,
    method: "HGAAS",
    flame: "Gidrid generatori",
    slit: 1.0,
    current: 8,
    theoretical: { Se: 45.66 },
    experimental: { Se: 45.52 },
    delta: { Se: 0.14 },
    rsd: 2.5,
    lod: 0.001,
    loq: 0.003,
    linearRange: "0.001−5 μg/L",
    background: "—",
    reagent: "NaBH₄ + HCl",
    status: "Yaxshi",
    color: "teal",
    special: "Gidrid usuli (HGAAS)",
    desc: "Oq kukun. Se⁴⁺ NaBH₄ bilan H₂Se gidridini hosil qiladi — argon oqimi bilan kvarts kyuvetaga uzatiladi. Juda yuqori sezgirlik."
  },
  {
    id: "au-pph3-cl",
    slug: "au-pph3-cl",
    formula: "[Au(PPh₃)Cl]",
    iupac: "Xloro(trifenilfosfin)oltin(I)",
    metal: "Au⁺",
    config: "d¹⁰",
    M: 494.71,
    lambda: 242.8,
    method: "GFAAS",
    flame: "Grafit pechi",
    slit: 0.5,
    current: 10,
    theoretical: { Au: 39.81 },
    experimental: { Au: 39.65 },
    delta: { Au: 0.16 },
    rsd: 2.0,
    lod: 0.80,
    loq: 2.64,
    linearRange: "0.8−80 μg/L",
    background: "Zeyman",
    modifier: "Pd",
    status: "Yaxshi",
    color: "amber",
    special: "Organometallik Au kompleksi",
    desc: "Oq-sariq kristallar. Au⁺ fosfin kompleksi. Organik ligand (PPh₃) yonib ketadi, GFAAS da Au atomlari aniqlanadi."
  },
  {
    id: "ca3-co-cn6-2",
    slug: "ca3-co-cn6-2",
    formula: "Ca₃[Co(CN)₆]₂",
    iupac: "Kalsiy geksatsianokobaltat(III)",
    metal: "Ca²⁺ + Co³⁺",
    config: "d⁰ + d⁶ (LS)",
    M: 550.32,
    lambda: 422.7,
    method: "FAAS",
    flame: "N₂O-C₂H₂",
    slit: 0.5,
    current: 8,
    theoretical: { Ca: 21.85, Co: 21.42 },
    experimental: { Ca: 21.78, Co: 21.35 },
    delta: { Ca: 0.07, Co: 0.07 },
    rsd: 1.8,
    lod: 0.004,
    loq: 0.013,
    linearRange: "0.04−5.0",
    background: "Deuteriy",
    modifier: "La³⁺ (Ca uchun)",
    status: "Yaxshi",
    color: "cyan",
    special: "Aralash metall (ikki HCL kerak)",
    desc: "Oq kristallar. 2 ta metall — Ca²⁺ va Co³⁺. Har biri uchun alohida katod lampasi. Ca uchun La³⁺ modifikatori (fosfat effekti)."
  }
]

// AAS metodi uchun rang sxemasi
const methodColors = {
  "FAAS": { bg: "bg-red-600/20", text: "text-red-300", border: "border-red-500/30", gradient: "from-red-600/30" },
  "GFAAS": { bg: "bg-orange-600/20", text: "text-orange-300", border: "border-orange-500/30", gradient: "from-orange-600/30" },
  "HGAAS": { bg: "bg-yellow-600/20", text: "text-yellow-300", border: "border-yellow-500/30", gradient: "from-yellow-600/30" }
}

// Umumiy ranglar
const rangMap = {
  yellow: { bg: "bg-yellow-600/10", text: "text-yellow-400", border: "border-yellow-500/30" },
  orange: { bg: "bg-orange-600/10", text: "text-orange-400", border: "border-orange-500/30" },
  green: { bg: "bg-green-600/10", text: "text-green-400", border: "border-green-500/30" },
  blue: { bg: "bg-blue-600/10", text: "text-blue-400", border: "border-blue-500/30" },
  pink: { bg: "bg-pink-600/10", text: "text-pink-400", border: "border-pink-500/30" },
  purple: { bg: "bg-purple-600/10", text: "text-purple-400", border: "border-purple-500/30" },
  gray: { bg: "bg-gray-600/10", text: "text-gray-400", border: "border-gray-500/30" },
  amber: { bg: "bg-amber-600/10", text: "text-amber-400", border: "border-amber-500/30" },
  red: { bg: "bg-red-600/10", text: "text-red-400", border: "border-red-500/30" },
  stone: { bg: "bg-stone-600/10", text: "text-stone-400", border: "border-stone-500/30" },
  rose: { bg: "bg-rose-600/10", text: "text-rose-400", border: "border-rose-500/30" },
  cyan: { bg: "bg-cyan-600/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  violet: { bg: "bg-violet-600/10", text: "text-violet-400", border: "border-violet-500/30" },
  teal: { bg: "bg-teal-600/10", text: "text-teal-400", border: "border-teal-500/30" }
}

export default function AASBirikmalar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [methodFilter, setMethodFilter] = useState("all") // all, FAAS, GFAAS, HGAAS

  // Filterlash
  const filtered = useMemo(() => {
    let result = birikmalar
    if (methodFilter !== "all") {
      result = result.filter(b => b.method === methodFilter)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(b => 
        b.formula.toLowerCase().includes(q) ||
        b.iupac.toLowerCase().includes(q) ||
        b.metal.toLowerCase().includes(q) ||
        b.special.toLowerCase().includes(q)
      )
    }
    return result
  }, [searchQuery, methodFilter])

  // Statistika
  const stats = useMemo(() => ({
    total: birikmalar.length,
    faas: birikmalar.filter(b => b.method === "FAAS").length,
    gfaas: birikmalar.filter(b => b.method === "GFAAS").length,
    hgaas: birikmalar.filter(b => b.method === "HGAAS").length,
    metals: [...new Set(birikmalar.map(b => b.metal))].length
  }), [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-red-950/20 to-blue-950 text-white">
      
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm mb-3 text-purple-400">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/aas" className="hover:text-purple-300">AAS</Link>
            <span className="text-purple-600">›</span>
            <span className="text-red-400 font-semibold">Birikmalar</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-red-400 flex items-center gap-3">
                <span className="text-3xl">🧯</span>
                AAS Birikmalar Katalogi
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                12 ta kompleks • Metall foizi %M • λ (nm) • LOD/LOQ • RSD • Atomlashtirish usuli
              </p>
            </div>
            <Link 
              href="/ilmiy/tahlil/aas"
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-700/50"
            >
              ← AAS Nazariyasi
            </Link>
          </div>

          {/* STATISTIKA */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
            <div className="bg-purple-900/40 rounded-lg p-2 border border-purple-700/30">
              <div className="text-xs text-purple-400">Jami</div>
              <div className="text-xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="bg-red-900/30 rounded-lg p-2 border border-red-700/30">
              <div className="text-xs text-red-400">FAAS</div>
              <div className="text-xl font-bold text-red-300">{stats.faas}</div>
            </div>
            <div className="bg-orange-900/30 rounded-lg p-2 border border-orange-700/30">
              <div className="text-xs text-orange-400">GFAAS</div>
              <div className="text-xl font-bold text-orange-300">{stats.gfaas}</div>
            </div>
            <div className="bg-yellow-900/30 rounded-lg p-2 border border-yellow-700/30">
              <div className="text-xs text-yellow-400">HGAAS</div>
              <div className="text-xl font-bold text-yellow-300">{stats.hgaas}</div>
            </div>
            <div className="bg-blue-900/30 rounded-lg p-2 border border-blue-700/30">
              <div className="text-xs text-blue-400">Metallar</div>
              <div className="text-xl font-bold text-blue-300">{stats.metals}</div>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* QIDIRUV, FILTER VA VIEW MODE */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 space-y-4">
          {/* Qidiruv */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Birikma nomi, formula yoki metall turi..."
                className="w-full px-5 py-3 bg-purple-950/60 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-red-400 transition-colors"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "grid" ? "bg-red-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                📱 Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "table" ? "bg-red-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                📊 Jadval
              </button>
            </div>
          </div>

          {/* Metod filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-purple-400 text-xs py-2">AAS metodi:</span>
            {[
              { key: "all", label: "Barchasi", count: stats.total },
              { key: "FAAS", label: "🔥 Alanga (FAAS)", count: stats.faas },
              { key: "GFAAS", label: "⚫ Grafit pechi (GFAAS)", count: stats.gfaas },
              { key: "HGAAS", label: "💨 Gidrid (HGAAS)", count: stats.hgaas }
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setMethodFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  methodFilter === f.key
                    ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
                    : "bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:border-red-500/50"
                }`}
              >
                {f.label} <span className="opacity-60">({f.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* GRID VIEW */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => {
              const colors = rangMap[b.color] || rangMap.red
              const mColors = methodColors[b.method]
              const metalKey = Object.keys(b.theoretical)[0]
              const delta = b.delta[metalKey]
              
              return (
                <Link
                  key={b.id}
                  href={`/ilmiy/tahlil/aas/birikmalar/${b.slug}`}
                  className={`group ${colors.bg} border ${colors.border} rounded-2xl p-6 hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl block relative overflow-hidden`}
                >
                  {/* Method gradient overlay */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${mColors.gradient} to-transparent`}></div>

                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold ${colors.text} leading-tight`}>{b.formula}</h3>
                      <p className="text-purple-400 text-xs mt-1 line-clamp-1">{b.iupac}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border shrink-0 ml-2 ${mColors.bg} ${mColors.text} ${mColors.border}`}>
                      {b.method}
                    </span>
                  </div>

                  {/* Metall va λ */}
                  <div className="flex gap-2 mb-3">
                    <div className={`flex-1 ${colors.bg} rounded-lg p-2 border ${colors.border}`}>
                      <div className="text-[10px] text-purple-400">Metall</div>
                      <div className={`text-sm font-bold ${colors.text} truncate`}>{b.metal}</div>
                    </div>
                    <div className="bg-purple-950/40 rounded-lg p-2 border border-purple-700/30">
                      <div className="text-[10px] text-purple-400">λ (nm)</div>
                      <div className="text-sm font-mono font-bold text-yellow-400">{b.lambda}</div>
                    </div>
                  </div>

                  {/* Alanga turi */}
                  <div className="bg-purple-950/40 rounded-lg px-3 py-2 mb-3 border border-purple-700/20">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-purple-400">🔥 Atomlashtirish:</span>
                      <span className="text-xs font-mono text-orange-300">{b.flame}</span>
                    </div>
                  </div>

                  {/* %M va Delta */}
                  <div className="bg-purple-950/50 rounded-lg p-3 text-xs space-y-1.5 mb-3">
                    <div className="flex justify-between">
                      <span className="text-purple-500">%{metalKey} (Naz):</span>
                      <span className="font-mono text-yellow-400 font-semibold">{b.theoretical[metalKey]}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-500">%{metalKey} (Ekp):</span>
                      <span className="font-mono text-green-400 font-semibold">{b.experimental[metalKey]}%</span>
                    </div>
                    <div className="flex justify-between border-t border-purple-800/40 pt-1">
                      <span className="text-purple-500">Δ (Farq):</span>
                      <span className={`font-mono font-bold ${delta <= 0.1 ? 'text-green-400' : delta <= 0.2 ? 'text-yellow-400' : 'text-orange-400'}`}>
                        {delta.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Parametrlar */}
                  <div className="grid grid-cols-3 gap-1 mb-3">
                    <div className="bg-purple-950/30 rounded p-1.5 text-center">
                      <div className="text-[9px] text-purple-500">RSD</div>
                      <div className={`text-xs font-mono ${b.rsd <= 1.5 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {b.rsd}%
                      </div>
                    </div>
                    <div className="bg-purple-950/30 rounded p-1.5 text-center">
                      <div className="text-[9px] text-purple-500">LOD</div>
                      <div className="text-xs font-mono text-cyan-400">{b.lod}</div>
                    </div>
                    <div className="bg-purple-950/30 rounded p-1.5 text-center">
                      <div className="text-[9px] text-purple-500">Status</div>
                      <div className={`text-xs ${b.status === "A'lo" ? 'text-green-400' : 'text-blue-400'}`}>
                        {b.status}
                      </div>
                    </div>
                  </div>

                  {/* Maxsus xususiyat */}
                  <div className="bg-gradient-to-r from-red-900/20 to-transparent rounded-lg px-3 py-2 border-l-2 border-red-500/50">
                    <p className="text-[11px] text-red-200 font-medium line-clamp-2">⭐ {b.special}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* TABLE VIEW */}
        {viewMode === "table" && (
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700 text-left">
                  <th className="py-3 px-3 text-purple-300 text-xs">Formula</th>
                  <th className="py-3 px-3 text-purple-300 text-xs">Metall</th>
                  <th className="py-3 px-3 text-center text-purple-300 text-xs">Usul</th>
                  <th className="py-3 px-3 text-center text-purple-300 text-xs">λ (nm)</th>
                  <th className="py-3 px-3 text-center text-purple-300 text-xs">Alanga</th>
                  <th className="py-3 px-3 text-center text-purple-300 text-xs">%M (Naz)</th>
                  <th className="py-3 px-3 text-center text-purple-300 text-xs">%M (Ekp)</th>
                  <th className="py-3 px-3 text-center text-purple-300 text-xs">Δ</th>
                  <th className="py-3 px-3 text-center text-purple-300 text-xs">RSD</th>
                  <th className="py-3 px-3 text-center text-purple-300 text-xs">LOD</th>
                  <th className="py-3 px-3 text-left text-purple-300 text-xs">Maxsus</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {filtered.map((b) => {
                  const colors = rangMap[b.color] || rangMap.red
                  const mColors = methodColors[b.method]
                  const metalKey = Object.keys(b.theoretical)[0]
                  const delta = b.delta[metalKey]
                  return (
                    <tr key={b.id} className="border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors">
                      <td className="py-3 px-3">
                        <Link 
                          href={`/ilmiy/tahlil/aas/birikmalar/${b.slug}`} 
                          className={`${colors.text} font-bold hover:underline text-sm`}
                        >
                          {b.formula}
                        </Link>
                        <div className="text-[10px] text-purple-500 mt-0.5">{b.iupac}</div>
                      </td>
                      <td className={`py-3 px-3 font-semibold ${colors.text} text-xs`}>{b.metal}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${mColors.bg} ${mColors.text} ${mColors.border}`}>
                          {b.method}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-yellow-400 text-xs">{b.lambda}</td>
                      <td className="py-3 px-3 text-center text-orange-300 text-xs">{b.flame}</td>
                      <td className="py-3 px-3 text-center font-mono text-yellow-400 text-xs">{b.theoretical[metalKey]}</td>
                      <td className="py-3 px-3 text-center font-mono text-green-400 text-xs">{b.experimental[metalKey]}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-xs">
                        <span className={delta <= 0.1 ? 'text-green-400' : delta <= 0.2 ? 'text-yellow-400' : 'text-orange-400'}>
                          {delta.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-xs">
                        <span className={b.rsd <= 1.5 ? 'text-green-400' : 'text-yellow-400'}>
                          {b.rsd}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-cyan-400 text-xs">{b.lod}</td>
                      <td className="py-3 px-3 text-[10px] text-red-200 max-w-[200px] truncate">{b.special}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* IZOH */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/20 border border-red-500/30 rounded-2xl p-6">
          <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
            <span>📝</span> AAS parametrlari izohi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="text-purple-200 text-sm space-y-2 list-disc list-inside">
              <li><strong className="text-red-300">FAAS (Flame AAS):</strong> Havo-atsetilen (~2300°C) yoki N₂O-atsetilen (~2900°C). LOD: 0.001−0.05 mg/L (ppm).</li>
              <li><strong className="text-orange-300">GFAAS (Graphite Furnace):</strong> Grafit pechi, dasturlanadigan harorat. LOD: 0.01−1 μg/L (ppb).</li>
              <li><strong className="text-yellow-300">HGAAS (Hydride Generation):</strong> NaBH₄ bilan MH₃ gidridi. LOD: 0.001−0.1 μg/L (ppt). Faqat As, Se, Sb, Bi, Sn, Te.</li>
            </ul>
            <ul className="text-purple-200 text-sm space-y-2 list-disc list-inside">
              <li><strong className="text-cyan-300">LOD:</strong> Aniqlash chegarasi (S/N = 3)</li>
              <li><strong className="text-cyan-300">LOQ:</strong> Miqdoriy aniqlash (S/N = 10) ≈ 3.3 × LOD</li>
              <li><strong className="text-green-300">RSD:</strong> Nisbiy standart og'ish (5 ta parallel, ≤ 2% yaxshi)</li>
              <li><strong className="text-yellow-300">Δ:</strong> Nazariy va eksperimental %M farqi (<span className="text-green-400">≤ 0.5%</span> = tasdiqlangan)</li>
              <li><strong className="text-orange-300">Modifikator:</strong> GFAAS da uchuvchanlikni kamaytiruvchi qo'shimcha</li>
            </ul>
          </div>
        </div>

        {/* AAS ning EA dan farqi */}
        <div className="bg-gradient-to-r from-blue-900/20 to-red-900/20 border border-blue-500/30 rounded-2xl p-6">
          <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
            <span>⚖️</span> AAS vs EA (Element Analiz) — bu sahifa EA dan qanday farq qiladi?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-indigo-950/30 rounded-lg p-4 border border-indigo-700/30">
              <h4 className="text-indigo-300 font-bold mb-2">🧪 EA (Element Analiz)</h4>
              <ul className="text-purple-200 space-y-1 text-xs">
                <li>✓ <strong>C, H, N, S</strong> — organik elementlar</li>
                <li>✓ Ligandlar tarkibini aniqlaydi</li>
                <li>✗ Metallarni o'lchay olmaydi</li>
                <li>✓ Butun formula validatsiyasi</li>
              </ul>
            </div>
            <div className="bg-red-950/30 rounded-lg p-4 border border-red-700/30">
              <h4 className="text-red-300 font-bold mb-2">🧯 AAS (Atom-Absorbsion)</h4>
              <ul className="text-purple-200 space-y-1 text-xs">
                <li>✓ <strong>Metallar</strong> — Fe, Cu, Pt, Au, Cd va h.k.</li>
                <li>✗ Ligandlar tarkibini bilmaydi</li>
                <li>✓ Juda yuqori sezgirlik (ppb-ppt)</li>
                <li>✓ Formula metall qismini tasdiqlaydi</li>
              </ul>
            </div>
          </div>
          <p className="text-purple-300 text-xs mt-3 italic">
            💡 <strong>Ideal tahlil:</strong> EA + AAS (yoki ICP-OES) birgalikda — to'liq formula validatsiyasi. 
            EA organik qismini (ligandlarni), AAS metall qismini tasdiqlaydi.
          </p>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • AAS Birikmalar Katalogi</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955)</p>
        </div>
      </footer>
    </main>
  )
}