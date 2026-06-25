// app/ilmiy/tahlil/elektrokimyo/birikmalar/page.jsx
"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// MA'LUMOTLAR BAZASI — Elektrokimyoviy tahlil uchun 12 ta kompleks birikma
// ============================================================================

const birikmalar = [
  {
    id: "fe-cn6",
    slug: "fe-cn6",
    formula: "[Fe(CN)₆]³⁻/⁴⁻",
    iupac: "Geksatsianoferrat(III/II)",
    metal: "Fe³⁺/Fe²⁺",
    config: "d⁵/d⁶",
    E12: "+0.36 V",
    reversibility: "Qaytar",
    Kstab: "10³⁵ / 10⁴²",
    color: "yellow",
    desc: "Klassik qaytar redoks juftlik. CN⁻ kuchli maydon ligand — Fe³⁺ barqaror."
  },
  {
    id: "fe-h2o6",
    slug: "fe-h2o6",
    formula: "[Fe(H₂O)₆]³⁺/²⁺",
    iupac: "Geksaakvatemir(III/II)",
    metal: "Fe³⁺/Fe²⁺",
    config: "d⁵/d⁶",
    E12: "+0.77 V",
    reversibility: "Qaytar",
    Kstab: "—",
    color: "orange",
    desc: "Akvakompleks. H₂O kuchsiz maydon — Fe²⁺ barqaror."
  },
  {
    id: "co-nh3-6",
    slug: "co-nh3-6",
    formula: "[Co(NH₃)₆]³⁺/²⁺",
    iupac: "Geksaamminkobalt(III/II)",
    metal: "Co³⁺/Co²⁺",
    config: "d⁶/d⁷",
    E12: "+0.10 V",
    reversibility: "Sekin qaytar",
    Kstab: "10³⁵ / 10⁵",
    color: "pink",
    desc: "Inert kompleks. NH₃ kuchli maydon — Co³⁺ juda barqaror."
  },
  {
    id: "ru-bipy3",
    slug: "ru-bipy3",
    formula: "[Ru(bipy)₃]²⁺/³⁺",
    iupac: "Tris(bipiridin)ruteniy(II/III)",
    metal: "Ru²⁺/Ru³⁺",
    config: "d⁶/d⁵",
    E12: "+1.26 V",
    reversibility: "Qaytar",
    Kstab: "—",
    color: "rose",
    desc: "Fotokimyoviy kompleks. MLCT emissiya — DSSC quyosh elementlari."
  },
  {
    id: "ferrocene",
    slug: "ferrocene",
    formula: "[Fe(C₅H₅)₂]⁺/⁰",
    iupac: "Ferrosen/Ferroseniy",
    metal: "Fe²⁺/Fe³⁺",
    config: "d⁶/d⁵",
    E12: "+0.40 V",
    reversibility: "Ideal qaytar",
    Kstab: "—",
    color: "amber",
    desc: "Ichki standart. Metallocene — sandwich struktura."
  },
  {
    id: "cu-nh3-4",
    slug: "cu-nh3-4",
    formula: "[Cu(NH₃)₄]²⁺/⁺",
    iupac: "Tetraammismis(II/I)",
    metal: "Cu²⁺/Cu⁺",
    config: "d⁹/d¹⁰",
    E12: "−0.01 V",
    reversibility: "Qaytar",
    Kstab: "10¹³ / 10¹⁰",
    color: "blue",
    desc: "Jahn-Teller effekti. NH₃ Cu⁺ ni barqarorlashtiradi."
  },
  {
    id: "co-en3",
    slug: "co-en3",
    formula: "[Co(en)₃]³⁺/²⁺",
    iupac: "Tris(etilendiamin)kobalt(III/II)",
    metal: "Co³⁺/Co²⁺",
    config: "d⁶/d⁷",
    E12: "−0.26 V",
    reversibility: "Sekin qaytar",
    Kstab: "10⁴⁹ / 10⁷",
    color: "purple",
    desc: "Xelat effekt. en bidentat ligand — juda barqaror."
  },
  {
    id: "fe-phen3",
    slug: "fe-phen3",
    formula: "[Fe(phen)₃]²⁺/³⁺",
    iupac: "Tris(1,10-fenantrolin)temir(II/III)",
    metal: "Fe²⁺/Fe³⁺",
    config: "d⁶/d⁵",
    E12: "+1.12 V",
    reversibility: "Qaytar",
    Kstab: "10²¹ / 10¹⁴",
    color: "red",
    desc: "Ferroin indikatori. Qizil rang (Fe²⁺) → ko'k (Fe³⁺)."
  },
  {
    id: "ru-nh3-6",
    slug: "ru-nh3-6",
    formula: "[Ru(NH₃)₆]³⁺/²⁺",
    iupac: "Geksaamminruteniy(III/II)",
    metal: "Ru³⁺/Ru²⁺",
    config: "d⁵/d⁶",
    E12: "+0.10 V",
    reversibility: "Qaytar",
    Kstab: "—",
    color: "cyan",
    desc: "Ru — 4d metall, inert. NH₃ kuchli maydon."
  },
  {
    id: "ni-cn4",
    slug: "ni-cn4",
    formula: "[Ni(CN)₄]²⁻",
    iupac: "Tetratsianonikelat(II)",
    metal: "Ni²⁺/Ni⁰",
    config: "d⁸",
    E12: "−0.90 V",
    reversibility: "Qaytmas",
    Kstab: "10³⁰",
    color: "green",
    desc: "Kvadrat-tekis geometriya. Elektrokataliz."
  },
  {
    id: "mn-co5",
    slug: "mn-co5",
    formula: "[Mn(CO)₅]⁻",
    iupac: "Pentakarbonilmanganat(-I)",
    metal: "Mn⁻/Mn⁰",
    config: "d¹⁰",
    E12: "−1.20 V",
    reversibility: "Qaytar",
    Kstab: "—",
    color: "violet",
    desc: "Metall karbonil. 18 elektron qoidasi."
  },
  {
    id: "co-salen",
    slug: "co-salen",
    formula: "[Co(salen)]",
    iupac: "N,N'-bis(salitsiliden)etilendiaminkobalt(II)",
    metal: "Co²⁺/Co³⁺",
    config: "d⁷/d⁶",
    E12: "−0.80 V",
    reversibility: "Qaytar",
    Kstab: "—",
    color: "stone",
    desc: "Salen kompleksi. Katalizator — kislorod tashuvchi."
  }
]

// Rang sxemasi
const rangMap = {
  yellow: { bg: "bg-yellow-600/10", text: "text-yellow-400", border: "border-yellow-500/30" },
  orange: { bg: "bg-orange-600/10", text: "text-orange-400", border: "border-orange-500/30" },
  pink: { bg: "bg-pink-600/10", text: "text-pink-400", border: "border-pink-500/30" },
  rose: { bg: "bg-rose-600/10", text: "text-rose-400", border: "border-rose-500/30" },
  amber: { bg: "bg-amber-600/10", text: "text-amber-400", border: "border-amber-500/30" },
  blue: { bg: "bg-blue-600/10", text: "text-blue-400", border: "border-blue-500/30" },
  purple: { bg: "bg-purple-600/10", text: "text-purple-400", border: "border-purple-500/30" },
  red: { bg: "bg-red-600/10", text: "text-red-400", border: "border-red-500/30" },
  cyan: { bg: "bg-cyan-600/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  green: { bg: "bg-green-600/10", text: "text-green-400", border: "border-green-500/30" },
  violet: { bg: "bg-violet-600/10", text: "text-violet-400", border: "border-violet-500/30" },
  stone: { bg: "bg-stone-600/10", text: "text-stone-400", border: "border-stone-500/30" }
}

export default function ElektrokimyoBirikmalar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [reversibilityFilter, setReversibilityFilter] = useState("all")

  // Filterlash
  const filtered = useMemo(() => {
    let result = birikmalar
    if (reversibilityFilter !== "all") {
      if (reversibilityFilter === "qaytar") {
        result = result.filter(b => b.reversibility.includes("Qaytar"))
      } else if (reversibilityFilter === "qaytmas") {
        result = result.filter(b => b.reversibility.includes("Qaytmas"))
      }
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(b => 
        b.formula.toLowerCase().includes(q) ||
        b.iupac.toLowerCase().includes(q) ||
        b.metal.toLowerCase().includes(q)
      )
    }
    return result
  }, [searchQuery, reversibilityFilter])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-cyan-950/20 to-blue-950 text-white">
      
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm mb-3 text-purple-400">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/elektrokimyo" className="hover:text-purple-300">Elektrokimyo</Link>
            <span className="text-purple-600">›</span>
            <span className="text-cyan-400 font-semibold">Birikmalar</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 flex items-center gap-3">
                <span className="text-3xl">⚡</span>
                Elektrokimyoviy Birikmalar Katalogi
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                12 ta kompleks • Redoks potensiallar • Barqarorlik konstantasi • Qaytariluvchanlik
              </p>
            </div>
            <Link 
              href="/ilmiy/tahlil/elektrokimyo"
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-700/50"
            >
              ← Elektrokimyoviy tahlil
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* QIDIRUV VA FILTER */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 space-y-4">
          {/* Qidiruv */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Birikma nomi, metall yoki formula..."
                className="w-full px-5 py-3 bg-purple-950/60 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "grid" ? "bg-cyan-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                📱 Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "table" ? "bg-cyan-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                📊 Jadval
              </button>
            </div>
          </div>

          {/* Filter — Qaytariluvchanlik */}
          <div className="flex flex-wrap gap-2">
            <span className="text-purple-400 text-xs py-2">Qaytariluvchanlik:</span>
            <button
              onClick={() => setReversibilityFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                reversibilityFilter === "all"
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:border-cyan-500/50"
              }`}
            >
              Barchasi ({birikmalar.length})
            </button>
            <button
              onClick={() => setReversibilityFilter("qaytar")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                reversibilityFilter === "qaytar"
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:border-cyan-500/50"
              }`}
            >
              Qaytar ({birikmalar.filter(b => b.reversibility.includes("Qaytar")).length})
            </button>
            <button
              onClick={() => setReversibilityFilter("qaytmas")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                reversibilityFilter === "qaytmas"
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:border-cyan-500/50"
              }`}
            >
              Qaytmas ({birikmalar.filter(b => b.reversibility.includes("Qaytmas")).length})
            </button>
          </div>
        </div>

        {/* GRID VIEW */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => {
              const colors = rangMap[b.color]
              return (
                <Link
                  key={b.id}
                  href={`/ilmiy/tahlil/elektrokimyo/birikmalar/${b.slug}`}
                  className={`group ${colors.bg} border ${colors.border} rounded-2xl p-6 hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl block`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-xl font-bold ${colors.text}`}>{b.formula}</h3>
                      <p className="text-purple-400 text-xs mt-1">{b.iupac}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      b.reversibility.includes("Qaytar") 
                        ? "bg-green-600/20 text-green-400 border-green-500/30" 
                        : "bg-red-600/20 text-red-400 border-red-500/30"
                    }`}>
                      {b.reversibility}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-400">Metal:</span>
                      <span className={`font-bold ${colors.text}`}>{b.metal}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-400">E₁/₂:</span>
                      <span className="font-mono text-yellow-400 font-bold">{b.E12}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-400">Kstab:</span>
                      <span className="font-mono text-cyan-400">{b.Kstab}</span>
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
                  <th className="py-3 px-4 text-cyan-300">Formula</th>
                  <th className="py-3 px-4 text-cyan-300">Metal</th>
                  <th className="py-3 px-4 text-center text-cyan-300">E₁/₂ (V)</th>
                  <th className="py-3 px-4 text-center text-cyan-300">Kstab</th>
                  <th className="py-3 px-4 text-center text-cyan-300">Qaytariluvchanlik</th>
                  <th className="py-3 px-4 text-center text-cyan-300">Config</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {filtered.map((b) => {
                  const colors = rangMap[b.color]
                  return (
                    <tr key={b.id} className="border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors">
                      <td className="py-3 px-4">
                        <Link href={`/ilmiy/tahlil/elektrokimyo/birikmalar/${b.slug}`} className={`${colors.text} font-bold hover:underline`}>
                          {b.formula}
                        </Link>
                      </td>
                      <td className="py-3 px-4">{b.metal}</td>
                      <td className="py-3 px-4 text-center font-mono text-yellow-400 font-bold">{b.E12}</td>
                      <td className="py-3 px-4 text-center font-mono text-cyan-400">{b.Kstab}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full border ${
                          b.reversibility.includes("Qaytar") 
                            ? "bg-green-600/20 text-green-400 border-green-500/30" 
                            : "bg-red-600/20 text-red-400 border-red-500/30"
                        }`}>
                          {b.reversibility}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-purple-300">{b.config}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* FOOTER INFO */}
        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-2xl p-6">
          <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2">📝 Izoh</h3>
          <ul className="text-purple-200 text-sm space-y-2 list-disc list-inside">
            <li><strong className="text-yellow-400">E₁/₂:</strong> Yarim to'lqin potensiali — redoks juftlikning standart potensiali.</li>
            <li><strong className="text-yellow-400">Kstab:</strong> Barqarorlik konstantasi — kompleksning barqarorlik darajasi.</li>
            <li><strong className="text-yellow-400">Qaytariluvchanlik:</strong> Qaytar sistemada ΔE = 59/n mV, qaytmasda ΔE {'>'} 59/n mV.</li>
            <li><strong className="text-yellow-400">Config:</strong> Metallning elektron konfiguratsiyasi (dⁿ).</li>
          </ul>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • Elektrokimyoviy tahlil • Birikmalar katalogi</p>
          <p className="mt-1">Manbalar: Bard & Faulkner, Electrochemical Methods, IUPAC</p>
        </div>
      </footer>
    </main>
  )
}