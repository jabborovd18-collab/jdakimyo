"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════
// XPS MA'LUMOTLAR — K₃[Fe(CN)₆]
// ═══════════════════════════════════════════════════════════
const xpsPeaks = {
  "Fe 2p": [
    { orbital: "Fe 2p₃/₂", be: 709.8, intensity: 1.0, fwhm: 1.6, assign: "Fe³⁺ (LS)" },
    { orbital: "Fe 2p₁/₂", be: 722.9, intensity: 0.5, fwhm: 1.6, assign: "SO split" }
  ],
  "K 2p": [
    { orbital: "K 2p₃/₂", be: 293.0, intensity: 1.0, fwhm: 1.3, assign: "K⁺" },
    { orbital: "K 2p₁/₂", be: 295.8, intensity: 0.5, fwhm: 1.3, assign: "SO split" }
  ],
  "N 1s": [
    { orbital: "N 1s", be: 398.3, intensity: 1.0, fwhm: 1.2, assign: "CN⁻" }
  ],
  "C 1s": [
    { orbital: "C 1s", be: 285.8, intensity: 1.0, fwhm: 1.2, assign: "CN⁻" }
  ]
}

const surveyData = [
  { element: "Fe", orbital: "2p₃/₂", be: 709.8, atomic_percent: 5.6, color: "#ef4444" },
  { element: "K", orbital: "2p₃/₂", be: 293.0, atomic_percent: 16.7, color: "#a855f7" },
  { element: "N", orbital: "1s", be: 398.3, atomic_percent: 33.3, color: "#3b82f6" },
  { element: "C", orbital: "1s", be: 285.8, atomic_percent: 33.3, color: "#6b7280" },
  { element: "O", orbital: "1s", be: 532.0, atomic_percent: 11.1, color: "#f59e0b" }
]

export default function FeCN6_3() {
  const [selectedRegion, setSelectedRegion] = useState("Fe 2p")
  const [showSatellite, setShowSatellite] = useState(false)
  const [showSurvey, setShowSurvey] = useState(false)
  const [compareMode, setCompareMode] = useState(false)

  // ═══════════════════════════════════════════════════════════
  // SPEKTR GENERATORI
  // ═══════════════════════════════════════════════════════════
  const generateSpectrum = (region, includeK4 = false) => {
    const points = []
    const peaks = xpsPeaks[region]
    if (!peaks) return []

    const minBE = Math.min(...peaks.map(p => p.be)) - 8
    const maxBE = Math.max(...peaks.map(p => p.be)) + 15
    const steps = 200

    for (let i = 0; i <= steps; i++) {
      const be = minBE + (i / steps) * (maxBE - minBE)
      let intensity = 0

      peaks.forEach(peak => {
        const x = (be - peak.be) / peak.fwhm
        intensity += peak.intensity * Math.exp(-0.5 * x * x)
      })

      // K₄[Fe(CN)₆] qo'shilsa (solishtirish uchun)
      if (includeK4 && region === "Fe 2p") {
        const be_k4 = 708.2
        const x_k4 = (be - be_k4) / 1.5
        intensity += 0.9 * Math.exp(-0.5 * x_k4 * x_k4)
      }

      // Shake-up satellite (LS Fe³⁺ uchun juda kuchsiz)
      if (showSatellite && region === "Fe 2p") {
        const satBE = peaks[0].be + 6
        const xs = (be - satBE) / 2.5
        intensity += 0.06 * Math.exp(-0.5 * xs * xs)
      }

      // Fon (Shirley background)
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

  const maxIntensity = Math.max(...spectrum.map(p => p.intensity))

  // ═══════════════════════════════════════════════════════════
  // SURVEY SPEKTRI
  // ═══════════════════════════════════════════════════════════
  const generateSurveySpectrum = () => {
    const points = []
    const allPeaks = [
      { be: 709.8, intensity: 1.0, label: "Fe 2p", color: "#ef4444" },
      { be: 532.0, intensity: 0.6, label: "O 1s", color: "#f59e0b" },
      { be: 398.3, intensity: 1.3, label: "N 1s", color: "#3b82f6" },
      { be: 293.0, intensity: 0.7, label: "K 2p", color: "#a855f7" },
      { be: 285.8, intensity: 1.2, label: "C 1s", color: "#6b7280" }
    ]

    for (let i = 0; i <= 200; i++) {
      const be = 200 + (i / 200) * 600
      let intensity = 0.1 * (800 - be) / 600

      allPeaks.forEach(peak => {
        const x = (be - peak.be) / 3
        intensity += peak.intensity * Math.exp(-0.5 * x * x)
      })

      points.push({ be, intensity })
    }
    return points
  }

  const surveySpectrum = useMemo(() => generateSurveySpectrum(), [])
  const maxSurvey = Math.max(...surveySpectrum.map(p => p.intensity))

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* HEADER */}
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
            <span className="text-orange-400">K₃[Fe(CN)₆]</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-orange-400 flex items-center gap-3">
                <span className="text-3xl">🔬</span>
                <span>K₃[Fe(CN)₆]</span>
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Kaliy geksatsianoferrat(III) • Fe³⁺ (d⁵ LS) • Qizil qon tuzi
              </p>
            </div>
            <Link 
              href="/ilmiy/tahlil/xps/birikmalar"
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-700/50"
            >
              ← Birikmalar
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* STATISTIKA */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Metal</div>
            <div className="text-xl font-bold text-orange-400">Fe³⁺</div>
            <div className="text-xs text-purple-400">d⁵ (LS)</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Geometriya</div>
            <div className="text-xl font-bold text-blue-400">Oₕ</div>
            <div className="text-xs text-purple-400">Oktaedrik</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Fe 2p₃/₂ BE</div>
            <div className="text-xl font-bold text-orange-400 font-mono">709.8</div>
            <div className="text-xs text-purple-400">eV</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Magnit</div>
            <div className="text-xl font-bold text-red-400">S=1/2</div>
            <div className="text-xs text-purple-400">Paramagnit</div>
          </div>
        </div>

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Asosiy ma'lumotlar
          </h2>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed text-sm">
              <strong className="text-orange-400">K₃[Fe(CN)₆]</strong> (kaliy geksatsianoferrat(III)) — 
              <strong> "qizil qon tuzi"</strong> deb ataladi. K₄[Fe(CN)₆] ning <strong>oksidlangan shakli</strong>.
              Bu kompleksda Fe³⁺ ion oltita CN⁻ ligand bilan koordinatsiyalangan. CN⁻ kuchli maydon ligandi
              bo'lib, Fe³⁺ (d⁵) ni <strong className="text-orange-400">past spin (LS)</strong> holatga o'tkazadi:
              <strong className="text-orange-400"> t₂g⁵ e<sub>g</sub>⁰</strong>. Bitta toq elektron borligi sababli
              kompleks <strong>paramagnit</strong> hisoblanadi (S = 1/2).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-orange-400 font-bold mb-3">🧪 Kimyoviy xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Molekulyar massa:</span>
                  <span className="font-mono">329.26 g/mol</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Ligand:</span>
                  <span>6 × CN⁻</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Koordinatsion son:</span>
                  <span className="font-bold">6</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Oksidlanish darajasi:</span>
                  <span className="font-bold text-orange-400">+3</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-red-400">Qizil</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Sintez:</span>
                  <span>K₄[Fe(CN)₆] oksidlanishi</span>
                </li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-orange-400 font-bold mb-3">⚛️ Elektron struktura</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Konfiguratsiya:</span>
                  <span className="font-mono">d⁵ (t₂g⁵ e<sub>g</sub>⁰)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Spin holat:</span>
                  <span className="text-red-400 font-bold">Past spin (LS)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Umumiy spin:</span>
                  <span className="font-mono">S = 1/2</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">μ<sub>eff</sub>:</span>
                  <span className="font-mono">~1.73 BM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Δ<sub>o</sub>:</span>
                  <span className="font-mono">~35,000 cm⁻¹</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">CFSE:</span>
                  <span className="font-mono">-2.0 Δ<sub>o</sub> + 2P</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* XPS SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📊</span> XPS spektr simulyatori
          </h2>

          {/* Region selector */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
            {Object.keys(xpsPeaks).map(region => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedRegion === region
                    ? "bg-orange-600 text-white"
                    : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 mb-4">
            {selectedRegion === "Fe 2p" && (
              <>
                <label className="flex items-center gap-2 cursor-pointer bg-purple-800/30 px-3 py-2 rounded-lg">
                  <input
                    type="checkbox"
                    checked={showSatellite}
                    onChange={(e) => setShowSatellite(e.target.checked)}
                    className="accent-orange-500"
                  />
                  <span className="text-xs text-purple-300">Satellite ko'rsatish</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-purple-800/30 px-3 py-2 rounded-lg">
                  <input
                    type="checkbox"
                    checked={compareMode}
                    onChange={(e) => setCompareMode(e.target.checked)}
                    className="accent-orange-500"
                  />
                  <span className="text-xs text-purple-300">K₄[Fe(CN)₆] bilan solishtirish</span>
                </label>
              </>
            )}
            <label className="flex items-center gap-2 cursor-pointer bg-purple-800/30 px-3 py-2 rounded-lg">
              <input
                type="checkbox"
                checked={showSurvey}
                onChange={(e) => setShowSurvey(e.target.checked)}
                className="accent-orange-500"
              />
              <span className="text-xs text-purple-300">Survey spektr ko'rsatish</span>
            </label>
          </div>

          {/* Spektr */}
          <div className="bg-purple-950/50 rounded-xl p-4">
            {!showSurvey ? (
              <svg viewBox="0 0 600 300" className="w-full h-72">
                {/* Grid */}
                <line x1="60" y1="250" x2="580" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <line x1="60" y1="30" x2="60" y2="250" stroke="#4c1d95" strokeWidth="1" />
                
                <text x="320" y="285" fill="#c4b5fd" fontSize="11" textAnchor="middle">
                  Bog'lanish energiyasi (eV) →
                </text>
                <text x="25" y="140" fill="#c4b5fd" fontSize="10" textAnchor="middle" transform="rotate(-90, 25, 140)">
                  Intensivlik
                </text>

                {/* X-axis ticks */}
                {(() => {
                  const peaks = xpsPeaks[selectedRegion]
                  if (!peaks) return null
                  const minBE = Math.min(...peaks.map(p => p.be)) - 8
                  const maxBE = Math.max(...peaks.map(p => p.be)) + 15
                  const ticks = []
                  for (let be = Math.ceil(minBE / 2) * 2; be <= maxBE; be += 2) {
                    const x = 60 + ((be - minBE) / (maxBE - minBE)) * 520
                    ticks.push(
                      <g key={be}>
                        <line x1={x} y1="250" x2={x} y2="255" stroke="#6b7280" strokeWidth="1" />
                        <text x={x} y="268" fill="#9ca3af" fontSize="9" textAnchor="middle">
                          {be}
                        </text>
                      </g>
                    )
                  }
                  return ticks
                })()}

                {/* Fill under curve */}
                <polygon
                  points={
                    `60,250 ` +
                    spectrum.map((p, i) => {
                      const x = 60 + (i / 200) * 520
                      const y = 250 - (p.intensity / maxIntensity) * 210
                      return `${x},${y}`
                    }).join(' ') +
                    ` 580,250`
                  }
                  fill="#f97316"
                  opacity="0.15"
                />

                {/* Spektr chizig'i */}
                <polyline
                  points={spectrum.map((p, i) => {
                    const x = 60 + (i / 200) * 520
                    const y = 250 - (p.intensity / maxIntensity) * 210
                    return `${x},${y}`
                  }).join(' ')}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                />

                {/* Peak labels */}
                {xpsPeaks[selectedRegion]?.map((peak, i) => {
                  const peaks = xpsPeaks[selectedRegion]
                  const minBE = Math.min(...peaks.map(p => p.be)) - 8
                  const maxBE = Math.max(...peaks.map(p => p.be)) + 15
                  const x = 60 + ((peak.be - minBE) / (maxBE - minBE)) * 520
                  return (
                    <g key={i}>
                      <line x1={x} y1="30" x2={x} y2="250" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                      <text x={x} y="25" fill="#fbbf24" fontSize="10" textAnchor="middle" fontWeight="bold">
                        {peak.orbital}
                      </text>
                      <text x={x} y="15" fill="#fbbf24" fontSize="9" textAnchor="middle">
                        {peak.be} eV
                      </text>
                    </g>
                  )
                })}

                {/* Compare K₄ mode label */}
                {compareMode && selectedRegion === "Fe 2p" && (
                  <>
                    <text x="500" y="50" fill="#f97316" fontSize="10" textAnchor="end" fontWeight="bold">
                      K₃[Fe(CN)₆] (Fe³⁺)
                    </text>
                    <text x="500" y="65" fill="#eab308" fontSize="10" textAnchor="end">
                      K₄[Fe(CN)₆] (Fe²⁺)
                    </text>
                  </>
                )}
              </svg>
            ) : (
              <svg viewBox="0 0 600 300" className="w-full h-72">
                <line x1="60" y1="250" x2="580" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <line x1="60" y1="30" x2="60" y2="250" stroke="#4c1d95" strokeWidth="1" />
                
                <text x="320" y="285" fill="#c4b5fd" fontSize="11" textAnchor="middle">
                  Bog'lanish energiyasi (eV)
                </text>

                {/* Fill under curve */}
                <polygon
                  points={
                    `60,250 ` +
                    surveySpectrum.map((p, i) => {
                      const x = 60 + (i / 200) * 520
                      const y = 250 - (p.intensity / maxSurvey) * 210
                      return `${x},${y}`
                    }).join(' ') +
                    ` 580,250`
                  }
                  fill="#a855f7"
                  opacity="0.15"
                />

                <polyline
                  points={surveySpectrum.map((p, i) => {
                    const x = 60 + (i / 200) * 520
                    const y = 250 - (p.intensity / maxSurvey) * 210
                    return `${x},${y}`
                  }).join(' ')}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2"
                />

                {/* Peak labels */}
                {[
                  { be: 709.8, label: "Fe 2p", color: "#ef4444" },
                  { be: 532.0, label: "O 1s", color: "#f59e0b" },
                  { be: 398.3, label: "N 1s", color: "#3b82f6" },
                  { be: 293.0, label: "K 2p", color: "#a855f7" },
                  { be: 285.8, label: "C 1s", color: "#6b7280" }
                ].map((peak, i) => {
                  const x = 60 + ((peak.be - 200) / 600) * 520
                  return (
                    <g key={i}>
                      <line x1={x} y1="30" x2={x} y2="250" stroke={peak.color} strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                      <text x={x} y="25" fill={peak.color} fontSize="10" textAnchor="middle" fontWeight="bold">
                        {peak.label}
                      </text>
                    </g>
                  )
                })}
              </svg>
            )}
          </div>

          {/* Info grid */}
          {!showSurvey && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {xpsPeaks[selectedRegion]?.map((peak, i) => (
                <div key={i} className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-400 text-xs mb-1">{peak.orbital}</p>
                  <p className="text-orange-400 font-bold font-mono">{peak.be} eV</p>
                  <p className="text-purple-300 text-[10px]">{peak.assign}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SURVEY TARKIB */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>⚛️</span> Elementlar tarkibi (Survey XPS)
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {surveyData.map((el, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: el.color }}></div>
                  <p className="font-bold text-white">{el.element}</p>
                </div>
                <p className="text-purple-400 text-xs mb-1">{el.orbital}</p>
                <p className="text-orange-400 font-bold font-mono text-sm">{el.be} eV</p>
                <p className="text-purple-300 text-xs mt-1">
                  {el.atomic_percent.toFixed(1)} at.%
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-orange-600/10 border border-orange-500/30 rounded-lg p-3 text-xs text-purple-200">
            <p>
              <strong className="text-orange-400">💡 Nazariy nisbat:</strong> K₃[Fe(CN)₆] da 
              Fe:K:N:C = 1:3:6:6. O 1s signali namunadagi suv yoki sirt iflosliklaridan keladi.
            </p>
          </div>
        </div>

        {/* KRISTALL MAYDON DIAGRAMMASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📊</span> Kristall maydon diagrammasi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-950/50 rounded-xl p-5">
              <svg viewBox="0 0 300 350" className="w-full h-80">
                {/* Energiya o'qi */}
                <line x1="40" y1="30" x2="40" y2="300" stroke="#c4b5fd" strokeWidth="2" />
                <text x="20" y="165" fill="#c4b5fd" fontSize="11" textAnchor="middle" transform="rotate(-90, 20, 165)">
                  Energiya
                </text>

                {/* e_g orbitallar (yuqori) */}
                <line x1="100" y1="80" x2="220" y2="80" stroke="#ef4444" strokeWidth="3" />
                <line x1="100" y1="100" x2="220" y2="100" stroke="#ef4444" strokeWidth="3" />
                <text x="250" y="90" fill="#ef4444" fontSize="12" fontWeight="bold">
                  e<tspan baselineShift="sub" fontSize="8">g</tspan>
                </text>
                <text x="250" y="105" fill="#ef4444" fontSize="10">
                  (bo'sh)
                </text>

                {/* Δ_o belgisi */}
                <line x1="80" y1="90" x2="80" y2="210" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,3" />
                <text x="75" y="155" fill="#fbbf24" fontSize="11" textAnchor="end">
                  Δ<tspan baselineShift="sub" fontSize="8">o</tspan>
                </text>
                <text x="75" y="170" fill="#fbbf24" fontSize="9" textAnchor="end">
                  35,000 cm⁻¹
                </text>

                {/* t_2g orbitallar (past) */}
                <line x1="100" y1="200" x2="220" y2="200" stroke="#10b981" strokeWidth="3" />
                <line x1="100" y1="220" x2="220" y2="220" stroke="#10b981" strokeWidth="3" />
                <line x1="100" y1="240" x2="220" y2="240" stroke="#10b981" strokeWidth="3" />
                <text x="250" y="220" fill="#10b981" fontSize="12" fontWeight="bold">
                  t<tspan baselineShift="sub" fontSize="8">2g</tspan>
                </text>

                {/* Elektronlar (5 ta) - past spin */}
                <circle cx="130" cy="210" r="5" fill="#fbbf24" />
                <circle cx="150" cy="210" r="5" fill="#fbbf24" />
                <circle cx="130" cy="230" r="5" fill="#fbbf24" />
                <circle cx="150" cy="230" r="5" fill="#fbbf24" />
                <circle cx="130" cy="250" r="5" fill="#fbbf24" />
                {/* 6-chi joy bo'sh - bu LS d⁵ */}

                {/* Spin belgilari */}
                <text x="128" y="208" fill="#1a1a2e" fontSize="6" textAnchor="middle">↑</text>
                <text x="152" y="208" fill="#1a1a2e" fontSize="6" textAnchor="middle">↓</text>
                <text x="128" y="228" fill="#1a1a2e" fontSize="6" textAnchor="middle">↑</text>
                <text x="152" y="228" fill="#1a1a2e" fontSize="6" textAnchor="middle">↓</text>
                <text x="128" y="248" fill="#1a1a2e" fontSize="6" textAnchor="middle">↑</text>
                {/* 6-chi o'rinda ↓ yo'q - bitta toq elektron */}

                {/* Sifat */}
                <text x="160" y="285" fill="#c4b5fd" fontSize="11" textAnchor="middle" fontWeight="bold">
                  Fe³⁺ (d⁵ LS)
                </text>
                <text x="160" y="300" fill="#10b981" fontSize="10" textAnchor="middle">
                  t₂g⁵ e<tspan baselineShift="sub" fontSize="8">g</tspan>⁰
                </text>
                <text x="160" y="315" fill="#ef4444" fontSize="10" textAnchor="middle">
                  S = 1/2 (paramagnit)
                </text>
              </svg>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-orange-400 font-bold mb-3">Nima uchun past spin?</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong>CN⁻ ligandi</strong> spektrokimyoviy qatorda <strong>eng kuchli maydon</strong>
                  hosil qiladi. Δ<sub>o</sub> (35,000 cm⁻¹) pairing energiyasi P dan katta bo'lgani uchun,
                  5 elektron <strong>t₂g</strong> orbitallarga joylashadi. Bitta toq elektron qoladi (S = 1/2).
                </p>
              </div>

              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-orange-400 font-bold mb-3">CFSE hisoblash</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-purple-200">
                    CFSE = (n<sub>t₂g</sub> × -0.4 + n<sub>e<sub>g</sub></sub> × 0.6) × Δ<sub>o</sub> + pairing
                  </p>
                  <p className="text-purple-200">
                    = (5 × -0.4 + 0 × 0.6) × Δ<sub>o</sub> + 2P
                  </p>
                  <p className="text-orange-400 font-bold">
                    = -2.0 Δ<sub>o</sub> + 2P
                  </p>
                  <p className="text-purple-300 text-xs">
                    ≈ -70,000 cm⁻¹ + 2P (barqaror)
                  </p>
                </div>
              </div>

              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-5">
                <h3 className="text-red-400 font-bold mb-2">Paramagnitlik</h3>
                <p className="text-purple-200 text-xs leading-relaxed">
                  Bitta toq elektron borligi sababli <strong>μ<sub>eff</sub> ≈ 1.73 BM</strong>
                  (spin-only formula: μ = √(n(n+2)) = √3 ≈ 1.73). Bu EPR orqali ham tasdiqlanadi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SOLISHTIRISH K₄[Fe(CN)₆] */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🔄</span> K₃[Fe(CN)₆] vs K₄[Fe(CN)₆] — XPS solishtirish
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-left text-purple-300">Xususiyat</th>
                  <th className="py-3 px-4 text-center text-orange-400">K₃[Fe(CN)₆]</th>
                  <th className="py-3 px-4 text-center text-yellow-400">K₄[Fe(CN)₆]</th>
                  <th className="py-3 px-4 text-center text-purple-300">Farq</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-semibold">Oksidlanish darajasi</td>
                  <td className="py-3 px-4 text-center font-bold text-orange-400">Fe³⁺</td>
                  <td className="py-3 px-4 text-center font-bold text-yellow-400">Fe²⁺</td>
                  <td className="py-3 px-4 text-center">+1</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-semibold">d-elektronlar</td>
                  <td className="py-3 px-4 text-center">d⁵ (LS)</td>
                  <td className="py-3 px-4 text-center">d⁶ (LS)</td>
                  <td className="py-3 px-4 text-center">-1</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-semibold">Konfiguratsiya</td>
                  <td className="py-3 px-4 text-center font-mono">t₂g⁵</td>
                  <td className="py-3 px-4 text-center font-mono">t₂g⁶</td>
                  <td className="py-3 px-4 text-center">—</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-semibold">Spin</td>
                  <td className="py-3 px-4 text-center text-red-400">S=1/2 (paramagnit)</td>
                  <td className="py-3 px-4 text-center text-green-400">S=0 (diamagnit)</td>
                  <td className="py-3 px-4 text-center">—</td>
                </tr>
                <tr className="border-b border-purple-800/30 bg-orange-900/10">
                  <td className="py-3 px-4 font-semibold">Fe 2p₃/₂ BE</td>
                  <td className="py-3 px-4 text-center font-bold text-orange-400 font-mono">709.8 eV</td>
                  <td className="py-3 px-4 text-center font-bold text-yellow-400 font-mono">708.2 eV</td>
                  <td className="py-3 px-4 text-center text-red-400 font-bold">+1.6 eV</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-semibold">Satellit</td>
                  <td className="py-3 px-4 text-center">Juda kuchsiz</td>
                  <td className="py-3 px-4 text-center">Kuchsiz</td>
                  <td className="py-3 px-4 text-center">—</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-semibold">Rang</td>
                  <td className="py-3 px-4 text-center text-red-400">Qizil</td>
                  <td className="py-3 px-4 text-center text-yellow-400">Sariq</td>
                  <td className="py-3 px-4 text-center">—</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-semibold">CFSE</td>
                  <td className="py-3 px-4 text-center font-mono">-2.0Δ<sub>o</sub> + 2P</td>
                  <td className="py-3 px-4 text-center font-mono">-2.4Δ<sub>o</sub> + 2P</td>
                  <td className="py-3 px-4 text-center">+0.4Δ<sub>o</sub></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-amber-600/10 border border-amber-500/30 rounded-lg p-3 text-xs text-purple-200">
            <p>
              <strong className="text-amber-400">💡 Kimyoviy siljish:</strong> Fe³⁺ da bir elektron kam
              → yadro zaryadi kuchliroq seziladi → bog'lanish energiyasi <strong>1.6 eV ga oshadi</strong>.
              Bu <strong>+1.6 eV</strong> farq XPS orqali Fe²⁺/Fe³⁺ ni aniq farqlash imkonini beradi.
            </p>
          </div>
        </div>

        {/* REDOKS XUSUSIYATI */}
        <div className="bg-gradient-to-br from-red-900/30 to-purple-900/30 border border-red-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
            <span>⚡</span> Redoks juftlik: [Fe(CN)₆]³⁻ / [Fe(CN)₆]⁴⁻
          </h2>

          <div className="bg-purple-950/50 rounded-xl p-5 mb-4">
            <div className="text-center mb-4">
              <p className="text-purple-300 text-sm mb-2">Standart elektrod potensiali:</p>
              <p className="text-3xl font-bold font-mono text-red-400">
                E° = +0.36 V
              </p>
              <p className="text-purple-300 text-xs mt-2">
                (vs SHE, 25°C)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4 text-center">
                <p className="text-orange-400 font-bold mb-1">[Fe(CN)₆]³⁻</p>
                <p className="text-purple-300 text-xs">Oksidlangan shakl</p>
                <p className="text-white text-xs mt-1">Fe³⁺ (d⁵ LS)</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4 flex items-center justify-center">
                <p className="text-purple-300 font-mono">+ e⁻ ⇄</p>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4 text-center">
                <p className="text-yellow-400 font-bold mb-1">[Fe(CN)₆]⁴⁻</p>
                <p className="text-purple-300 text-xs">Qaytarilgan shakl</p>
                <p className="text-white text-xs mt-1">Fe²⁺ (d⁶ LS)</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs text-purple-200">
            <p>
              <strong className="text-yellow-400">💡 XPS da:</strong> Bu juftlikning har ikkala shaklini
              bir namunada kuzatish mumkin — <strong>aralash valentli</strong> holatlar uchun.
              [Fe(CN)₆]³⁻ va [Fe(CN)₆]⁴⁻ piklari 1.6 eV ga farq qiladi — bu <strong>XPS ning
              yuqori rezolyutsiyasi</strong>ni ko'rsatadi.
            </p>
          </div>
        </div>

        {/* QO'LLANILISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🏭</span> Amaliy qo'llanilishi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🔋</div>
              <h3 className="text-orange-400 font-bold mb-2 text-sm">Elektrokimyo</h3>
              <p className="text-purple-200 text-xs">
                <strong>Standart redoks juftlik</strong> — elektrokimyoviy sensorlar va
                biosensorlar uchun. Glukoza, H₂O₂, askorbin kislotasi aniqlash.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🧪</div>
              <h3 className="text-orange-400 font-bold mb-2 text-sm">Oksidlovchi agent</h3>
              <p className="text-purple-200 text-xs">
                Organik sintezda <strong>yumshoq oksidlovchi</strong> sifatida.
                Fenollarni xiononlarga oksidlash.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-orange-400 font-bold mb-2 text-sm">Pigmentlar</h3>
              <p className="text-purple-200 text-xs">
                <strong>Turnbull blue</strong> sintezi — Fe²⁺ bilan reaksiyaga kirishib,
                Prussian blue ga o'xshash pigment hosil qiladi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">⚗️</div>
              <h3 className="text-orange-400 font-bold mb-2 text-sm">Fotografiya</h3>
              <p className="text-purple-200 text-xs">
                <strong>Fotografik emulsiyalarda</strong> sensitizer sifatida.
                Kuchaytiruvchi eritmalarda ishlatiladi.
              </p>
            </div>
          </div>
        </div>

        {/* TARIX */}
        <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
            <span>📜</span> Tarixiy kontekst
          </h2>

          <div className="space-y-3 text-sm text-red-100/90">
            <p>
              <strong className="text-red-300">1822</strong> — Leopold Gmelin (Germaniya) birinchi bo'lib
              K₃[Fe(CN)₆] ni K₄[Fe(CN)₆] ni oksidlash orqali sintez qildi.
            </p>
            <p>
              <strong className="text-red-300">"Qizil qon tuzi"</strong> nomi — kristallarining
              qizil rangi va K₄[Fe(CN)₆] (sariq qon tuzi) bilan bog'liqligidan kelib chiqqan.
            </p>
            <p>
              <strong className="text-red-300">19-asr</strong> — tekstil sanoatida bo'yoq
              va metall sirtlarini ishlov berish uchun keng qo'llanilgan.
            </p>
            <p>
              <strong className="text-red-300">XPS tadqiqotlari:</strong> 1970-yillardan beri K₃[Fe(CN)₆]
              <strong> Fe³⁺ XPS standarti</strong> sifatida keng qo'llaniladi. K₄[Fe(CN)₆] bilan
              birgalikda <strong>Fe²⁺/Fe³⁺ kimyoviy siljish standartlari</strong>ni tashkil qiladi.
            </p>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>✅</span> Asosiy xulosalar
          </h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>K₃[Fe(CN)₆] — <strong className="text-orange-400">klassik past spinli Fe³⁺ kompleksi</strong></li>
            <li>Fe³⁺ (d⁵) — <strong>t₂g⁵ e<sub>g</sub>⁰</strong> konfiguratsiya, S=1/2, paramagnit</li>
            <li><strong>Fe 2p₃/₂ BE = 709.8 eV</strong> — LS Fe³⁺ uchun xarakterli</li>
            <li>SO splitting: <strong>13.1 eV</strong> (2p₃/₂ − 2p₁/₂)</li>
            <li>Satellit struktura <strong>juda kuchsiz</strong> (LS sababli)</li>
            <li>K₄[Fe(CN)₆] bilan <strong>BE farqi +1.6 eV</strong> — oksidlanish darajasi ta'siri</li>
            <li>Kuchli maydon (CN⁻) → katta Δ<sub>o</sub> (35,000 cm⁻¹)</li>
            <li>CFSE = <strong>-2.0 Δ<sub>o</sub> + 2P</strong> — barqaror</li>
            <li>Elektrokimyo, organik sintez, fotografiya da qo'llaniladi</li>
            <li>XPS da <strong>Fe³⁺ standarti</strong> sifatida ishlatiladi</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link 
            href="/ilmiy/tahlil/xps/birikmalar/fe-cn6-4" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← K₄[Fe(CN)₆]
          </Link>
          <Link 
            href="/ilmiy/tahlil/xps/birikmalar/fe-h2o6-2" 
            className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold"
          >
            Keyingi: [Fe(H₂O)₆]²⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}