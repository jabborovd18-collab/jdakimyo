"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════
// XPS MA'LUMOTLAR BAZASI — [Co(H₂O)₆]²⁺
// ═══════════════════════════════════════════════════════════
const xpsPeaks = {
  "Co 2p": [
    { orbital: "Co 2p₃/₂", be: 781.0, intensity: 1.0, fwhm: 2.2, assign: "Co²⁺ (HS d⁷)" },
    { orbital: "Co 2p₁/₂", be: 796.0, intensity: 0.5, fwhm: 2.2, assign: "SO split (Δ=15.0 eV)" },
    { orbital: "Satellite S1", be: 786.5, intensity: 0.50, fwhm: 3.0, assign: "Shake-up (HS diagnostik)" },
    { orbital: "Satellite S2", be: 789.5, intensity: 0.25, fwhm: 2.5, assign: "Shake-up (qo'shimcha)" }
  ],
  "O 1s": [
    { orbital: "O 1s (H₂O)", be: 532.5, intensity: 1.0, fwhm: 1.6, assign: "Koordinatsion H₂O" },
    { orbital: "O 1s (OH)", be: 531.3, intensity: 0.3, fwhm: 1.4, assign: "Sirt OH guruhi" }
  ],
  "Cl 2p": [
    { orbital: "Cl 2p₃/₂", be: 198.3, intensity: 1.0, fwhm: 1.2, assign: "Cl⁻ counterion" },
    { orbital: "Cl 2p₁/₂", be: 199.9, intensity: 0.5, fwhm: 1.2, assign: "SO split (Δ=1.6 eV)" }
  ]
}

const surveyData = [
  { element: "Co", orbital: "2p₃/₂", be: 781.0, atomic_percent: 6.3, color: "#ec4899", desc: "Markaziy metal (Co²⁺)" },
  { element: "O", orbital: "1s", be: 532.5, atomic_percent: 37.5, color: "#f59e0b", desc: "Ligand H₂O" },
  { element: "Cl", orbital: "2p₃/₂", be: 198.3, atomic_percent: 12.5, color: "#10b981", desc: "Counterion Cl⁻" },
  { element: "C", orbital: "1s", be: 285.0, atomic_percent: 31.2, color: "#6b7280", desc: "Sirt iflosligi" },
  { element: "N", orbital: "1s", be: 400.0, atomic_percent: 12.5, color: "#3b82f6", desc: "Atmosfera N₂" }
]

export default function CoH2O6_2() {
  const [selectedRegion, setSelectedRegion] = useState("Co 2p")
  const [showSatellites, setShowSatellites] = useState(true)
  const [showSurvey, setShowSurvey] = useState(false)
  const [compareMode, setCompareMode] = useState("none") // none, co3ls, co2oh

  // ═══════════════════════════════════════════════════════════
  // SPEKTR GENERATORI
  // ═══════════════════════════════════════════════════════════
  const generateSpectrum = (region, refMode) => {
    const points = []
    const peaks = xpsPeaks[region]
    if (!peaks) return []

    const minBE = Math.min(...peaks.map(p => p.be)) - 10
    const maxBE = Math.max(...peaks.map(p => p.be)) + 18
    const steps = 250

    for (let i = 0; i <= steps; i++) {
      const be = minBE + (i / steps) * (maxBE - minBE)
      let intensity = 0

      peaks.forEach(peak => {
        if (peak.assign.includes("Shake-up") && !showSatellites) return
        const x = (be - peak.be) / peak.fwhm
        intensity += peak.intensity * Math.exp(-0.5 * x * x)
      })

      // Solishtirish rejimlari
      if (refMode === "co3ls" && region === "Co 2p") {
        // [Co(NH₃)₆]³⁺ LS — satellite deyarli yo'q
        const x1 = (be - 779.8) / 1.6
        intensity += 0.95 * Math.exp(-0.5 * x1 * x1)
        const x2 = (be - 794.8) / 1.6
        intensity += 0.47 * Math.exp(-0.5 * x2 * x2)
        // Juda kuchsiz satellite
        if (showSatellites) {
          const xs = (be - 786.0) / 2.5
          intensity += 0.08 * Math.exp(-0.5 * xs * xs)
        }
      } else if (refMode === "co2oh" && region === "Co 2p") {
        // Co(OH)₂ — boshqa satellite strukturasi
        const x1 = (be - 780.5) / 2.0
        intensity += 0.85 * Math.exp(-0.5 * x1 * x1)
        const x2 = (be - 795.5) / 2.0
        intensity += 0.42 * Math.exp(-0.5 * x2 * x2)
        const xs = (be - 786.0) / 2.8
        intensity += 0.40 * Math.exp(-0.5 * xs * xs)
      }

      // Multiplet broadening (HS Co²⁺ uchun)
      if (region === "Co 2p") {
        const xm = (be - 780.0) / 3.5
        intensity += 0.08 * Math.exp(-0.5 * xm * xm)
      }

      // Fon
      const bg = 0.06 * (maxBE - be) / (maxBE - minBE)
      intensity += bg

      points.push({ be, intensity })
    }
    return points
  }

  const spectrum = useMemo(() =>
    generateSpectrum(selectedRegion, compareMode),
    [selectedRegion, compareMode, showSatellites]
  )

  const maxIntensity = Math.max(...spectrum.map(p => p.intensity), 0.01)

  // ═══════════════════════════════════════════════════════════
  // SURVEY SPEKTRI
  // ═══════════════════════════════════════════════════════════
  const generateSurveySpectrum = () => {
    const points = []
    const allPeaks = [
      { be: 781.0, intensity: 1.0, label: "Co 2p", color: "#ec4899" },
      { be: 532.5, intensity: 1.4, label: "O 1s", color: "#f59e0b" },
      { be: 400.0, intensity: 0.4, label: "N 1s", color: "#3b82f6" },
      { be: 285.0, intensity: 1.1, label: "C 1s", color: "#6b7280" },
      { be: 198.3, intensity: 0.6, label: "Cl 2p", color: "#10b981" }
    ]
    for (let i = 0; i <= 250; i++) {
      const be = 100 + (i / 250) * 800
      let intensity = 0.04 * (900 - be) / 800
      allPeaks.forEach(peak => {
        const x = (be - peak.be) / 4
        intensity += peak.intensity * Math.exp(-0.5 * x * x)
      })
      points.push({ be, intensity })
    }
    return points
  }

  const surveySpectrum = useMemo(() => generateSurveySpectrum(), [])
  const maxSurvey = Math.max(...surveySpectrum.map(p => p.intensity), 0.01)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      {/* ═════ HEADER ═════ */}
      <header className="border-b border-purple-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm mb-3 text-purple-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/xps" className="hover:text-purple-300">XPS</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/xps/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
            <span className="text-purple-600">›</span>
            <span className="text-rose-400 font-semibold">[Co(H₂O)₆]²⁺</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-rose-400 flex items-center gap-3">
                <span className="text-3xl">🔬</span>
                <span>[Co(H₂O)₆]²⁺</span>
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Geksaakvakobalt(II) • Co²⁺ (d⁷ HS) • Paramagnit • Pushti rang
              </p>
            </div>
            <Link
              href="/ilmiy/tahlil/xps/birikmalar"
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-700/50 transition-colors"
            >
              ← Birikmalar
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ═════ STATISTIKA ═════ */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Metal</div>
            <div className="text-xl font-bold text-rose-400">Co²⁺</div>
            <div className="text-[10px] text-purple-400">d⁷ (HS)</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Geometriya</div>
            <div className="text-xl font-bold text-blue-400">Oₕ</div>
            <div className="text-[10px] text-purple-400">Oktaedrik</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Co 2p₃/₂ BE</div>
            <div className="text-xl font-bold text-rose-400 font-mono">781.0</div>
            <div className="text-[10px] text-purple-400">eV</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Spin</div>
            <div className="text-xl font-bold text-red-400">S=3/2</div>
            <div className="text-[10px] text-purple-400">3 toq e⁻</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">μ<sub>eff</sub></div>
            <div className="text-xl font-bold text-yellow-400 font-mono">~4.87</div>
            <div className="text-[10px] text-purple-400">BM</div>
          </div>
        </div>

        {/* ═════ ASOSIY MA'LUMOT ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Asosiy ma'lumotlar
          </h2>

          <div className="bg-rose-600/10 border border-rose-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed text-sm">
              <strong className="text-rose-400">[Co(H₂O)₆]²⁺</strong> (geksaakvakobalt(II) ioni) —
              suv eritmasida Co²⁺ ning asosiy shakli. Oltita H₂O ligand oktaedrik kompleks hosil qiladi.
              H₂O — <strong>kuchsiz maydon ligandi</strong> → Co²⁺ (d⁷) <strong className="text-rose-400">yuqori spin (HS)</strong>
              holatda qoladi: <strong className="text-rose-400">t₂g⁵ e<sub>g</sub>²</strong>.
              <strong> 3 ta toq elektron</strong> → kuchli paramagnit (S = 3/2).
              XPS da <strong>kuchli shake-up satellitlar (~786-790 eV)</strong> bilan ajralib turadi —
              bu HS Co²⁺ ning eng muhim diagnostik belgisi. [Co(NH₃)₆]³⁺ (LS) dan keskin farq qiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-rose-400 font-bold mb-3">🧪 Kimyoviy xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Molekulyar massa:</span>
                  <span className="font-mono">129.04 g/mol (ion)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Ligand:</span>
                  <span>6 × H₂O</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Koordinatsion son:</span>
                  <span className="font-bold">6 (oktaedrik)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Oksidlanish darajasi:</span>
                  <span className="font-bold text-rose-400">+2</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-pink-300">Pushti</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Barqarorlik:</span>
                  <span>log β₆ ≈ 9.7</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Kinetik:</span>
                  <span className="text-orange-400 font-bold">Labill</span>
                </li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-rose-400 font-bold mb-3">⚛️ Elektron struktura</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Konfiguratsiya:</span>
                  <span className="font-mono">d⁷ (t₂g⁵ e<sub>g</sub>²)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Spin holat:</span>
                  <span className="text-red-400 font-bold">Yuqori spin (HS)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Umumiy spin:</span>
                  <span className="font-mono">S = 3/2</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Toq elektronlar:</span>
                  <span className="font-mono text-red-400 font-bold">3 ta</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">μ<sub>eff</sub>:</span>
                  <span className="font-mono">~4.87 BM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Δ<sub>o</sub>:</span>
                  <span className="font-mono">~9,300 cm⁻¹</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">CFSE:</span>
                  <span className="font-mono">-0.8 Δ<sub>o</sub></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ═════ XPS SPEKTR SIMULYATORI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📊</span> XPS spektr simulyatori
          </h2>

          {/* Region selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {Object.keys(xpsPeaks).map(region => (
              <button key={region} onClick={() => setSelectedRegion(region)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedRegion === region ? "bg-rose-600 text-white shadow-lg" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}>{region}</button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 mb-4">
            {selectedRegion === "Co 2p" && (
              <>
                <label className="flex items-center gap-2 cursor-pointer bg-purple-800/30 px-3 py-2 rounded-lg border border-purple-700/30">
                  <input type="checkbox" checked={showSatellites} onChange={(e) => setShowSatellites(e.target.checked)} className="accent-rose-500" />
                  <span className="text-xs text-purple-300">Shake-up satellitlar (786-790 eV)</span>
                </label>
                <div className="flex gap-1">
                  <button onClick={() => setCompareMode("none")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "none" ? "bg-rose-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                    Yolg'iz
                  </button>
                  <button onClick={() => setCompareMode("co3ls")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "co3ls" ? "bg-pink-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                    vs [Co(NH₃)₆]³⁺ LS
                  </button>
                  <button onClick={() => setCompareMode("co2oh")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "co2oh" ? "bg-teal-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                    vs Co(OH)₂
                  </button>
                </div>
              </>
            )}
            <label className="flex items-center gap-2 cursor-pointer bg-purple-800/30 px-3 py-2 rounded-lg border border-purple-700/30">
              <input type="checkbox" checked={showSurvey} onChange={(e) => setShowSurvey(e.target.checked)} className="accent-rose-500" />
              <span className="text-xs text-purple-300">Survey spektr</span>
            </label>
          </div>

          {/* Spektr */}
          <div className="bg-purple-950/50 rounded-xl p-4">
            {!showSurvey ? (
              <svg viewBox="0 0 600 300" className="w-full h-72">
                <line x1="60" y1="250" x2="580" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <line x1="60" y1="30" x2="60" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <text x="320" y="285" fill="#c4b5fd" fontSize="11" textAnchor="middle">Bog'lanish energiyasi (eV) →</text>
                <text x="25" y="140" fill="#c4b5fd" fontSize="10" textAnchor="middle" transform="rotate(-90, 25, 140)">Intensivlik</text>

                {/* X-axis ticks */}
                {(() => {
                  const peaks = xpsPeaks[selectedRegion]?.filter(p => !p.assign.includes("Shake-up") || showSatellites)
                  if (!peaks || peaks.length === 0) return null
                  const minBE = Math.min(...peaks.map(p => p.be)) - 10
                  const maxBE = Math.max(...peaks.map(p => p.be)) + 18
                  const ticks = []
                  for (let be = Math.ceil(minBE / 5) * 5; be <= maxBE; be += 5) {
                    const x = 60 + ((be - minBE) / (maxBE - minBE)) * 520
                    ticks.push(<g key={be}><line x1={x} y1="250" x2={x} y2="255" stroke="#6b7280" strokeWidth="1" /><text x={x} y="268" fill="#9ca3af" fontSize="9" textAnchor="middle">{be}</text></g>)
                  }
                  return ticks
                })()}

                {/* Fill */}
                <polygon points={`60,250 ` + spectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxIntensity) * 210}`).join(' ') + ` 580,250`} fill="#f43f5e" opacity="0.12" />

                {/* Main curve */}
                <polyline points={spectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxIntensity) * 210}`).join(' ')} fill="none" stroke="#f43f5e" strokeWidth="2" />

                {/* Peak labels */}
                {xpsPeaks[selectedRegion]?.filter(p => !p.assign.includes("Shake-up") || showSatellites).map((peak, i) => {
                  const peaks = xpsPeaks[selectedRegion].filter(p => !p.assign.includes("Shake-up") || showSatellites)
                  const minBE = Math.min(...peaks.map(p => p.be)) - 10
                  const maxBE = Math.max(...peaks.map(p => p.be)) + 18
                  const x = 60 + ((peak.be - minBE) / (maxBE - minBE)) * 520
                  const isSat = peak.assign.includes("Shake-up")
                  return (
                    <g key={i}>
                      <line x1={x} y1="30" x2={x} y2="250" stroke={isSat ? "#f59e0b" : "#fbbf24"} strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                      <text x={x} y="25" fill={isSat ? "#f59e0b" : "#fbbf24"} fontSize="8" textAnchor="middle" fontWeight="bold">{peak.orbital}</text>
                      <text x={x} y="15" fill={isSat ? "#f59e0b" : "#fbbf24"} fontSize="7" textAnchor="middle">{peak.be} eV</text>
                    </g>
                  )
                })}

                {/* Legend */}
                <text x="500" y="45" fill="#f43f5e" fontSize="9" textAnchor="end" fontWeight="bold">[Co(H₂O)₆]²⁺ (HS d⁷)</text>
                {compareMode === "co3ls" && <text x="500" y="60" fill="#ec4899" fontSize="9" textAnchor="end">[Co(NH₃)₆]³⁺ (LS d⁶)</text>}
                {compareMode === "co2oh" && <text x="500" y="60" fill="#14b8a6" fontSize="9" textAnchor="end">Co(OH)₂</text>}
              </svg>
            ) : (
              <svg viewBox="0 0 600 300" className="w-full h-72">
                <line x1="60" y1="250" x2="580" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <line x1="60" y1="30" x2="60" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <text x="320" y="285" fill="#c4b5fd" fontSize="11" textAnchor="middle">Bog'lanish energiyasi (eV)</text>
                <polygon points={`60,250 ` + surveySpectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxSurvey) * 210}`).join(' ') + ` 580,250`} fill="#a855f7" opacity="0.12" />
                <polyline points={surveySpectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxSurvey) * 210}`).join(' ')} fill="none" stroke="#a855f7" strokeWidth="2" />
                {[{ be: 781.0, label: "Co 2p", color: "#ec4899" }, { be: 532.5, label: "O 1s", color: "#f59e0b" }, { be: 285.0, label: "C 1s", color: "#6b7280" }, { be: 198.3, label: "Cl 2p", color: "#10b981" }].map((peak, i) => {
                  const x = 60 + ((peak.be - 100) / 800) * 520
                  return (<g key={i}><line x1={x} y1="30" x2={x} y2="250" stroke={peak.color} strokeWidth="1" strokeDasharray="2,2" opacity="0.5" /><text x={x} y="25" fill={peak.color} fontSize="9" textAnchor="middle" fontWeight="bold">{peak.label}</text></g>)
                })}
              </svg>
            )}
          </div>

          {/* Info grid */}
          {!showSurvey && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {xpsPeaks[selectedRegion]?.filter(p => !p.assign.includes("Shake-up") || showSatellites).map((peak, i) => (
                <div key={i} className={`rounded-lg p-3 border ${peak.assign.includes("Shake-up") ? "bg-orange-900/20 border-orange-500/30" : "bg-purple-900/50 border-purple-700/30"}`}>
                  <p className="text-purple-400 text-xs mb-1">{peak.orbital}</p>
                  <p className={`${peak.assign.includes("Shake-up") ? "text-orange-400" : "text-rose-400"} font-bold font-mono text-lg`}>{peak.be} eV</p>
                  <p className="text-purple-300 text-[10px]">{peak.assign}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ═════ HS vs LS SATELLIT DIAGNOSTIKASI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📡</span> HS Co²⁺ vs LS Co³⁺ — Satellite diagnostikasi
          </h2>

          <div className="bg-rose-600/10 border border-rose-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 text-sm leading-relaxed">
              Kobalt komplekslarida <strong>shake-up satellite intensivligi</strong> spin holatining eng ishonchli ko'rsatkichidir.
              <strong className="text-rose-400"> HS Co²⁺ (d⁷)</strong> da kuchli satellite (~786 eV) kuzatiladi —
              bu valent elektronning ligandga ko'chishi (LMCT) natijasida hosil bo'ladi.
              <strong className="text-green-400"> LS Co³⁺ (d⁶)</strong> da esa satellite <strong>deyarli yo'q</strong>,
              chunki t₂g orbitallar to'lgan va LMCT uchun bo'sh joy yo'q.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* HS Co²⁺ */}
            <div className="bg-rose-900/20 border border-rose-500/30 rounded-xl p-5">
              <h3 className="text-rose-400 font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">📡</span> [Co(H₂O)₆]²⁺ — HS d⁷
              </h3>
              <svg viewBox="0 0 280 160" className="w-full h-40">
                <text x="140" y="15" fill="#f43f5e" fontSize="10" textAnchor="middle" fontWeight="bold">d⁷ HS — Bo'sh joy bor</text>
                
                {/* t2g */}
                <line x1="40" y1="60" x2="100" y2="60" stroke="#10b981" strokeWidth="2" />
                <line x1="40" y1="80" x2="100" y2="80" stroke="#10b981" strokeWidth="2" />
                <line x1="40" y1="100" x2="100" y2="100" stroke="#10b981" strokeWidth="2" />
                <text x="20" y="80" fill="#10b981" fontSize="9" textAnchor="middle">t₂g</text>
                
                {/* eg */}
                <line x1="180" y1="50" x2="240" y2="50" stroke="#ef4444" strokeWidth="2" />
                <line x1="180" y1="70" x2="240" y2="70" stroke="#ef4444" strokeWidth="2" />
                <text x="260" y="60" fill="#ef4444" fontSize="9" textAnchor="middle">e_g</text>

                {/* Elektronlar */}
                <text x="55" y="58" fill="#fbbf24" fontSize="8" textAnchor="middle">↑↓</text>
                <text x="85" y="58" fill="#fbbf24" fontSize="8" textAnchor="middle">↑</text>
                <text x="55" y="78" fill="#fbbf24" fontSize="8" textAnchor="middle">↑</text>
                <text x="85" y="78" fill="#fbbf24" fontSize="8" textAnchor="middle">↑</text>
                <text x="55" y="98" fill="#fbbf24" fontSize="8" textAnchor="middle">↑</text>
                <text x="195" y="48" fill="#fbbf24" fontSize="8" textAnchor="middle">↑</text>
                <text x="225" y="48" fill="#fbbf24" fontSize="8" textAnchor="middle">↑</text>

                {/* LMCT arrow */}
                <path d="M 85 90 Q 140 120 195 60" fill="none" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowLMCT)" />
                <text x="140" y="135" fill="#f59e0b" fontSize="9" textAnchor="middle" fontWeight="bold">LMCT RUXSAT</text>
                <text x="140" y="150" fill="#f59e0b" fontSize="8" textAnchor="middle">→ Kuchli satellite</text>

                <defs>
                  <marker id="arrowLMCT" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                    <polygon points="0,0 5,2.5 0,5" fill="#f59e0b" />
                  </marker>
                </defs>
              </svg>
              <div className="mt-2 space-y-1 text-xs text-purple-200">
                <p>• 3 ta toq elektron → paramagnit (S=3/2)</p>
                <p>• Kuchli shake-up satellite <strong>786.5 eV</strong></p>
                <p>• BE = 781.0 eV, keng pik (FWHM ≈ 2.2 eV)</p>
              </div>
            </div>

            {/* LS Co³⁺ */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">✅</span> [Co(NH₃)₆]³⁺ — LS d⁶
              </h3>
              <svg viewBox="0 0 280 160" className="w-full h-40">
                <text x="140" y="15" fill="#10b981" fontSize="10" textAnchor="middle" fontWeight="bold">d⁶ LS — To'lgan t₂g</text>
                
                {/* t2g */}
                <line x1="40" y1="60" x2="100" y2="60" stroke="#10b981" strokeWidth="2" />
                <line x1="40" y1="80" x2="100" y2="80" stroke="#10b981" strokeWidth="2" />
                <line x1="40" y1="100" x2="100" y2="100" stroke="#10b981" strokeWidth="2" />
                <text x="20" y="80" fill="#10b981" fontSize="9" textAnchor="middle">t₂g</text>
                
                {/* eg */}
                <line x1="180" y1="50" x2="240" y2="50" stroke="#ef4444" strokeWidth="2" />
                <line x1="180" y1="70" x2="240" y2="70" stroke="#ef4444" strokeWidth="2" />
                <text x="260" y="60" fill="#ef4444" fontSize="9" textAnchor="middle">e_g</text>

                {/* Elektronlar (barcha juftlangan) */}
                <text x="55" y="58" fill="#fbbf24" fontSize="8" textAnchor="middle">↑↓</text>
                <text x="85" y="58" fill="#fbbf24" fontSize="8" textAnchor="middle">↑↓</text>
                <text x="55" y="78" fill="#fbbf24" fontSize="8" textAnchor="middle">↑↓</text>
                <text x="85" y="78" fill="#fbbf24" fontSize="8" textAnchor="middle">↑↓</text>
                <text x="55" y="98" fill="#fbbf24" fontSize="8" textAnchor="middle">↑↓</text>
                <text x="85" y="98" fill="#fbbf24" fontSize="8" textAnchor="middle">↑↓</text>

                {/* Blocked LMCT */}
                <line x1="140" y1="90" x2="140" y2="120" stroke="#ef4444" strokeWidth="2" />
                <line x1="130" y1="110" x2="150" y2="130" stroke="#ef4444" strokeWidth="2" />
                <line x1="150" y1="110" x2="130" y2="130" stroke="#ef4444" strokeWidth="2" />
                <text x="140" y="145" fill="#ef4444" fontSize="9" textAnchor="middle" fontWeight="bold">LMCT BLOKLANGAN</text>
                <text x="140" y="158" fill="#ef4444" fontSize="8" textAnchor="middle">→ Satellite YO'Q</text>
              </svg>
              <div className="mt-2 space-y-1 text-xs text-purple-200">
                <p>• 0 ta toq elektron → diamagnit (S=0)</p>
                <p>• Satellite <strong>deyarli yo'q</strong></p>
                <p>• BE = 779.8 eV, tor pik (FWHM ≈ 1.6 eV)</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═════ KRISTALL MAYDON DIAGRAMMASI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>📊</span> Kristall maydon diagrammasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-950/50 rounded-xl p-5">
              <svg viewBox="0 0 300 380" className="w-full h-96">
                <line x1="40" y1="20" x2="40" y2="320" stroke="#c4b5fd" strokeWidth="2" />
                <text x="18" y="170" fill="#c4b5fd" fontSize="11" textAnchor="middle" transform="rotate(-90, 18, 170)">Energiya</text>

                {/* e_g - 2 ta toq */}
                <line x1="100" y1="60" x2="220" y2="60" stroke="#ef4444" strokeWidth="3" />
                <line x1="100" y1="80" x2="220" y2="80" stroke="#ef4444" strokeWidth="3" />
                <text x="250" y="70" fill="#ef4444" fontSize="12" fontWeight="bold">e<tspan baselineShift="sub" fontSize="8">g</tspan></text>
                <circle cx="130" cy="70" r="6" fill="#fbbf24" /><circle cx="160" cy="70" r="6" fill="#fbbf24" />
                <text x="128" y="68" fill="#1a1a2e" fontSize="7" textAnchor="middle">↑</text>
                <text x="162" y="68" fill="#1a1a2e" fontSize="7" textAnchor="middle">↑</text>

                {/* Δ_o */}
                <line x1="80" y1="70" x2="80" y2="210" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,3" />
                <text x="72" y="140" fill="#fbbf24" fontSize="11" textAnchor="end">Δ<tspan baselineShift="sub" fontSize="8">o</tspan></text>
                <text x="72" y="155" fill="#fbbf24" fontSize="9" textAnchor="end">9,300</text>
                <text x="72" y="167" fill="#fbbf24" fontSize="8" textAnchor="end">cm⁻¹</text>

                {/* t_2g - 5 ta (3 toq + 2 juft) */}
                <line x1="100" y1="190" x2="220" y2="190" stroke="#10b981" strokeWidth="3" />
                <line x1="100" y1="210" x2="220" y2="210" stroke="#10b981" strokeWidth="3" />
                <line x1="100" y1="230" x2="220" y2="230" stroke="#10b981" strokeWidth="3" />
                <text x="250" y="210" fill="#10b981" fontSize="12" fontWeight="bold">t<tspan baselineShift="sub" fontSize="8">2g</tspan></text>
                
                <circle cx="130" cy="200" r="6" fill="#fbbf24" /><circle cx="160" cy="200" r="6" fill="#fbbf24" />
                <circle cx="130" cy="220" r="6" fill="#fbbf24" /><circle cx="130" cy="240" r="6" fill="#fbbf24" />
                <text x="128" y="198" fill="#1a1a2e" fontSize="7" textAnchor="middle">↑</text>
                <text x="162" y="198" fill="#1a1a2e" fontSize="7" textAnchor="middle">↓</text>
                <text x="128" y="218" fill="#1a1a2e" fontSize="7" textAnchor="middle">↑</text>
                <text x="128" y="238" fill="#1a1a2e" fontSize="7" textAnchor="middle">↑</text>

                <text x="160" y="280" fill="#c4b5fd" fontSize="12" textAnchor="middle" fontWeight="bold">Co²⁺ (d⁷ HS)</text>
                <text x="160" y="298" fill="#10b981" fontSize="11" textAnchor="middle">t₂g⁵ e<tspan baselineShift="sub" fontSize="8">g</tspan>²</text>
                <text x="160" y="316" fill="#ef4444" fontSize="11" textAnchor="middle">S = 3/2 (3 toq e⁻)</text>
                <text x="160" y="334" fill="#fbbf24" fontSize="11" textAnchor="middle" fontWeight="bold">CFSE = -0.8 Δ<sub>o</sub></text>
                <text x="160" y="352" fill="#f43f5e" fontSize="10" textAnchor="middle">Kinetik labill</text>
              </svg>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-rose-400 font-bold mb-3">Nima uchun yuqori spin?</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  H₂O — <strong>kuchsiz maydon ligandi</strong>. Δ<sub>o</sub> (9,300 cm⁻¹) pairing energiyasi P dan kichik.
                  Shuning uchun elektronlar e<sub>g</sub> orbitallarga ham joylashadi → HS holat.
                  3 ta toq elektron → kuchli paramagnit.
                </p>
              </div>

              <div className="bg-rose-900/20 border border-rose-500/30 rounded-xl p-5">
                <h3 className="text-rose-400 font-bold mb-3">CFSE hisoblash</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-purple-200">CFSE = (n<sub>t₂g</sub> × -0.4 + n<sub>e<sub>g</sub></sub> × 0.6) × Δ<sub>o</sub></p>
                  <p className="text-purple-200">= (5 × -0.4 + 2 × 0.6) × Δ<sub>o</sub></p>
                  <p className="text-rose-400 font-bold text-lg">= (-2.0 + 1.2) × Δ<sub>o</sub> = -0.8 Δ<sub>o</sub></p>
                  <p className="text-purple-300 text-xs mt-2">≈ -7,440 cm⁻¹ — kuchsiz stabillashuv</p>
                </div>
              </div>

              <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-5">
                <h3 className="text-orange-400 font-bold mb-2">Kinetik labillik</h3>
                <p className="text-purple-200 text-xs leading-relaxed">
                  Kichik CFSE + HS d⁷ konfiguratsiya → <strong>ligand almashinishi tez</strong>.
                  [Co(H₂O)₆]²⁺ suv eritmasida ligandlarni tez almashadi.
                  Bu uni [Co(NH₃)₆]³⁺ (inert) dan keskin farqlaydi.
                </p>
              </div>

              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-rose-400 font-bold mb-2">XPS bilan bog'liqlik</h3>
                <p className="text-purple-200 text-xs leading-relaxed">
                  HS d⁷ → 3 ta toq elektron → <strong>kuchli shake-up satellite</strong>.
                  Keng pik (FWHM ≈ 2.2 eV) → multiplet ajralish.
                  Bu <strong>HS Co²⁺ ning XPS dagi asosiy belgisi</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═════ SURVEY TARKIB ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>⚛️</span> Elementlar tarkibi (Survey XPS)</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {surveyData.map((el, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: el.color }}></div><p className="font-bold text-white">{el.element}</p></div>
                <p className="text-purple-400 text-xs mb-1">{el.orbital}</p>
                <p className="text-rose-400 font-bold font-mono text-sm">{el.be} eV</p>
                <p className="text-purple-300 text-xs mt-1">{el.atomic_percent.toFixed(1)} at.%</p>
                <p className="text-purple-500 text-[10px] mt-1">{el.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-rose-600/10 border border-rose-500/30 rounded-lg p-3 text-xs text-purple-200">
            <p><strong className="text-rose-400">💡 Nazariy nisbat:</strong> [Co(H₂O)₆]Cl₂ da Co:O:Cl = 1:6:2. Survey XPS da bu nisbat tasdiqlanadi. O 1s BE (532.5 eV) H₂O ligandning koordinatsiyasini ko'rsatadi.</p>
          </div>
        </div>

        {/* ═════ CO HOLATLARI SOLISHTIRISH ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>🔄</span> Kobalt holatlari — to'liq solishtirish</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-left text-purple-300">Xususiyat</th>
                <th className="py-3 px-4 text-center text-rose-400">[Co(H₂O)₆]²⁺</th>
                <th className="py-3 px-4 text-center text-pink-400">[Co(NH₃)₆]³⁺</th>
                <th className="py-3 px-4 text-center text-teal-400">Co(OH)₂</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Oksidlanish darajasi", "+2", "+3", "+2"],
                  ["d-elektronlar", "d⁷", "d⁶", "d⁷"],
                  ["Spin holat", "HS", "LS", "HS"],
                  ["Konfiguratsiya", "t₂g⁵ e_g²", "t₂g⁶ e_g⁰", "t₂g⁵ e_g²"],
                  ["Umumiy spin", "S=3/2", "S=0", "S=3/2"],
                  ["2p₃/₂ BE (eV)", "781.0", "779.8", "780.5"],
                  ["Satellit", "Kuchli (786.5)", "Juda kuchsiz", "Kuchli (786.0)"],
                  ["I(sat)/I(main)", "~0.50", "~0.08", "~0.40"],
                  ["FWHM (eV)", "~2.2", "~1.6", "~2.0"],
                  ["Magnit", "Paramagnit", "Diamagnit", "Paramagnit"],
                  ["Kinetik", "Labill", "Inert", "O'rtacha"],
                  ["Rang", "Pushti", "Sariq-to'q sariq", "Ko'k-yashil"]
                ].map((r, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${i >= 5 && i <= 8 ? 'bg-rose-900/10' : ''}`}>
                    <td className="py-2 px-4 font-semibold">{r[0]}</td>
                    <td className="py-2 px-4 text-center font-bold text-rose-400">{r[1]}</td>
                    <td className="py-2 px-4 text-center">{r[2]}</td>
                    <td className="py-2 px-4 text-center">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-amber-600/10 border border-amber-500/30 rounded-lg p-4 text-xs text-purple-200">
            <p><strong className="text-amber-400">💡 Asosiy diagnostik belgilar:</strong> (1) <strong>Satellit intensivligi</strong> — HS da kuchli, LS da yo'q.
            (2) <strong>BE qiymati</strong> — Co²⁺ &gt; Co³⁺ (taxminan). (3) <strong>Pik kengligi</strong> — HS kengroq.
            Uchala parametr birgalikda <strong>aniq identifikatsiya</strong> beradi.</p>
          </div>
        </div>

        {/* ═════ QO'LLANILISH ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>🏭</span> Amaliy qo'llanilishi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-rose-400 font-bold mb-2 text-sm">Pigmentlar</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Kobalt pushti</strong> pigmenti asosi. Keramik, shisha, bo'yoq sanoatida.
                CoCl₂·6H₂O namlik indikatori sifatida ham ishlatiladi (quruq=ko'k, nam=pushti).
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🔋</div>
              <h3 className="text-rose-400 font-bold mb-2 text-sm">Batareyalar</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Litiy-kobalt oksid</strong> (LiCoO₂) batareyalar katodi.
                Co²⁺ tuzlari prekursor sifatida ishlatiladi. Zamonaviy Li-ion batareyalar asosi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">⚗️</div>
              <h3 className="text-rose-400 font-bold mb-2 text-sm">Kataliz</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                Kobalt tuzlari <strong>oksidlanish katalizatorlari</strong>. Organik sintezda,
                polimerizatsiyada, suv parchalashda qo'llaniladi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🧪</div>
              <h3 className="text-rose-400 font-bold mb-2 text-sm">Analitik kimyo</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                Co²⁺ ni <strong>tiotsianat reaksiyasi</strong> orqali aniqlash (ko'k [Co(SCN)₄]²⁻).
                Spektrofotometrik va kolorimetrik usullar.
              </p>
            </div>
          </div>
        </div>

        {/* ═════ TARIX ═════ */}
        <div className="bg-gradient-to-br from-rose-900/30 to-pink-900/30 border border-rose-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-rose-300 mb-4 flex items-center gap-2"><span>📜</span> Tarixiy kontekst</h2>
          <div className="space-y-3 text-sm text-rose-100/90">
            <p><strong className="text-rose-300">1735</strong> — Georg Brandt kobaltni alohida element sifatida ajratdi. Birinchi marta mis va nikkeldan farqladi.</p>
            <p><strong className="text-rose-300">1893</strong> — Werner [Co(H₂O)₆]²⁺ va [Co(NH₃)₆]³⁺ ni sintez qildi. Koordinatsion nazariyaning asosiy misollari.</p>
            <p><strong className="text-rose-300">1930-yillar</strong> — Pauling va Van Vleck kristall maydon nazariyasini rivojlantirdi. HS/LS tushunchasi kiritildi.</p>
            <p><strong className="text-rose-300">1950-yillar</strong> — Taube kinetik inertlik/labillik mexanizmini o'rgandi. HS Co²⁺ labill ekanligi tasdiqlandi.</p>
            <p><strong className="text-rose-300">1970-yillardan</strong> — XPS orqali <strong>HS Co²⁺ satelliti</strong> aniqlandi. Bu HS/LS diagnostikasining asosi bo'ldi.</p>
            <p><strong className="text-rose-300">Hozirgi kun</strong> — [Co(H₂O)₆]²⁺ XPS da <strong>HS Co²⁺ standarti</strong>. Batareya, kataliz, pigment sanoatida keng qo'llaniladi.</p>
          </div>
        </div>

        {/* ═════ XULOSA ═════ */}
        <div className="bg-gradient-to-r from-rose-600/10 to-purple-600/10 border border-rose-500/20 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span>✅</span> Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Co(H₂O)₆]²⁺ — <strong className="text-rose-400">klassik yuqori spinli Co²⁺ kompleksi</strong></li>
            <li>Co²⁺ (d⁷) — <strong>t₂g⁵ e_g²</strong>, S=3/2, 3 ta toq elektron</li>
            <li><strong>Co 2p₃/₂ BE = 781.0 eV</strong> — HS Co²⁺ uchun xarakterli</li>
            <li><strong>Kuchli shake-up satellite (786.5 eV)</strong> — HS ning asosiy diagnostik belgisi</li>
            <li>[Co(NH₃)₆]³⁺ (LS) dan farqi: <strong>kuchli satellite + yuqori BE + keng pik</strong></li>
            <li>SO splitting: <strong>15.0 eV</strong> (2p₃/₂ − 2p₁/₂)</li>
            <li>CFSE = <strong>-0.8 Δ<sub>o</sub></strong> — kuchsiz stabillashuv</li>
            <li><strong>Kinetik labill</strong> — ligand almashinishi tez</li>
            <li>Batareya, kataliz, pigment, analitik kimyoda qo'llaniladi</li>
            <li>XPS da <strong>HS Co²⁺ standarti</strong> sifatida ishlatiladi</li>
          </ol>
        </div>

        {/* ═════ NAVIGATSIYA ═════ */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/xps/birikmalar/co-nh3-6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300">← [Co(NH₃)₆]³⁺</Link>
          <Link href="/ilmiy/tahlil/xps/birikmalar/sisplatin" className="px-6 py-3 bg-rose-600/80 rounded-xl hover:bg-rose-500 text-white font-semibold">Keyingi: Sisplatin →</Link>
        </div>
      </section>
    </main>
  )
}