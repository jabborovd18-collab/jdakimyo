"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════
// BIRIKMALAR MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════
const birikmalar = [
  {
    id: "fe-cn6-4",
    formula: "K₄[Fe(CN)₆]",
    iupac: "Kaliy geksatsianoferrat(II)",
    metal: "Fe²⁺",
    config: "d⁶ (LS)",
    spin: "S=0",
    orbital: "Fe 2p₃/₂",
    be: 708.2,
    splitting: 13.1,
    satellite: "Kuchsiz",
    rang: "yellow",
    izoh: "Past spinli Fe²⁺ kompleksi. CN⁻ kuchli maydon ligandi.",
    ligand: "6 × CN⁻",
    type: "Kompleks LS"
  },
  {
    id: "fe-cn6-3",
    formula: "K₃[Fe(CN)₆]",
    iupac: "Kaliy geksatsianoferrat(III)",
    metal: "Fe³⁺",
    config: "d⁵ (LS)",
    spin: "S=1/2",
    orbital: "Fe 2p₃/₂",
    be: 709.8,
    splitting: 13.1,
    satellite: "Kuchsiz",
    rang: "orange",
    izoh: "Past spinli Fe³⁺. K₄[Fe(CN)₆] dan BE farqi +1.6 eV.",
    ligand: "6 × CN⁻",
    type: "Kompleks LS"
  },
  {
    id: "fe-h2o6-2",
    formula: "[Fe(H₂O)₆]²⁺",
    iupac: "Geksaakvatemir(II) ioni",
    metal: "Fe²⁺",
    config: "d⁶ (HS)",
    spin: "S=2",
    orbital: "Fe 2p₃/₂",
    be: 710.0,
    splitting: 13.1,
    satellite: "Shake-up ~715 eV",
    rang: "green",
    izoh: "Yuqori spinli Fe²⁺. H₂O kuchsiz maydon → HS. Kuchli shake-up satellit.",
    ligand: "6 × H₂O",
    type: "Ion HS"
  },
  {
    id: "fe-h2o6-3",
    formula: "[Fe(H₂O)₆]³⁺",
    iupac: "Geksaakvatemir(III) ioni",
    metal: "Fe³⁺",
    config: "d⁵ (HS)",
    spin: "S=5/2",
    orbital: "Fe 2p₃/₂",
    be: 711.5,
    splitting: 13.1,
    satellite: "Shake-up ~719 eV",
    rang: "red",
    izoh: "Yuqori spinli Fe³⁺. Xarakterli 719 eV satellit.",
    ligand: "6 × H₂O",
    type: "Ion HS"
  },
  {
    id: "cu-nh3-4",
    formula: "[Cu(NH₃)₄]²⁺",
    iupac: "Tetraammismis(II) ioni",
    metal: "Cu²⁺",
    config: "d⁹",
    spin: "S=1/2",
    orbital: "Cu 2p₃/₂",
    be: 934.0,
    splitting: 19.75,
    satellite: "Kuchli shake-up 940-945 eV",
    rang: "blue",
    izoh: "d⁹ konfiguratsiya. Kuchli shake-up satellitlar — Cu²⁺ diagnostikasi.",
    ligand: "4 × NH₃",
    type: "d⁹"
  },
  {
    id: "cu-cn-4",
    formula: "[Cu(CN)₄]³⁻",
    iupac: "Tetratsianokuprat(I) ioni",
    metal: "Cu⁺",
    config: "d¹⁰",
    spin: "S=0",
    orbital: "Cu 2p₃/₂",
    be: 932.6,
    splitting: 19.75,
    satellite: "Yo'q",
    rang: "cyan",
    izoh: "d¹⁰ konfiguratsiya. Satellit yo'q — Cu⁺/Cu²⁺ farqlash uchun muhim.",
    ligand: "4 × CN⁻",
    type: "d¹⁰"
  },
  {
    id: "co-nh3-6",
    formula: "[Co(NH₃)₆]³⁺",
    iupac: "Geksaamminkobalt(III) ioni",
    metal: "Co³⁺",
    config: "d⁶ (LS)",
    spin: "S=0",
    orbital: "Co 2p₃/₂",
    be: 779.8,
    splitting: 15.0,
    satellite: "Kuchsiz",
    rang: "pink",
    izoh: "Past spinli Co³⁺. NH₃ kuchli maydon → LS. Kinetik inert.",
    ligand: "6 × NH₃",
    type: "Kompleks LS"
  },
  {
    id: "co-h2o6-2",
    formula: "[Co(H₂O)₆]²⁺",
    iupac: "Geksaakvakobalt(II) ioni",
    metal: "Co²⁺",
    config: "d⁷ (HS)",
    spin: "S=3/2",
    orbital: "Co 2p₃/₂",
    be: 781.0,
    splitting: 15.0,
    satellite: "Kuchli shake-up ~786 eV",
    rang: "rose",
    izoh: "Yuqori spinli Co²⁺. H₂O kuchsiz maydon → HS. Kuchli shake-up.",
    ligand: "6 × H₂O",
    type: "Ion HS"
  },
  {
    id: "sisplatin",
    formula: "Pt(NH₃)₂Cl₂",
    iupac: "Diammindixloroplatina(II)",
    metal: "Pt²⁺",
    config: "d⁸",
    spin: "S=0",
    orbital: "Pt 4f₇/₂",
    be: 72.8,
    splitting: 3.33,
    satellite: "Yo'q",
    rang: "gray",
    izoh: "Saraton dorisi. Tekis kvadrat. Pt²⁺ diagnostikasi.",
    ligand: "2 × NH₃, 2 × Cl⁻",
    type: "Kompleks"
  },
  {
    id: "ferrosen",
    formula: "Fe(C₅H₅)₂",
    iupac: "Bis(siklopentadienil)temir(II)",
    metal: "Fe²⁺",
    config: "d⁶ (LS)",
    spin: "S=0",
    orbital: "Fe 2p₃/₂",
    be: 708.2,
    splitting: 13.1,
    satellite: "Kuchsiz",
    rang: "amber",
    izoh: "Sandvich birikma. η⁵-C₅H₅ ligandlar. Barqaror.",
    ligand: "2 × C₅H₅⁻",
    type: "Sandvich"
  },
  {
    id: "k2-ptcl4",
    formula: "K₂[PtCl₄]",
    iupac: "Kaliy tetraxloroplatinat(II)",
    metal: "Pt²⁺",
    config: "d⁸",
    spin: "S=0",
    orbital: "Pt 4f₇/₂",
    be: 73.2,
    splitting: 3.33,
    satellite: "Yo'q",
    rang: "gray",
    izoh: "Tekis kvadrat. Cl⁻ ligandlar. Sisplatin prekursori.",
    ligand: "4 × Cl⁻",
    type: "Kompleks"
  },
  {
    id: "ni-co-4",
    formula: "Ni(CO)₄",
    iupac: "Tetrakarbonilnikiel(0)",
    metal: "Ni⁰",
    config: "d¹⁰",
    spin: "S=0",
    orbital: "Ni 2p₃/₂",
    be: 852.8,
    splitting: 17.3,
    satellite: "Yo'q",
    rang: "gray",
    izoh: "Ni⁰ metall. Tetraedrik. CO kuchli π-akseptor. Zaharli!",
    ligand: "4 × CO",
    type: "Metall"
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
  gray: { text: "text-gray-400", bg: "bg-gray-600/10", border: "border-gray-500/30", hex: "#9ca3af" }
}

// ═══════════════════════════════════════════════════════════
// XPS SPEKTR GENERATORI
// ═══════════════════════════════════════════════════════════
function generateSpectrum(entry) {
  const points = []
  const minE = entry.be - 8
  const maxE = entry.be + 20
  const steps = 150
  
  for (let i = 0; i <= steps; i++) {
    const e = minE + (i / steps) * (maxE - minE)
    
    // Asosiy pik
    const x = (e - entry.be) / 1.2
    let intensity = Math.exp(-0.5 * x * x)
    
    // Spin-orbital dublet
    if (entry.splitting > 0) {
      const x2 = (e - (entry.be + entry.splitting)) / 1.2
      const ratio = entry.orbital.includes("p") ? 0.5 : 
                    entry.orbital.includes("d") ? 0.67 : 0.75
      intensity += ratio * Math.exp(-0.5 * x2 * x2)
    }
    
    // Shake-up satellite
    if (entry.satellite.includes("shake-up")) {
      const satMatch = entry.satellite.match(/~?(\d+)/)
      if (satMatch) {
        const satE = parseInt(satMatch[1])
        const xs = (e - satE) / 2.0
        intensity += 0.35 * Math.exp(-0.5 * xs * xs)
      }
    }
    
    points.push({ e, intensity })
  }
  
  return points
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function XPSBirikmalar() {
  const [selectedElement, setSelectedElement] = useState("all")
  const [selectedSpin, setSelectedSpin] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid") // grid or table

  // ═══════════════════════════════════════════════════════════
  // STATISTIKA
  // ═══════════════════════════════════════════════════════════
  const stats = useMemo(() => ({
    total: birikmalar.length,
    metals: [...new Set(birikmalar.map(b => b.metal))].length,
    lsCount: birikmalar.filter(b => b.type.includes("LS")).length,
    hsCount: birikmalar.filter(b => b.type.includes("HS")).length,
    d9d10Count: birikmalar.filter(b => b.type === "d⁹" || b.type === "d¹⁰").length
  }), [])

  // ═══════════════════════════════════════════════════════════
  // METALLAR RO'YXATI
  // ═══════════════════════════════════════════════════════════
  const metals = useMemo(() => 
    ["all", ...new Set(birikmalar.map(b => b.metal))], 
    []
  )

  // ═══════════════════════════════════════════════════════════
  // SPIN STATES RO'YXATI
  // ═══════════════════════════════════════════════════════════
  const spinStates = [
    { id: "all", label: "Hammasi" },
    { id: "LS", label: "Past spin (LS)" },
    { id: "HS", label: "Yuqori spin (HS)" },
    { id: "d9", label: "d⁹ (Cu²⁺)" },
    { id: "d10", label: "d¹⁰ (Cu⁺, Ni⁰)" },
    { id: "d8", label: "d⁸ (Pt²⁺)" }
  ]

  // ═══════════════════════════════════════════════════════════
  // FILTERLANGAN MA'LUMOTLAR
  // ═══════════════════════════════════════════════════════════
  const filtered = useMemo(() => {
    return birikmalar.filter(b => {
      // Element filter
      if (selectedElement !== "all" && b.metal !== selectedElement) return false
      
      // Spin filter
      if (selectedSpin !== "all") {
        if (selectedSpin === "LS" && !b.type.includes("LS")) return false
        if (selectedSpin === "HS" && !b.type.includes("HS")) return false
        if (selectedSpin === "d9" && b.type !== "d⁹") return false
        if (selectedSpin === "d10" && b.type !== "d¹⁰") return false
        if (selectedSpin === "d8" && b.type !== "d⁸") return false
      }
      
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          b.formula.toLowerCase().includes(q) ||
          b.iupac.toLowerCase().includes(q) ||
          b.metal.toLowerCase().includes(q) ||
          b.izoh.toLowerCase().includes(q)
        )
      }
      
      return true
    })
  }, [selectedElement, selectedSpin, searchQuery])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* HEADER */}
      <header className="border-b border-purple-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-3 text-purple-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/xps" className="hover:text-purple-300">XPS</Link>
            <span className="text-purple-600">›</span>
            <span className="text-purple-300">Birikmalar</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-stone-400 flex items-center gap-3">
                <span className="text-3xl">🔬</span>
                XPS birikmalar tahlili
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                12 ta kompleks • Bog'lanish energiyasi • Kimyoviy siljish • Spin-orbital ajralish
              </p>
            </div>
            <Link 
              href="/ilmiy/tahlil/xps"
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-700/50"
            >
              ← XPS spektroskopiya
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* STATISTIKA */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-stone-400">{stats.total}</div>
            <div className="text-xs text-purple-400">Jami birikma</div>
          </div>
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">⚛️</div>
            <div className="text-2xl font-bold text-blue-400">{stats.metals}</div>
            <div className="text-xs text-purple-400">Metallar</div>
          </div>
          <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🔽</div>
            <div className="text-2xl font-bold text-green-400">{stats.lsCount}</div>
            <div className="text-xs text-purple-400">Past spin (LS)</div>
          </div>
          <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🔼</div>
            <div className="text-2xl font-bold text-red-400">{stats.hsCount}</div>
            <div className="text-xs text-purple-400">Yuqori spin (HS)</div>
          </div>
          <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🔬</div>
            <div className="text-2xl font-bold text-amber-400">{stats.d9d10Count}</div>
            <div className="text-xs text-purple-400">d⁹/d¹⁰</div>
          </div>
        </div>

        {/* FILTER VA QIDIRUV */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Formula, nom yoki metal bo'yicha qidirish..."
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
            {/* Metal filter */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-purple-400 font-semibold">Metal:</span>
              {metals.map(metal => (
                <button
                  key={metal}
                  onClick={() => setSelectedElement(metal)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedElement === metal
                      ? "bg-stone-600 text-white"
                      : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                  }`}
                >
                  {metal === "all" ? "Hammasi" : metal}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Spin filter */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-purple-400 font-semibold">Spin state:</span>
              {spinStates.map(spin => (
                <button
                  key={spin.id}
                  onClick={() => setSelectedSpin(spin.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedSpin === spin.id
                      ? "bg-stone-600 text-white"
                      : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                  }`}
                >
                  {spin.label}
                </button>
              ))}
            </div>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-purple-700/30">
            <div className="text-xs text-purple-400">
              Topildi: <span className="text-white font-semibold">{filtered.length}</span> ta birikma
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "grid"
                    ? "bg-stone-600 text-white"
                    : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                📱 Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "table"
                    ? "bg-stone-600 text-white"
                    : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                📊 Jadval
              </button>
            </div>
          </div>
        </div>

        {/* NATIJALAR YO'Q */}
        {filtered.length === 0 && (
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-white mb-2">Hech narsa topilmadi</h3>
            <p className="text-purple-400 text-sm mb-4">
              Qidiruv so'zini yoki filtrlarni o'zgartirib ko'ring
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedElement("all")
                setSelectedSpin("all")
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-colors"
            >
              Filtrlarni tozalash
            </button>
          </div>
        )}

        {/* GRID VIEW */}
        {viewMode === "grid" && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((b) => {
              const colors = rangMap[b.rang]
              const spectrum = generateSpectrum(b)
              const maxIntensity = Math.max(...spectrum.map(p => p.intensity))
              
              return (
                <Link
                  key={b.id}
                  href={`/ilmiy/tahlil/xps/birikmalar/${b.id}`}
                  className={`group ${colors.bg} border ${colors.border} rounded-2xl p-6 hover:scale-[1.02] transition-all`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className={`text-xl font-bold ${colors.text} mb-1`}>
                        {b.formula}
                      </h3>
                      <p className="text-purple-400 text-xs">{b.iupac}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono text-yellow-400">
                        {b.be} eV
                      </div>
                      <div className="text-xs text-purple-400">BE</div>
                    </div>
                  </div>

                  {/* XPS Spektr Mini */}
                  <div className="bg-purple-950/50 rounded-xl p-3 mb-4">
                    <svg viewBox="0 0 300 100" className="w-full h-24">
                      <polyline
                        points={spectrum.map((p, idx) => {
                          const x = (idx / 150) * 300
                          const y = 95 - (p.intensity / maxIntensity) * 85
                          return `${x},${y}`
                        }).join(' ')}
                        fill="none"
                        stroke={colors.hex}
                        strokeWidth="2"
                      />
                      <polygon
                        points={
                          `0,95 ` +
                          spectrum.map((p, idx) => {
                            const x = (idx / 150) * 300
                            const y = 95 - (p.intensity / maxIntensity) * 85
                            return `${x},${y}`
                          }).join(' ') +
                          ` 300,95`
                        }
                        fill={colors.hex}
                        opacity="0.2"
                      />
                    </svg>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="bg-purple-900/50 rounded-lg p-2">
                      <p className="text-purple-400 text-[10px]">Metal</p>
                      <p className={`${colors.text} font-bold`}>{b.metal}</p>
                    </div>
                    <div className="bg-purple-900/50 rounded-lg p-2">
                      <p className="text-purple-400 text-[10px]">Config</p>
                      <p className="text-white font-mono">{b.config}</p>
                    </div>
                    <div className="bg-purple-900/50 rounded-lg p-2">
                      <p className="text-purple-400 text-[10px]">Splitting</p>
                      <p className="text-white font-mono">{b.splitting} eV</p>
                    </div>
                    <div className="bg-purple-900/50 rounded-lg p-2">
                      <p className="text-purple-400 text-[10px]">Satellit</p>
                      <p className="text-white text-[10px]">{b.satellite}</p>
                    </div>
                  </div>

                  {/* Izoh */}
                  <p className="text-purple-300 text-xs leading-relaxed">
                    {b.izoh}
                  </p>
                </Link>
              )
            })}
          </div>
        )}

        {/* TABLE VIEW */}
        {viewMode === "table" && filtered.length > 0 && (
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-left text-purple-300">Formula</th>
                  <th className="py-3 px-4 text-left text-purple-300">Metal</th>
                  <th className="py-3 px-4 text-center text-purple-300">Config</th>
                  <th className="py-3 px-4 text-center text-purple-300">Orbital</th>
                  <th className="py-3 px-4 text-center text-purple-300">BE (eV)</th>
                  <th className="py-3 px-4 text-center text-purple-300">Splitting</th>
                  <th className="py-3 px-4 text-center text-purple-300">Satellit</th>
                  <th className="py-3 px-4 text-center text-purple-300">Tur</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {filtered.map((b, i) => {
                  const colors = rangMap[b.rang]
                  return (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4">
                        <Link 
                          href={`/ilmiy/tahlil/xps/birikmalar/${b.id}`}
                          className={`${colors.text} font-bold hover:underline`}
                        >
                          {b.formula}
                        </Link>
                      </td>
                      <td className="py-3 px-4">{b.metal}</td>
                      <td className="py-3 px-4 text-center font-mono">{b.config}</td>
                      <td className="py-3 px-4 text-center font-mono text-xs">{b.orbital}</td>
                      <td className="py-3 px-4 text-center font-mono text-yellow-400 font-bold">
                        {b.be}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">{b.splitting}</td>
                      <td className="py-3 px-4 text-center text-xs">{b.satellite}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`${colors.text} text-xs font-semibold`}>
                          {b.type}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* QO'SHIMCHA MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> XPS tahlil parametrlari
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-200">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <h4 className="text-stone-400 font-bold mb-2">Bog'lanish energiyasi (BE)</h4>
              <p className="text-xs leading-relaxed">
                Elektronning yadro bilan bog'lanish kuchi. Oksidlanish darajasi oshgan sari BE ortadi.
                Masalan: Fe²⁺ (710 eV) → Fe³⁺ (711.5 eV).
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <h4 className="text-stone-400 font-bold mb-2">Spin-orbital ajralish</h4>
              <p className="text-xs leading-relaxed">
                p, d, f orbitallar ikkita komponentga ajraladi (j=1/2, j=3/2).
                Fe 2p: 13.1 eV, Cu 2p: 19.75 eV, Pt 4f: 3.33 eV.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <h4 className="text-stone-400 font-bold mb-2">Satellit strukturalar</h4>
              <p className="text-xs leading-relaxed">
                Shake-up satellitlar oksidlanish darajasini aniqlashda yordam beradi.
                Cu²⁺: 940-945 eV, Fe³⁺: 719 eV.
              </p>
            </div>
          </div>
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