"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════
// XPS MA'LUMOTLAR BAZASI
// ═══════════════════════════════════════════════════════════
const xpsDatabase = [
  {
    element: "Fe",
    orbital: "2p₃/₂",
    holat: "Fe⁰ (metall)",
    be: 706.7,
    splitting: 13.1,
    satellite: "Yo'q",
    rang: "red",
    tip: "Metall"
  },
  {
    element: "Fe",
    orbital: "2p₃/₂",
    holat: "Fe²⁺ (HS)",
    be: 710.0,
    splitting: 13.1,
    satellite: "Shake-up ~715 eV",
    rang: "orange",
    tip: "Ion HS"
  },
  {
    element: "Fe",
    orbital: "2p₃/₂",
    holat: "Fe³⁺ (HS)",
    be: 711.5,
    splitting: 13.1,
    satellite: "Shake-up ~719 eV",
    rang: "red",
    tip: "Ion HS"
  },
  {
    element: "Fe",
    orbital: "2p₃/₂",
    holat: "[Fe(CN)₆]⁴⁻ (LS)",
    be: 708.2,
    splitting: 13.1,
    satellite: "Kuchsiz",
    rang: "yellow",
    tip: "Kompleks LS"
  },
  {
    element: "Fe",
    orbital: "2p₃/₂",
    holat: "[Fe(CN)₆]³⁻ (LS)",
    be: 709.8,
    splitting: 13.1,
    satellite: "Kuchsiz",
    rang: "yellow",
    tip: "Kompleks LS"
  },
  {
    element: "Cu",
    orbital: "2p₃/₂",
    holat: "Cu⁰ / Cu⁺ (d¹⁰)",
    be: 932.6,
    splitting: 19.75,
    satellite: "Yo'q",
    rang: "orange",
    tip: "d¹⁰"
  },
  {
    element: "Cu",
    orbital: "2p₃/₂",
    holat: "Cu²⁺ (d⁹)",
    be: 934.0,
    splitting: 19.75,
    satellite: "Kuchli shake-up 940-945 eV",
    rang: "blue",
    tip: "d⁹"
  },
  {
    element: "Co",
    orbital: "2p₃/₂",
    holat: "Co²⁺ (HS)",
    be: 781.0,
    splitting: 15.0,
    satellite: "Kuchli shake-up ~786 eV",
    rang: "pink",
    tip: "Ion HS"
  },
  {
    element: "Co",
    orbital: "2p₃/₂",
    holat: "Co³⁺ (LS)",
    be: 779.8,
    splitting: 15.0,
    satellite: "Kuchsiz",
    rang: "pink",
    tip: "Kompleks LS"
  },
  {
    element: "Pt",
    orbital: "4f₇/₂",
    holat: "Pt⁰ (metall)",
    be: 71.2,
    splitting: 3.33,
    satellite: "Yo'q",
    rang: "gray",
    tip: "Metall"
  },
  {
    element: "Pt",
    orbital: "4f₇/₂",
    holat: "Pt²⁺ (sisplatin)",
    be: 72.8,
    splitting: 3.33,
    satellite: "Yo'q",
    rang: "gray",
    tip: "Kompleks"
  },
  {
    element: "N",
    orbital: "1s",
    holat: "CN⁻ ligand",
    be: 398.0,
    splitting: 0,
    satellite: "Yo'q",
    rang: "blue",
    tip: "Ligand"
  },
  {
    element: "N",
    orbital: "1s",
    holat: "NH₃ ligand",
    be: 399.5,
    splitting: 0,
    satellite: "Yo'q",
    rang: "blue",
    tip: "Ligand"
  },
  {
    element: "Cl",
    orbital: "2p₃/₂",
    holat: "Cl⁻ (ion)",
    be: 198.5,
    splitting: 1.6,
    satellite: "Yo'q",
    rang: "green",
    tip: "Ion"
  },
  {
    element: "Ni",
    orbital: "2p₃/₂",
    holat: "Ni⁰ (Ni(CO)₄)",
    be: 852.8,
    splitting: 17.3,
    satellite: "Yo'q",
    rang: "gray",
    tip: "Metall"
  }
]

// Rang xaritasi
const rangMap = {
  red: { text: "text-red-400", bg: "bg-red-600/10", border: "border-red-500/30", hex: "#ef4444" },
  orange: { text: "text-orange-400", bg: "bg-orange-600/10", border: "border-orange-500/30", hex: "#f97316" },
  yellow: { text: "text-yellow-400", bg: "bg-yellow-600/10", border: "border-yellow-500/30", hex: "#eab308" },
  green: { text: "text-green-400", bg: "bg-green-600/10", border: "border-green-500/30", hex: "#10b981" },
  blue: { text: "text-blue-400", bg: "bg-blue-600/10", border: "border-blue-500/30", hex: "#3b82f6" },
  pink: { text: "text-pink-400", bg: "bg-pink-600/10", border: "border-pink-500/30", hex: "#ec4899" },
  gray: { text: "text-gray-400", bg: "bg-gray-600/10", border: "border-gray-500/30", hex: "#9ca3af" }
}

export default function XPSSpektroskopiya() {
  const [selectedElement, setSelectedElement] = useState("all")
  const [selectedOrbital, setSelectedOrbital] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Statistika
  const stats = useMemo(() => ({
    total: xpsDatabase.length,
    elements: [...new Set(xpsDatabase.map(x => x.element))].length,
    orbitals: [...new Set(xpsDatabase.map(x => x.orbital))].length,
    tips: [...new Set(xpsDatabase.map(x => x.tip))].length
  }), [])

  // Elementlar ro'yxati
  const elements = useMemo(() => 
    ["all", ...new Set(xpsDatabase.map(x => x.element))], 
    []
  )

  // Orbitallar ro'yxati
  const orbitals = useMemo(() => 
    ["all", ...new Set(xpsDatabase.map(x => x.orbital))], 
    []
  )

  // Filterlangan ma'lumotlar
  const filtered = useMemo(() => {
    return xpsDatabase.filter(x => {
      if (selectedElement !== "all" && x.element !== selectedElement) return false
      if (selectedOrbital !== "all" && x.orbital !== selectedOrbital) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          x.holat.toLowerCase().includes(q) ||
          x.tip.toLowerCase().includes(q) ||
          x.satellite.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [selectedElement, selectedOrbital, searchQuery])

  // ═══════════════════════════════════════════════════════════
  // XPS SPEKTR GENERATORI
  // ═══════════════════════════════════════════════════════════
  const generateSpectrum = (entry) => {
    const points = []
    const minE = entry.be - 10
    const maxE = entry.be + 15
    const steps = 200
    
    for (let i = 0; i <= steps; i++) {
      const e = minE + (i / steps) * (maxE - minE)
      
      // Asosiy pik (Voigt profili soddalashtirilgan)
      const x = (e - entry.be) / 1.5
      let intensity = Math.exp(-0.5 * x * x)
      
      // Spin-orbital dublet (p, d, f uchun)
      if (entry.splitting > 0) {
        const x2 = (e - (entry.be + entry.splitting)) / 1.5
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
          intensity += 0.3 * Math.exp(-0.5 * xs * xs)
        }
      }
      
      // Asimmetrik tail (metall uchun)
      if (entry.tip === "Metall" && e > entry.be) {
        intensity += 0.1 * Math.exp(-(e - entry.be) / 5)
      }
      
      points.push({ e, intensity })
    }
    
    return points
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* HEADER */}
      <header className="border-b border-purple-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-3 text-purple-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil</Link>
            <span className="text-purple-600">›</span>
            <span className="text-purple-300">XPS</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-stone-400 flex items-center gap-3">
                <span className="text-3xl">🔬</span>
                XPS spektroskopiya
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Rentgen fotoelektron spektroskopiya • Oksidlanish darajasi • Sirt tarkibi
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-stone-400">{stats.total}</div>
            <div className="text-xs text-purple-400">Ma'lumotlar</div>
          </div>
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">⚛️</div>
            <div className="text-2xl font-bold text-blue-400">{stats.elements}</div>
            <div className="text-xs text-purple-400">Elementlar</div>
          </div>
          <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🔬</div>
            <div className="text-2xl font-bold text-amber-400">{stats.orbitals}</div>
            <div className="text-xs text-purple-400">Orbitallar</div>
          </div>
          <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-2xl font-bold text-green-400">{stats.tips}</div>
            <div className="text-xs text-purple-400">Turlar</div>
          </div>
        </div>

        {/* BIRIKMALAR KARTASI */}
        <Link 
          href="/ilmiy/tahlil/xps/birikmalar"
          className="group block bg-gradient-to-r from-stone-900/40 to-purple-900/40 border border-stone-700/50 rounded-2xl p-6 hover:bg-stone-900/60 hover:border-stone-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🔬</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-stone-400 group-hover:text-stone-300 transition-colors">
                Birikmalarning XPS spektroskopik tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Kompleks birikmalarning XPS spektrlari. Bog'lanish energiyasi, kimyoviy siljish,
                spin-orbital ajralish, satellit strukturalar har bir birikma uchun batafsil.
              </p>
            </div>
            <div className="text-3xl text-stone-400 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-stone-600/20 text-stone-400 border border-stone-600/30 px-3 py-1 rounded-full text-xs">
              12 ta birikma
            </span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">
              Bog'lanish energiyasi
            </span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">
              Kimyoviy siljish
            </span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">
              Oksidlanish darajasi
            </span>
          </div>
        </Link>

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📋</span> XPS spektroskopiya haqida
          </h2>
          
          <div className="bg-stone-600/10 border border-stone-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed text-sm">
              <strong className="text-stone-400">Rentgen fotoelektron spektroskopiya (XPS)</strong> — 
              qattiq jism sirtining element tarkibi, kimyoviy holati va elektron strukturasini
              aniqlashda qo'llaniladigan yuqori sezgir sirt tahlil usuli.
              Tahlil chuqurligi atigi <strong className="text-stone-400">1−10 nm</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-stone-400 font-bold mb-3">Nimani aniqlaydi?</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span><strong>Bog'lanish energiyasi (BE)</strong> — elektronning yadro bilan bog'lanish kuchi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span><strong>Kimyoviy siljish</strong> — oksidlanish darajasi ta'siri</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span><strong>Spin-orbital ajralish</strong> — p, d, f orbitallar uchun</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span><strong>Satellitlar</strong> — shake-up, shake-off, multiplet</span>
                </li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-stone-400 font-bold mb-3">Qanday ishlaydi?</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Yuqori vakuumda (<strong>10⁻⁹ mbar</strong>)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Al Kα (<strong>1486.6 eV</strong>) nurlari bilan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span><strong>E<sub>b</sub> = hν − E<sub>k</sub> − Φ</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Tahlil chuqurligi: <strong>1−10 nm</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FILTER VA QIDIRUV */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Holat, tur yoki satellit bo'yicha qidirish..."
              className="w-full px-5 py-3 bg-purple-950/60 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-stone-400 transition-colors"
              aria-label="XPS ma'lumotlarini qidirish"
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
            {/* Element filter */}
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
            {/* Orbital filter */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-purple-400 font-semibold">Orbital:</span>
              {orbitals.map(orb => (
                <button
                  key={orb}
                  onClick={() => setSelectedOrbital(orb)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedOrbital === orb
                      ? "bg-stone-600 text-white"
                      : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                  }`}
                >
                  {orb === "all" ? "Hammasi" : orb}
                </button>
              ))}
            </div>
          </div>

          {(searchQuery || selectedElement !== "all" || selectedOrbital !== "all") && (
            <div className="text-xs text-purple-400 pt-2 border-t border-purple-700/30">
              Topildi: <span className="text-white font-semibold">{filtered.length}</span> ta ma'lumot
            </div>
          )}
        </div>

        {/* NATIJALAR — XPS SPEKTR BILAN */}
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
              const spectrum = generateSpectrum(entry)
              const maxIntensity = Math.max(...spectrum.map(p => p.intensity))
              
              return (
                <div key={i} className={`${colors.bg} border ${colors.border} rounded-2xl p-6`}>
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <h3 className={`text-xl font-bold ${colors.text}`}>
                        {entry.element} {entry.orbital} — {entry.holat}
                      </h3>
                      <p className="text-purple-400 text-xs mt-1">
                        {entry.tip} • Spin-orbital: {entry.splitting} eV
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono text-yellow-400">
                        {entry.be} eV
                      </div>
                      <div className="text-xs text-purple-400">Bog'lanish energiyasi</div>
                    </div>
                  </div>

                  {/* XPS Spektr */}
                  <div className="bg-purple-950/50 rounded-xl p-4 mb-4">
                    <svg viewBox="0 0 400 150" className="w-full h-36">
                      {/* Grid */}
                      <line x1="40" y1="120" x2="380" y2="120" stroke="#4c1d95" strokeWidth="1" />
                      <line x1="40" y1="20" x2="40" y2="120" stroke="#4c1d95" strokeWidth="1" />
                      
                      <text x="210" y="140" fill="#c4b5fd" fontSize="9" textAnchor="middle">
                        Bog'lanish energiyasi (eV)
                      </text>
                      <text x="20" y="70" fill="#c4b5fd" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 70)">
                        Intensivlik
                      </text>

                      {/* Spektr chizig'i */}
                      <polyline
                        points={spectrum.map((p, idx) => {
                          const x = 40 + (idx / 200) * 340
                          const y = 120 - (p.intensity / maxIntensity) * 95
                          return `${x},${y}`
                        }).join(' ')}
                        fill="none"
                        stroke={colors.hex}
                        strokeWidth="2"
                      />

                      {/* Fill under curve */}
                      <polygon
                        points={
                          `40,120 ` +
                          spectrum.map((p, idx) => {
                            const x = 40 + (idx / 200) * 340
                            const y = 120 - (p.intensity / maxIntensity) * 95
                            return `${x},${y}`
                          }).join(' ') +
                          ` 380,120`
                        }
                        fill={colors.hex}
                        opacity="0.2"
                      />

                      {/* BE marker */}
                      <line
                        x1={40 + ((entry.be - (entry.be - 10)) / 25) * 340}
                        y1="20"
                        x2={40 + ((entry.be - (entry.be - 10)) / 25) * 340}
                        y2="120"
                        stroke="#fbbf24"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                      />
                      <text
                        x={40 + ((entry.be - (entry.be - 10)) / 25) * 340}
                        y="15"
                        fill="#fbbf24"
                        fontSize="8"
                        textAnchor="middle"
                      >
                        {entry.be} eV
                      </text>
                    </svg>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="bg-purple-900/50 rounded-lg p-3">
                      <p className="text-purple-400 mb-1">BE</p>
                      <p className="text-white font-bold font-mono">{entry.be} eV</p>
                    </div>
                    <div className="bg-purple-900/50 rounded-lg p-3">
                      <p className="text-purple-400 mb-1">Splitting</p>
                      <p className="text-white font-bold font-mono">
                        {entry.splitting > 0 ? `${entry.splitting} eV` : "—"}
                      </p>
                    </div>
                    <div className="bg-purple-900/50 rounded-lg p-3">
                      <p className="text-purple-400 mb-1">Tur</p>
                      <p className={`${colors.text} font-bold`}>{entry.tip}</p>
                    </div>
                    <div className="bg-purple-900/50 rounded-lg p-3">
                      <p className="text-purple-400 mb-1">Satellit</p>
                      <p className="text-white text-[10px]">{entry.satellite}</p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* SPIN-ORBITAL AJRALISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🔬</span> Spin-orbital ajralish
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                orbital: "p-orbital",
                splitting: "j=1/2, j=3/2",
                ratio: "2:1",
                deltaE: "~13-20 eV",
                example: "Fe 2p: 13.1 eV, Cu 2p: 19.75 eV"
              },
              {
                orbital: "d-orbital",
                splitting: "j=3/2, j=5/2",
                ratio: "3:2",
                deltaE: "~5-20 eV",
                example: "Pd 3d: 5.3 eV, Pt 4d: 20.3 eV"
              },
              {
                orbital: "f-orbital",
                splitting: "j=5/2, j=7/2",
                ratio: "4:3",
                deltaE: "~3-4 eV",
                example: "Pt 4f: 3.33 eV, Au 4f: 3.67 eV"
              }
            ].map((r, i) => (
              <div key={i} className="bg-stone-600/10 border border-stone-500/30 rounded-xl p-5">
                <h3 className="text-stone-400 font-bold mb-3">{r.orbital}</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-purple-400">Splitting:</span>
                    <span className="text-yellow-400 font-mono">{r.splitting}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Nisbat:</span>
                    <span className="text-green-400 font-mono">{r.ratio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">ΔE:</span>
                    <span className="text-blue-400 font-mono">{r.deltaE}</span>
                  </div>
                  <div className="pt-2 border-t border-purple-700/30">
                    <p className="text-purple-500 text-[10px]">{r.example}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SATELLIT STRUKTURALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📡</span> Satellit strukturalar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2 text-sm">Cu²⁺ (d⁹) — kuchli shake-up</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                Cu²⁺ (d⁹) — 2p spektrida asosiy pikdan <strong>~9 eV yuqorida</strong> kuchli shake-up
                satellitlar. Cu⁺ (d¹⁰) da satellit yo'q → <strong>Cu⁺/Cu²⁺ aniq farqlanadi</strong>.
              </p>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-2 text-sm">Fe²⁺/Fe³⁺ — multiplet</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                Fe²⁺ (HS, d⁶) — ~715 eV da shake-up. Fe³⁺ (HS, d⁵) — ~719 eV da satellit.
                Past spinli (LS) komplekslarda satellit <strong>ancha kuchsiz</strong>.
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
            <li>XPS — <strong className="text-stone-400">sirt qatlami (1−10 nm)</strong> elementlar kimyoviy holatini aniqlash</li>
            <li>Kimyoviy siljish — <strong className="text-stone-400">oksidlanish darajasi oshgan sari BE ortadi</strong></li>
            <li>Spin-orbital dubletlar — <strong>piklarni identifikatsiya qilish</strong> diagnostik belgi</li>
            <li>Shake-up satellitlar — <strong>Cu²⁺/Cu⁺ va Fe²⁺/Fe³⁺ aniq farqlash</strong></li>
            <li>Geterogen katalizatorlar uchun <strong>birlamchi tahlil usuli</strong></li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link 
            href="/ilmiy/tahlil/titrlash" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Spektrofotometrik titrlash
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