"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// MA'LUMOTLAR BAZASI — Element Analizi uchun Birikmalar
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
    elements: { C: 6, H: 6, N: 6 },
    theoretical: { C: 17.06, H: 1.43, N: 19.90 },
    experimental: { C: 17.12, H: 1.45, N: 19.85 },
    delta: { C: 0.06, H: 0.02, N: 0.05 },
    status: "A'lo", // A'lo, Yaxshi, Qoniqarli
    color: "yellow",
    desc: "Past spinli Fe²⁺ kompleksi. 3 ta gidrat suvi mavjud."
  },
  {
    id: "k3-fe-cn6",
    slug: "k3-fe-cn6",
    formula: "K₃[Fe(CN)₆]",
    iupac: "Kaliy geksatsianoferrat(III)",
    metal: "Fe³⁺",
    config: "d⁵ (LS)",
    M: 329.24,
    elements: { C: 6, H: 0, N: 6 },
    theoretical: { C: 21.89, H: 0.00, N: 25.53 },
    experimental: { C: 21.75, H: 0.00, N: 25.38 },
    delta: { C: 0.14, H: 0.00, N: 0.15 },
    status: "Yaxshi",
    color: "orange",
    desc: "Past spinli Fe³⁺. Gidrat suvi yo'q. Oksidlangan shakl."
  },
  {
    id: "fe-h2o6-so4",
    slug: "fe-h2o6-so4",
    formula: "[Fe(H₂O)₆]SO₄",
    iupac: "Geksaakvatemir(II) sulfat",
    metal: "Fe²⁺",
    config: "d⁶ (HS)",
    M: 246.02,
    elements: { C: 0, H: 12, N: 0 },
    theoretical: { C: 0.00, H: 4.92, N: 0.00 },
    experimental: { C: 0.00, H: 4.88, N: 0.00 },
    delta: { C: 0.00, H: 0.04, N: 0.00 },
    status: "A'lo",
    color: "green",
    desc: "Yuqori spinli Fe²⁺. 6 ta koordinatsion suv."
  },
  {
    id: "cu-nh3-4-so4-h2o",
    slug: "cu-nh3-4-so4-h2o",
    formula: "[Cu(NH₃)₄]SO₄·H₂O",
    iupac: "Tetraammismis(II) sulfat monogidrat",
    metal: "Cu²⁺",
    config: "d⁹",
    M: 245.75,
    elements: { C: 0, H: 14, N: 4 },
    theoretical: { C: 0.00, H: 5.74, N: 22.80 },
    experimental: { C: 0.05, H: 5.78, N: 22.65 },
    delta: { C: 0.05, H: 0.04, N: 0.15 },
    status: "Yaxshi",
    color: "blue",
    desc: "Jahn-Teller effekti. 1 ta gidrat suvi."
  },
  {
    id: "co-nh3-6-cl3",
    slug: "co-nh3-6-cl3",
    formula: "[Co(NH₃)₆]Cl₃",
    iupac: "Geksaamminkobalt(III) xlorid",
    metal: "Co³⁺",
    config: "d⁶ (LS)",
    M: 267.48,
    elements: { C: 0, H: 18, N: 6 },
    theoretical: { C: 0.00, H: 6.78, N: 31.42 },
    experimental: { C: 0.00, H: 6.82, N: 31.28 },
    delta: { C: 0.00, H: 0.04, N: 0.14 },
    status: "Yaxshi",
    color: "pink",
    desc: "Verner klassigi. Kinetik inert. Suvsiz."
  },
  {
    id: "ni-en3-cl2",
    slug: "ni-en3-cl2",
    formula: "[Ni(en)₃]Cl₂",
    iupac: "Tris(etilendiamin)nikel(II) xlorid",
    metal: "Ni²⁺",
    config: "d⁸",
    M: 345.83,
    elements: { C: 6, H: 24, N: 6 },
    theoretical: { C: 20.84, H: 7.01, N: 24.30 },
    experimental: { C: 20.78, H: 7.05, N: 24.15 },
    delta: { C: 0.06, H: 0.04, N: 0.15 },
    status: "Yaxshi",
    color: "purple",
    desc: "Bidentat ligand (en). Paramagnit."
  },
  {
    id: "sisplatin",
    slug: "sisplatin",
    formula: "Pt(NH₃)₂Cl₂",
    iupac: "Diammindixloroplatina(II)",
    metal: "Pt²⁺",
    config: "d⁸",
    M: 300.05,
    elements: { C: 0, H: 6, N: 2 },
    theoretical: { C: 0.00, H: 2.01, N: 9.33 },
    experimental: { C: 0.08, H: 2.05, N: 9.28 },
    delta: { C: 0.08, H: 0.04, N: 0.05 },
    status: "A'lo",
    color: "gray",
    desc: "Saraton dorisi. Cis-konfiguratsiya."
  },
  {
    id: "ferrosen",
    slug: "ferrosen",
    formula: "Fe(C₅H₅)₂",
    iupac: "Bis(tsiklopentadienil)temir(II)",
    metal: "Fe²⁺",
    config: "d⁶ (LS)",
    M: 186.03,
    elements: { C: 10, H: 10, N: 0 },
    theoretical: { C: 64.56, H: 5.42, N: 0.00 },
    experimental: { C: 64.48, H: 5.45, N: 0.00 },
    delta: { C: 0.08, H: 0.03, N: 0.00 },
    status: "A'lo",
    color: "amber",
    desc: "Sandwich struktura. Metallocene."
  },
  {
    id: "k2-ptcl4",
    slug: "k2-ptcl4",
    formula: "K₂[PtCl₄]",
    iupac: "Kaliy tetraxloroplatinat(II)",
    metal: "Pt²⁺",
    config: "d⁸",
    M: 415.09,
    elements: { C: 0, H: 0, N: 0 },
    theoretical: { C: 0.00, H: 0.00, N: 0.00 },
    experimental: { C: 0.00, H: 0.00, N: 0.00 },
    delta: { C: 0.00, H: 0.00, N: 0.00 },
    status: "Toza",
    color: "red",
    desc: "Sisplatin prekursori. Organik modda yo'q."
  },
  {
    id: "ni-co-4",
    slug: "ni-co-4",
    formula: "Ni(CO)₄",
    iupac: "Tetrakarbonilnikiel(0)",
    metal: "Ni⁰",
    config: "d¹⁰",
    M: 170.73,
    elements: { C: 4, H: 0, N: 0 },
    theoretical: { C: 28.12, H: 0.00, N: 0.00 },
    experimental: { C: 28.05, H: 0.00, N: 0.00 },
    delta: { C: 0.07, H: 0.00, N: 0.00 },
    status: "A'lo",
    color: "stone",
    desc: "Karbonil kompleks. Juda zaharli."
  },
  {
    id: "ru-bipy3",
    slug: "ru-bipy3",
    formula: "[Ru(bipy)₃]Cl₂·6H₂O",
    iupac: "Tris(bipiridin)ruteniy(II) xlorid",
    metal: "Ru²⁺",
    config: "d⁶ (LS)",
    M: 733.59,
    elements: { C: 30, H: 36, N: 6 },
    theoretical: { C: 49.13, H: 4.95, N: 11.46 },
    experimental: { C: 49.05, H: 4.98, N: 11.38 },
    delta: { C: 0.08, H: 0.03, N: 0.08 },
    status: "A'lo",
    color: "rose",
    desc: "Lyuminestsent kompleks. 6 ta gidrat suvi."
  },
  {
    id: "cu-cn-4",
    slug: "cu-cn-4",
    formula: "K₃[Cu(CN)₄]",
    iupac: "Kaliy tetratsianokuprat(I)",
    metal: "Cu⁺",
    config: "d¹⁰",
    M: 341.86,
    elements: { C: 4, H: 0, N: 4 },
    theoretical: { C: 14.05, H: 0.00, N: 16.39 },
    experimental: { C: 13.98, H: 0.00, N: 16.32 },
    delta: { C: 0.07, H: 0.00, N: 0.07 },
    status: "Yaxshi",
    color: "cyan",
    desc: "Cu(I) kompleksi. Diamagnit."
  }
]

// Ranglar
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
  cyan: { bg: "bg-cyan-600/10", text: "text-cyan-400", border: "border-cyan-500/30" }
}

export default function EABirikmalar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")

  // Filterlash
  const filtered = useMemo(() => {
    if (!searchQuery) return birikmalar
    const q = searchQuery.toLowerCase()
    return birikmalar.filter(b => 
      b.formula.toLowerCase().includes(q) ||
      b.iupac.toLowerCase().includes(q) ||
      b.metal.toLowerCase().includes(q)
    )
  }, [searchQuery])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm mb-3 text-purple-400">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/element-analiz" className="hover:text-purple-300">Element Analiz</Link>
            <span className="text-purple-600">›</span>
            <span className="text-indigo-400 font-semibold">Birikmalar</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-indigo-400 flex items-center gap-3">
                <span className="text-3xl">🧪</span>
                EA Birikmalar Katalogi
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                12 ta kompleks • C/H/N/S tarkibi • Formula validatsiyasi
              </p>
            </div>
            <Link 
              href="/ilmiy/tahlil/element-analiz"
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-700/50"
            >
              ← Element Analiz Nazariyasi
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* QIDIRUV VA VIEW MODE */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Birikma nomi yoki formulasi..."
              className="w-full px-5 py-3 bg-purple-950/60 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "grid" ? "bg-indigo-600 text-white" : "bg-purple-900/50 text-purple-300"
              }`}
            >
              📱 Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "table" ? "bg-indigo-600 text-white" : "bg-purple-900/50 text-purple-300"
              }`}
            >
              📊 Jadval
            </button>
          </div>
        </div>

        {/* GRID VIEW */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => {
              const colors = rangMap[b.color]
              const maxDelta = Math.max(b.delta.C, b.delta.H, b.delta.N)
              
              return (
                <Link
                  key={b.id}
                  href={`/ilmiy/tahlil/element-analiz/birikmalar/${b.slug}`}
                  className={`group ${colors.bg} border ${colors.border} rounded-2xl p-6 hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl block`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-xl font-bold ${colors.text}`}>{b.formula}</h3>
                      <p className="text-purple-400 text-xs mt-1">{b.iupac}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      b.status === "A'lo" ? "bg-green-600/20 text-green-400 border-green-500/30" :
                      b.status === "Yaxshi" ? "bg-blue-600/20 text-blue-400 border-blue-500/30" :
                      "bg-gray-600/20 text-gray-400 border-gray-500/30"
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-400">M:</span>
                      <span className="font-mono text-white">{b.M} g/mol</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-400">Metal:</span>
                      <span className={`font-bold ${colors.text}`}>{b.metal}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-400">Max Δ:</span>
                      <span className={`font-mono ${maxDelta <= 0.2 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {maxDelta.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-purple-950/50 rounded-lg p-3 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-purple-500">C (Naz/Ekp):</span>
                      <span className="font-mono">{b.theoretical.C} / {b.experimental.C}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-500">H (Naz/Ekp):</span>
                      <span className="font-mono">{b.theoretical.H} / {b.experimental.H}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-500">N (Naz/Ekp):</span>
                      <span className="font-mono">{b.theoretical.N} / {b.experimental.N}</span>
                    </div>
                  </div>

                  <p className="text-purple-300 text-xs mt-3 line-clamp-2">{b.desc}</p>
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
                  <th className="py-3 px-4 text-purple-300">Formula</th>
                  <th className="py-3 px-4 text-purple-300">Metal</th>
                  <th className="py-3 px-4 text-center text-purple-300">M (g/mol)</th>
                  <th className="py-3 px-4 text-center text-purple-300">C % (Naz/Ekp)</th>
                  <th className="py-3 px-4 text-center text-purple-300">H % (Naz/Ekp)</th>
                  <th className="py-3 px-4 text-center text-purple-300">N % (Naz/Ekp)</th>
                  <th className="py-3 px-4 text-center text-purple-300">Max Δ</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {filtered.map((b) => {
                  const colors = rangMap[b.color]
                  const maxDelta = Math.max(b.delta.C, b.delta.H, b.delta.N)
                  return (
                    <tr key={b.id} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4">
                        <Link href={`/ilmiy/tahlil/element-analiz/birikmalar/${b.slug}`} className={`${colors.text} font-bold hover:underline`}>
                          {b.formula}
                        </Link>
                      </td>
                      <td className="py-3 px-4">{b.metal}</td>
                      <td className="py-3 px-4 text-center font-mono">{b.M}</td>
                      <td className="py-3 px-4 text-center font-mono text-xs">{b.theoretical.C} / {b.experimental.C}</td>
                      <td className="py-3 px-4 text-center font-mono text-xs">{b.theoretical.H} / {b.experimental.H}</td>
                      <td className="py-3 px-4 text-center font-mono text-xs">{b.theoretical.N} / {b.experimental.N}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold">
                        <span className={maxDelta <= 0.2 ? 'text-green-400' : 'text-yellow-400'}>
                          {maxDelta.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* FOOTER INFO */}
        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6">
          <h3 className="text-indigo-400 font-bold mb-2">📝 Izoh</h3>
          <ul className="text-purple-200 text-sm space-y-2 list-disc list-inside">
            <li><strong>Nazariy %:</strong> Molekulyar formuladan hisoblangan ideal qiymat.</li>
            <li><strong>Eksperimental %:</strong> CHNS analizatori orqali o'lchangan haqiqiy qiymat.</li>
            <li><strong>Δ (Farq):</strong> Nazariy va eksperimental qiymatlar orasidagi mutlaq farq. 
                <span className="text-green-400 ml-2">≤ 0.4%</span> bo'lsa formula tasdiqlangan hisoblanadi.</li>
            <li>Metallar (Fe, Cu, Co...) alohida usullar (ICP-MS, AAS) bilan aniqlanadi va bu jadvalga kiritilmagan.</li>
          </ul>
        </div>

      </section>
    </main>
  )
}