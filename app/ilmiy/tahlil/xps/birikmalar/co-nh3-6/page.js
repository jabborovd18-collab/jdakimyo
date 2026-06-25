"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════
// XPS MA'LUMOTLAR BAZASI — [Co(NH₃)₆]³⁺
// ═══════════════════════════════════════════════════════════
const xpsPeaks = {
  "Co 2p": [
    { orbital: "Co 2p₃/₂", be: 779.8, intensity: 1.0, fwhm: 1.6, assign: "Co³⁺ (LS d⁶)" },
    { orbital: "Co 2p₁/₂", be: 794.8, intensity: 0.5, fwhm: 1.6, assign: "SO split (Δ=15.0 eV)" },
    { orbital: "Satellite", be: 786.0, intensity: 0.08, fwhm: 2.5, assign: "Shake-up (juda kuchsiz)" }
  ],
  "N 1s": [
    { orbital: "N 1s (NH₃)", be: 399.6, intensity: 1.0, fwhm: 1.3, assign: "Koordinatsion NH₃" },
    { orbital: "N 1s (ads)", be: 401.2, intensity: 0.15, fwhm: 1.5, assign: "Adsorbsion N₂" }
  ],
  "Cl 2p": [
    { orbital: "Cl 2p₃/₂", be: 198.3, intensity: 1.0, fwhm: 1.2, assign: "Cl⁻ counterion" },
    { orbital: "Cl 2p₁/₂", be: 199.9, intensity: 0.5, fwhm: 1.2, assign: "SO split (Δ=1.6 eV)" }
  ]
}

const surveyData = [
  { element: "Co", orbital: "2p₃/₂", be: 779.8, atomic_percent: 7.7, color: "#ec4899", desc: "Markaziy metal (Co³⁺)" },
  { element: "N", orbital: "1s", be: 399.6, atomic_percent: 46.2, color: "#3b82f6", desc: "Ligand NH₃" },
  { element: "Cl", orbital: "2p₃/₂", be: 198.3, atomic_percent: 23.1, color: "#10b981", desc: "Counterion Cl⁻" },
  { element: "C", orbital: "1s", be: 285.0, atomic_percent: 15.4, color: "#6b7280", desc: "Sirt iflosligi" },
  { element: "O", orbital: "1s", be: 532.0, atomic_percent: 7.7, color: "#f59e0b", desc: "Adsorbsion H₂O" }
]

export default function CoNH3_6() {
  const [selectedRegion, setSelectedRegion] = useState("Co 2p")
  const [showSatellite, setShowSatellite] = useState(false)
  const [showSurvey, setShowSurvey] = useState(false)
  const [compareMode, setCompareMode] = useState("none") // none, co2hs, co3ls_cn

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
        if (peak.assign.includes("Shake-up") && !showSatellite) return
        const x = (be - peak.be) / peak.fwhm
        intensity += peak.intensity * Math.exp(-0.5 * x * x)
      })

      // Solishtirish rejimlari
      if (refMode === "co2hs" && region === "Co 2p") {
        // Co²⁺ HS — kuchli satellite
        const x1 = (be - 781.0) / 2.2
        intensity += 0.90 * Math.exp(-0.5 * x1 * x1)
        const x2 = (be - 796.0) / 2.2
        intensity += 0.45 * Math.exp(-0.5 * x2 * x2)
        // Kuchli shake-up
        const xs = (be - 786.5) / 3.0
        intensity += 0.50 * Math.exp(-0.5 * xs * xs)
      } else if (refMode === "co3ls_cn" && region === "Co 2p") {
        // [Co(CN)₆]³⁻ LS — satellite yo'q deyarli
        const x1 = (be - 779.5) / 1.4
        intensity += 0.95 * Math.exp(-0.5 * x1 * x1)
        const x2 = (be - 794.5) / 1.4
        intensity += 0.47 * Math.exp(-0.5 * x2 * x2)
      }

      // Fon
      const bg = 0.05 * (maxBE - be) / (maxBE - minBE)
      intensity += bg

      points.push({ be, intensity })
    }
    return points
  }

  const spectrum = useMemo(() =>
    generateSpectrum(selectedRegion, compareMode),
    [selectedRegion, compareMode, showSatellite]
  )

  const maxIntensity = Math.max(...spectrum.map(p => p.intensity), 0.01)

  // ═══════════════════════════════════════════════════════════
  // SURVEY SPEKTRI
  // ═══════════════════════════════════════════════════════════
  const generateSurveySpectrum = () => {
    const points = []
    const allPeaks = [
      { be: 779.8, intensity: 1.0, label: "Co 2p", color: "#ec4899" },
      { be: 532.0, intensity: 0.4, label: "O 1s", color: "#f59e0b" },
      { be: 399.6, intensity: 1.4, label: "N 1s", color: "#3b82f6" },
      { be: 285.0, intensity: 0.6, label: "C 1s", color: "#6b7280" },
      { be: 198.3, intensity: 0.8, label: "Cl 2p", color: "#10b981" }
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
            <span className="text-pink-400 font-semibold">[Co(NH₃)₆]³⁺</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-pink-400 flex items-center gap-3">
                <span className="text-3xl">🔬</span>
                <span>[Co(NH₃)₆]³⁺</span>
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Geksaamminkobalt(III) • Co³⁺ (d⁶ LS) • Diamagnit • Sariq-to'q sariq
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
            <div className="text-xl font-bold text-pink-400">Co³⁺</div>
            <div className="text-[10px] text-purple-400">d⁶ (LS)</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Geometriya</div>
            <div className="text-xl font-bold text-blue-400">Oₕ</div>
            <div className="text-[10px] text-purple-400">Oktaedrik</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Co 2p₃/₂ BE</div>
            <div className="text-xl font-bold text-pink-400 font-mono">779.8</div>
            <div className="text-[10px] text-purple-400">eV</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Spin</div>
            <div className="text-xl font-bold text-green-400">S=0</div>
            <div className="text-[10px] text-purple-400">Diamagnit</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Kinetik</div>
            <div className="text-xl font-bold text-yellow-400">Inert</div>
            <div className="text-[10px] text-purple-400">Barqaror</div>
          </div>
        </div>

        {/* ═════ ASOSIY MA'LUMOT ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Asosiy ma'lumotlar
          </h2>

          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed text-sm">
              <strong className="text-pink-400">[Co(NH₃)₆]³⁺</strong> (geksaamminkobalt(III) ioni) —
              koordinatsion kimyoning <strong>eng klassik kompleksi</strong>. Werner nazariyasining asosiy misoli.
              Co³⁺ (d⁶) NH₃ kuchli maydon ligandi ta'sirida <strong className="text-pink-400">past spin (LS)</strong>
              holatga o'tadi: <strong className="text-pink-400">t₂g⁶ e<sub>g</sub>⁰</strong>.
              Barcha elektronlar juftlangan → <strong>diamagnit</strong>.
              XPS da <strong>satellit deyarli yo'q</strong> (LS d⁶ belgisi).
              Kinetik jihatdan <strong>juda inert</strong> — ligand almashinishi sekin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-pink-400 font-bold mb-3">🧪 Kimyoviy xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Molekulyar massa:</span>
                  <span className="font-mono">178.05 g/mol (ion)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Ligand:</span>
                  <span>6 × NH₃</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Koordinatsion son:</span>
                  <span className="font-bold">6 (oktaedrik)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Oksidlanish darajasi:</span>
                  <span className="font-bold text-pink-400">+3</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-yellow-400">Sariq-to'q sariq</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Barqarorlik:</span>
                  <span>log β₆ ≈ 35.2</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Kinetik:</span>
                  <span className="text-yellow-400 font-bold">Inert</span>
                </li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-pink-400 font-bold mb-3">⚛️ Elektron struktura</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Konfiguratsiya:</span>
                  <span className="font-mono">{"d⁶ (t₂g⁶ e"}<sub>g</sub>{"⁰)"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Spin holat:</span>
                  <span className="text-green-400 font-bold">Past spin (LS)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Umumiy spin:</span>
                  <span className="font-mono">S = 0</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Toq elektronlar:</span>
                  <span className="font-mono text-green-400 font-bold">0 ta</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">μ<sub>eff</sub>:</span>
                  <span className="font-mono">0 BM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Δ<sub>o</sub>:</span>
                  <span className="font-mono">~22,900 cm⁻¹</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">CFSE:</span>
                  <span className="font-mono text-pink-400 font-bold">{"-2.4 Δ"}<sub>o</sub></span>
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
                  selectedRegion === region ? "bg-pink-600 text-white shadow-lg" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}>{region}</button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 mb-4">
            {selectedRegion === "Co 2p" && (
              <>
                <label className="flex items-center gap-2 cursor-pointer bg-purple-800/30 px-3 py-2 rounded-lg border border-purple-700/30">
                  <input type="checkbox" checked={showSatellite} onChange={(e) => setShowSatellite(e.target.checked)} className="accent-pink-500" />
                  <span className="text-xs text-purple-300">Kuchsiz satellite (786 eV)</span>
                </label>
                <div className="flex gap-1">
                  <button onClick={() => setCompareMode("none")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "none" ? "bg-pink-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                    Yolg'iz
                  </button>
                  <button onClick={() => setCompareMode("co2hs")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "co2hs" ? "bg-red-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                    vs Co²⁺ HS
                  </button>
                  <button onClick={() => setCompareMode("co3ls_cn")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "co3ls_cn" ? "bg-cyan-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                    vs [Co(CN)₆]³⁻
                  </button>
                </div>
              </>
            )}
            <label className="flex items-center gap-2 cursor-pointer bg-purple-800/30 px-3 py-2 rounded-lg border border-purple-700/30">
              <input type="checkbox" checked={showSurvey} onChange={(e) => setShowSurvey(e.target.checked)} className="accent-pink-500" />
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
                  const peaks = xpsPeaks[selectedRegion]?.filter(p => !p.assign.includes("Shake-up") || showSatellite)
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
                <polygon points={`60,250 ` + spectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxIntensity) * 210}`).join(' ') + ` 580,250`} fill="#ec4899" opacity="0.12" />

                {/* Main curve */}
                <polyline points={spectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxIntensity) * 210}`).join(' ')} fill="none" stroke="#ec4899" strokeWidth="2" />

                {/* Peak labels */}
                {xpsPeaks[selectedRegion]?.filter(p => !p.assign.includes("Shake-up") || showSatellite).map((peak, i) => {
                  const peaks = xpsPeaks[selectedRegion].filter(p => !p.assign.includes("Shake-up") || showSatellite)
                  const minBE = Math.min(...peaks.map(p => p.be)) - 10
                  const maxBE = Math.max(...peaks.map(p => p.be)) + 18
                  const x = 60 + ((peak.be - minBE) / (maxBE - minBE)) * 520
                  const isSat = peak.assign.includes("Shake-up")
                  return (
                    <g key={i}>
                      <line x1={x} y1="30" x2={x} y2="250" stroke={isSat ? "#f59e0b" : "#fbbf24"} strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                      <text x={x} y="25" fill={isSat ? "#f59e0b" : "#fbbf24"} fontSize="9" textAnchor="middle" fontWeight="bold">{peak.orbital}</text>
                      <text x={x} y="15" fill={isSat ? "#f59e0b" : "#fbbf24"} fontSize="8" textAnchor="middle">{peak.be} eV</text>
                    </g>
                  )
                })}

                {/* Legend */}
                <text x="500" y="45" fill="#ec4899" fontSize="9" textAnchor="end" fontWeight="bold">[Co(NH₃)₆]³⁺ (LS d⁶)</text>
                {compareMode === "co2hs" && <text x="500" y="60" fill="#ef4444" fontSize="9" textAnchor="end">Co²⁺ HS (kuchli satellite)</text>}
                {compareMode === "co3ls_cn" && <text x="500" y="60" fill="#06b6d4" fontSize="9" textAnchor="end">[Co(CN)₆]³⁻ (LS d⁶)</text>}
              </svg>
            ) : (
              <svg viewBox="0 0 600 300" className="w-full h-72">
                <line x1="60" y1="250" x2="580" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <line x1="60" y1="30" x2="60" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <text x="320" y="285" fill="#c4b5fd" fontSize="11" textAnchor="middle">Bog'lanish energiyasi (eV)</text>
                <polygon points={`60,250 ` + surveySpectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxSurvey) * 210}`).join(' ') + ` 580,250`} fill="#a855f7" opacity="0.12" />
                <polyline points={surveySpectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxSurvey) * 210}`).join(' ')} fill="none" stroke="#a855f7" strokeWidth="2" />
                {[{ be: 779.8, label: "Co 2p", color: "#ec4899" }, { be: 399.6, label: "N 1s", color: "#3b82f6" }, { be: 285.0, label: "C 1s", color: "#6b7280" }, { be: 198.3, label: "Cl 2p", color: "#10b981" }].map((peak, i) => {
                  const x = 60 + ((peak.be - 100) / 800) * 520
                  return (<g key={i}><line x1={x} y1="30" x2={x} y2="250" stroke={peak.color} strokeWidth="1" strokeDasharray="2,2" opacity="0.5" /><text x={x} y="25" fill={peak.color} fontSize="9" textAnchor="middle" fontWeight="bold">{peak.label}</text></g>)
                })}
              </svg>
            )}
          </div>

          {/* Info grid */}
          {!showSurvey && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {xpsPeaks[selectedRegion]?.filter(p => !p.assign.includes("Shake-up") || showSatellite).map((peak, i) => (
                <div key={i} className={`rounded-lg p-3 border ${peak.assign.includes("Shake-up") ? "bg-orange-900/20 border-orange-500/30" : "bg-purple-900/50 border-purple-700/30"}`}>
                  <p className="text-purple-400 text-xs mb-1">{peak.orbital}</p>
                  <p className={`${peak.assign.includes("Shake-up") ? "text-orange-400" : "text-pink-400"} font-bold font-mono text-lg`}>{peak.be} eV</p>
                  <p className="text-purple-300 text-[10px]">{peak.assign}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ═════ LS vs HS SATELLIT DIAGNOSTIKASI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📡</span> LS vs HS — Satellite diagnostikasi
          </h2>

          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 text-sm leading-relaxed">
              Co komplekslarida <strong>shake-up satellite intensivligi</strong> spin holatiga bog'liq.
              <strong className="text-pink-400"> HS (yuqori spin)</strong> holatda kuchli satellite kuzatiladi (~786 eV).
              <strong className="text-green-400"> LS (past spin)</strong> holatda satellite <strong>deyarli yo'q</strong> yoki juda kuchsiz.
              Bu XPS orqali Co²⁺/Co³⁺ va HS/LS ni farqlashning eng ishonchli usuli.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Co³⁺ LS */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3 text-sm">Co³⁺ LS (d⁶)</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-purple-400">2p₃/₂ BE:</span><span className="text-pink-400 font-mono font-bold">779.8 eV</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Satellit:</span><span className="text-green-400 font-bold">Juda kuchsiz</span></div>
                <div className="flex justify-between"><span className="text-purple-400">I(sat)/I(main):</span><span className="text-green-400 font-mono">~0.08</span></div>
                <div className="flex justify-between"><span className="text-purple-400">FWHM:</span><span className="text-green-400 font-mono">~1.6 eV</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Magnit:</span><span className="text-green-400 font-bold">DIAMAGNIT</span></div>
              </div>
              <div className="mt-3 bg-green-600/20 rounded p-2 text-[10px] text-green-200">
                ✅ Kuchsiz satellite → LS tasdiqlandi
              </div>
            </div>

            {/* Co²⁺ HS */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3 text-sm">Co²⁺ HS (d⁷)</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-purple-400">2p₃/₂ BE:</span><span className="text-red-400 font-mono font-bold">781.0 eV</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Satellit:</span><span className="text-orange-400 font-bold">KUCHLI</span></div>
                <div className="flex justify-between"><span className="text-purple-400">I(sat)/I(main):</span><span className="text-orange-400 font-mono">~0.50</span></div>
                <div className="flex justify-between"><span className="text-purple-400">FWHM:</span><span className="text-orange-400 font-mono">~2.2 eV</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Magnit:</span><span className="text-red-400 font-bold">PARAMAGNIT</span></div>
              </div>
              <div className="mt-3 bg-red-600/20 rounded p-2 text-[10px] text-red-200">
                ⚠️ Kuchli satellite → HS tasdiqlandi
              </div>
            </div>

            {/* Co³⁺ LS CN */}
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-5">
              <h3 className="text-cyan-400 font-bold mb-3 text-sm">[Co(CN)₆]³⁻ LS (d⁶)</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-purple-400">2p₃/₂ BE:</span><span className="text-cyan-400 font-mono font-bold">779.5 eV</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Satellit:</span><span className="text-green-400 font-bold">YO'Q</span></div>
                <div className="flex justify-between"><span className="text-purple-400">I(sat)/I(main):</span><span className="text-green-400 font-mono">~0</span></div>
                <div className="flex justify-between"><span className="text-purple-400">FWHM:</span><span className="text-green-400 font-mono">~1.4 eV</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Magnit:</span><span className="text-green-400 font-bold">DIAMAGNIT</span></div>
              </div>
              <div className="mt-3 bg-cyan-600/20 rounded p-2 text-[10px] text-cyan-200">
                ✅ Satellite yo'q → LS + kuchli maydon
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

                {/* e_g */}
                <line x1="100" y1="60" x2="220" y2="60" stroke="#ef4444" strokeWidth="3" />
                <line x1="100" y1="80" x2="220" y2="80" stroke="#ef4444" strokeWidth="3" />
                <text x="250" y="70" fill="#ef4444" fontSize="12" fontWeight="bold">{"e"}<tspan baselineShift="sub" fontSize="8">g</tspan></text>
                <text x="250" y="85" fill="#ef4444" fontSize="9">(bo'sh)</text>

                {/* Δ_o */}
                <line x1="80" y1="70" x2="80" y2="210" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,3" />
                <text x="72" y="140" fill="#fbbf24" fontSize="11" textAnchor="end">{"Δ"}<tspan baselineShift="sub" fontSize="8">o</tspan></text>
                <text x="72" y="155" fill="#fbbf24" fontSize="9" textAnchor="end">22,900</text>
                <text x="72" y="167" fill="#fbbf24" fontSize="8" textAnchor="end">cm⁻¹</text>

                {/* t_2g */}
                <line x1="100" y1="190" x2="220" y2="190" stroke="#10b981" strokeWidth="3" />
                <line x1="100" y1="210" x2="220" y2="210" stroke="#10b981" strokeWidth="3" />
                <line x1="100" y1="230" x2="220" y2="230" stroke="#10b981" strokeWidth="3" />
                <text x="250" y="210" fill="#10b981" fontSize="12" fontWeight="bold">{"t"}<tspan baselineShift="sub" fontSize="8">2g</tspan></text>

                {/* 6 ta elektron (barcha juftlangan) */}
                <circle cx="130" cy="200" r="6" fill="#fbbf24" /><circle cx="160" cy="200" r="6" fill="#fbbf24" />
                <circle cx="130" cy="220" r="6" fill="#fbbf24" /><circle cx="160" cy="220" r="6" fill="#fbbf24" />
                <circle cx="130" cy="240" r="6" fill="#fbbf24" /><circle cx="160" cy="240" r="6" fill="#fbbf24" />
                <text x="128" y="198" fill="#1a1a2e" fontSize="7" textAnchor="middle">↑</text>
                <text x="162" y="198" fill="#1a1a2e" fontSize="7" textAnchor="middle">↓</text>
                <text x="128" y="218" fill="#1a1a2e" fontSize="7" textAnchor="middle">↑</text>
                <text x="162" y="218" fill="#1a1a2e" fontSize="7" textAnchor="middle">↓</text>
                <text x="128" y="238" fill="#1a1a2e" fontSize="7" textAnchor="middle">↑</text>
                <text x="162" y="238" fill="#1a1a2e" fontSize="7" textAnchor="middle">↓</text>

                <text x="160" y="280" fill="#c4b5fd" fontSize="12" textAnchor="middle" fontWeight="bold">Co³⁺ (d⁶ LS)</text>
                <text x="160" y="298" fill="#10b981" fontSize="11" textAnchor="middle">{"t₂g⁶ e"}<tspan baselineShift="sub" fontSize="8">g</tspan>⁰</text>
                <text x="160" y="316" fill="#10b981" fontSize="11" textAnchor="middle">S = 0 (diamagnit)</text>
                <text x="160" y="334" fill="#fbbf24" fontSize="11" textAnchor="middle" fontWeight="bold">{"CFSE = -2.4 Δ"}<tspan baselineShift="sub" fontSize="8">o</tspan></text>
                <text x="160" y="352" fill="#ec4899" fontSize="10" textAnchor="middle">Kinetik inert</text>
              </svg>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-pink-400 font-bold mb-3">Nima uchun past spin?</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  NH₃ — <strong>kuchli maydon ligandi</strong>. Δ<sub>o</sub> (22,900 cm⁻¹) pairing energiyasi P dan katta.
                  Shuning uchun barcha 6 elektron <strong>t₂g orbitallarga</strong> joylashadi → LS holat.
                  Bu Werner komplekslari orasida eng barqaror konfiguratsiya.
                </p>
              </div>

              <div className="bg-pink-900/20 border border-pink-500/30 rounded-xl p-5">
                <h3 className="text-pink-400 font-bold mb-3">CFSE hisoblash</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-purple-200">{"CFSE = (n"}<sub>t₂g</sub>{" × -0.4 + n"}<sub>e<sub>g</sub></sub>{" × 0.6) × Δ"}<sub>o</sub></p>
                  <p className="text-purple-200">= (6 × -0.4 + 0 × 0.6) × Δ<sub>o</sub></p>
                  <p className="text-pink-400 font-bold text-lg">{"= -2.4 Δ"}<sub>o</sub></p>
                  <p className="text-purple-300 text-xs mt-2">≈ -54,960 cm⁻¹ — juda yuqori stabillashuv!</p>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-5">
                <h3 className="text-yellow-400 font-bold mb-2">Kinetik inertlik</h3>
                <p className="text-purple-200 text-xs leading-relaxed">
                  Katta CFSE + LS d⁶ konfiguratsiya → <strong>ligand almashinishi juda sekin</strong>.
                  [Co(NH₃)₆]³⁺ suv eritmasida kunlab o'zgarmaydi.
                  Bu uni <strong>Werner nazariyasini tasdiqlash</strong> uchun ideal qildi.
                </p>
              </div>

              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-pink-400 font-bold mb-2">XPS bilan bog'liqlik</h3>
                <p className="text-purple-200 text-xs leading-relaxed">
                  LS d⁶ → barcha elektronlar juftlangan → <strong>satellit deyarli yo'q</strong>.
                  Tor pik (FWHM ≈ 1.6 eV) → bir xil kimyoviy muhit.
                  Bu <strong>LS Co³⁺ ning XPS dagi asosiy belgisi</strong>.
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
                <p className="text-pink-400 font-bold font-mono text-sm">{el.be} eV</p>
                <p className="text-purple-300 text-xs mt-1">{el.atomic_percent.toFixed(1)} at.%</p>
                <p className="text-purple-500 text-[10px] mt-1">{el.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-pink-600/10 border border-pink-500/30 rounded-lg p-3 text-xs text-purple-200">
            <p><strong className="text-pink-400">💡 Nazariy nisbat:</strong> [Co(NH₃)₆]Cl₃ da Co:N:Cl = 1:6:3. Survey XPS da bu nisbat tasdiqlanadi. N 1s BE (399.6 eV) NH₃ ligandning koordinatsiyasini ko'rsatadi.</p>
          </div>
        </div>

        {/* ═════ QO'LLANILISH ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>🏭</span> Amaliy qo'llanilishi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="text-pink-400 font-bold mb-2 text-sm">Ta'lim va tadqiqot</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Werner nazariyasining</strong> asosiy misoli. Koordinatsion kimyo kurslarida
                oktaedrik geometriya, LS/HS, kinetik inertlik tushunchalarini o'rgatish uchun.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🔬</div>
              <h3 className="text-pink-400 font-bold mb-2 text-sm">XPS standarti</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>LS Co³⁺ standarti</strong> sifatida ishlatiladi. BE = 779.8 eV kalibrlash uchun.
                Satellite diagnostikasi metodikasini sinash uchun.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">⚗️</div>
              <h3 className="text-pink-400 font-bold mb-2 text-sm">Kataliz prekursori</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                Kobalt oksid nanopartikullari sintezida <strong>prekursor</strong> sifatida.
                Termal parchalanish orqali Co₃O₄ hosil qilinadi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-pink-400 font-bold mb-2 text-sm">Pigmentlar</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Kobalt sariq</strong> pigmenti asosi. Keramik, shisha, bo'yoq sanoatida.
                Barqaror rang, yuqori haroratga chidamli.
              </p>
            </div>
          </div>
        </div>

        {/* ═════ TARIX ═════ */}
        <div className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 border border-pink-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-pink-300 mb-4 flex items-center gap-2"><span>📜</span> Tarixiy kontekst</h2>
          <div className="space-y-3 text-sm text-pink-100/90">
            <p><strong className="text-pink-300">1893</strong> — Alfred Werner [Co(NH₃)₆]³⁺ ni sintez qildi va <strong>koordinatsion nazariyani</strong> taklif qildi. Bu kimyo tarixidagi eng muhim ishlardan biri.</p>
            <p><strong className="text-pink-300">1913</strong> — Werner <strong>Nobel mukofoti</strong>ni oldi. [Co(NH₃)₆]³⁺ nazariyaning asosiy dalili bo'ldi.</p>
            <p><strong className="text-pink-300">1930-yillar</strong> — Pauling va Van Vleck <strong>kristall maydon nazariyasi</strong>ni rivojlantirdi. d⁶ LS holati tushuntirildi.</p>
            <p><strong className="text-pink-300">1950-yillar</strong> — Taube <strong>kinetik inertlik</strong> mexanizmini o'rgandi. LS d⁶ komplekslari inert ekanligi tasdiqlandi.</p>
            <p><strong className="text-pink-300">1970-yillardan</strong> — XPS orqali <strong>LS Co³⁺ satelliti yo'qligi</strong> aniqlandi. Bu LS/HS diagnostikasining asosi bo'ldi.</p>
            <p><strong className="text-pink-300">Hozirgi kun</strong> — [Co(NH₃)₆]³⁺ hali ham <strong>koordinatsion kimyoning ramzi</strong>. Har bir darslikda mavjud.</p>
          </div>
        </div>

        {/* ═════ XULOSA ═════ */}
        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span>✅</span> Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Co(NH₃)₆]³⁺ — <strong className="text-pink-400">koordinatsion kimyoning eng klassik kompleksi</strong></li>
            <li>Co³⁺ (d⁶) — <strong>t₂g⁶ e_g⁰</strong>, S=0, diamagnit</li>
            <li><strong>Co 2p₃/₂ BE = 779.8 eV</strong> — LS Co³⁺ uchun xarakterli</li>
            <li><strong>Satellit deyarli yo'q</strong> — LS d⁶ ning asosiy diagnostik belgisi</li>
            <li>Co²⁺ HS dan farqi: <strong>satellit yo'q + past BE + tor pik</strong></li>
            <li>SO splitting: <strong>15.0 eV</strong> (2p₃/₂ − 2p₁/₂)</li>
            <li>CFSE = <strong>-2.4 Δ<sub>o</sub></strong> — juda yuqori stabillashuv</li>
            <li><strong>Kinetik inert</strong> — ligand almashinishi sekin</li>
            <li>Werner nazariyasining asosiy misoli (Nobel 1913)</li>
            <li>XPS da <strong>LS Co³⁺ standarti</strong> sifatida ishlatiladi</li>
          </ol>
        </div>

        {/* ═════ NAVIGATSIYA ═════ */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/xps/birikmalar/cu-cn-4" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300">← [Cu(CN)₄]³⁻</Link>
          <Link href="/ilmiy/tahlil/xps/birikmalar/co-h2o6-2" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold">Keyingi: [Co(H₂O)₆]²⁺ →</Link>
        </div>
      </section>
    </main>
  )
}