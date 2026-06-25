"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════
// XPS MA'LUMOTLAR BAZASI — [Cu(NH₃)₄]²⁺
// ═══════════════════════════════════════════════════════════
const xpsPeaks = {
  "Cu 2p": [
    { orbital: "Cu 2p₃/₂", be: 934.0, intensity: 1.0, fwhm: 2.0, assign: "Cu²⁺ (d⁹)" },
    { orbital: "Cu 2p₁/₂", be: 953.8, intensity: 0.5, fwhm: 2.0, assign: "SO split (Δ=19.8 eV)" },
    { orbital: "Satellite S1", be: 941.5, intensity: 0.45, fwhm: 2.8, assign: "Shake-up (d⁹ diagnostik)" },
    { orbital: "Satellite S2", be: 944.0, intensity: 0.30, fwhm: 2.5, assign: "Shake-up (qo'shimcha)" }
  ],
  "N 1s": [
    { orbital: "N 1s (NH₃)", be: 399.8, intensity: 1.0, fwhm: 1.4, assign: "Koordinatsion NH₃" },
    { orbital: "N 1s (ads)", be: 401.5, intensity: 0.2, fwhm: 1.6, assign: "Adsorbsion NH₃" }
  ],
  "O 1s": [
    { orbital: "O 1s (H₂O)", be: 532.5, intensity: 0.6, fwhm: 1.6, assign: "Kristall H₂O" },
    { orbital: "O 1s (OH)", be: 531.3, intensity: 0.3, fwhm: 1.4, assign: "Sirt OH guruhi" }
  ]
}

const surveyData = [
  { element: "Cu", orbital: "2p₃/₂", be: 934.0, atomic_percent: 7.1, color: "#ef4444", desc: "Markaziy metal" },
  { element: "N", orbital: "1s", be: 399.8, atomic_percent: 28.6, color: "#3b82f6", desc: "Ligand NH₃" },
  { element: "O", orbital: "1s", be: 532.5, atomic_percent: 21.4, color: "#f59e0b", desc: "Kristall suv" },
  { element: "C", orbital: "1s", be: 285.0, atomic_percent: 35.7, color: "#6b7280", desc: "Sirt iflosligi" },
  { element: "S", orbital: "2p₃/₂", be: 168.5, atomic_percent: 7.1, color: "#eab308", desc: "SO₄²⁻ counterion" }
]

export default function CuNH3_4() {
  const [selectedRegion, setSelectedRegion] = useState("Cu 2p")
  const [showSatellites, setShowSatellites] = useState(true)
  const [showSurvey, setShowSurvey] = useState(false)
  const [compareMode, setCompareMode] = useState("none") // none, cu1, cu0

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
      if (refMode === "cu1" && region === "Cu 2p") {
        // Cu⁺ (d¹⁰) — satellite YO'Q
        const x1 = (be - 932.5) / 1.5
        intensity += 0.90 * Math.exp(-0.5 * x1 * x1)
        const x2 = (be - 952.3) / 1.5
        intensity += 0.45 * Math.exp(-0.5 * x2 * x2)
      } else if (refMode === "cu0" && region === "Cu 2p") {
        // Cu⁰ metall
        const x1 = (be - 932.6) / 1.3
        intensity += 0.85 * Math.exp(-0.5 * x1 * x1)
        const x2 = (be - 952.4) / 1.3
        intensity += 0.42 * Math.exp(-0.5 * x2 * x2)
        // Asimmetrik tail (metall uchun)
        if (be > 932.6) {
          intensity += 0.08 * Math.exp(-(be - 932.6) / 4)
        }
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
      { be: 934.0, intensity: 1.0, label: "Cu 2p", color: "#ef4444" },
      { be: 532.5, intensity: 0.8, label: "O 1s", color: "#f59e0b" },
      { be: 399.8, intensity: 1.2, label: "N 1s", color: "#3b82f6" },
      { be: 285.0, intensity: 1.3, label: "C 1s", color: "#6b7280" },
      { be: 168.5, intensity: 0.5, label: "S 2p", color: "#eab308" }
    ]
    for (let i = 0; i <= 250; i++) {
      const be = 100 + (i / 250) * 900
      let intensity = 0.05 * (1000 - be) / 900
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
            <span className="text-blue-400 font-semibold">[Cu(NH₃)₄]²⁺</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-400 flex items-center gap-3">
                <span className="text-3xl">🔬</span>
                <span>[Cu(NH₃)₄]²⁺</span>
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Tetraammismis(II) ioni • Cu²⁺ (d⁹) • Jahn-Teller • To'q ko'k rang
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
            <div className="text-xl font-bold text-blue-400">Cu²⁺</div>
            <div className="text-[10px] text-purple-400">d⁹</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Geometriya</div>
            <div className="text-xl font-bold text-cyan-400">D₄ₕ</div>
            <div className="text-[10px] text-purple-400">Tekis kvadrat</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Cu 2p₃/₂ BE</div>
            <div className="text-xl font-bold text-blue-400 font-mono">934.0</div>
            <div className="text-[10px] text-purple-400">eV</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Spin</div>
            <div className="text-xl font-bold text-red-400">S=½</div>
            <div className="text-[10px] text-purple-400">1 toq e⁻</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Rang</div>
            <div className="text-xl font-bold text-indigo-400">To'q ko'k</div>
            <div className="text-[10px] text-purple-400">Schweizer reaktivi</div>
          </div>
        </div>

        {/* ═════ ASOSIY MA'LUMOT ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Asosiy ma'lumotlar
          </h2>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed text-sm">
              <strong className="text-blue-400">[Cu(NH₃)₄]²⁺</strong> (tetraammismis(II) ioni) —
              Cu²⁺ ning ammiakli eritmasida hosil bo'ladigan <strong>to'q ko'k rangli</strong> kompleks.
              Cu²⁺ (d⁹) konfiguratsiyasi tufayli <strong>Jahn-Teller effekti</strong> kuchli namoyon bo'ladi:
              oktaedrik geometriya <strong>tekis kvadrat (D₄ₕ)</strong> shakliga buziladi.
              XPS da <strong>kuchli shake-up satellitlar (941-944 eV)</strong> bilan ajralib turadi —
              bu d⁹ konfiguratsiyasining eng muhim diagnostik belgisi. Cu⁺ (d¹⁰) va Cu⁰ da bu satellitlar yo'q.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-3">🧪 Kimyoviy xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Molekulyar massa:</span>
                  <span className="font-mono">131.68 g/mol (ion)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Ligand:</span>
                  <span>4 × NH₃</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Koordinatsion son:</span>
                  <span className="font-bold">4 (tekis kvadrat)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Oksidlanish darajasi:</span>
                  <span className="font-bold text-blue-400">+2</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-indigo-400 font-bold">To'q ko'k</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Barqarorlik:</span>
                  <span>log β₄ ≈ 13.1</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Simmetriya:</span>
                  <span className="font-mono">D₄ₕ</span>
                </li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-3">⚛️ Elektron struktura</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Konfiguratsiya:</span>
                  <span className="font-mono">d⁹</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">JT effekt:</span>
                  <span className="text-red-400 font-bold">Kuchli (D₄ₕ)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Umumiy spin:</span>
                  <span className="font-mono">S = ½</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Toq elektronlar:</span>
                  <span className="font-mono text-red-400 font-bold">1 ta</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">μ<sub>eff</sub>:</span>
                  <span className="font-mono">~1.73 BM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">λ<sub>max</sub> (UV-Vis):</span>
                  <span className="font-mono">~600 nm</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">SO splitting:</span>
                  <span className="font-mono">19.8 eV (2p)</span>
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
                  selectedRegion === region ? "bg-blue-600 text-white shadow-lg" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}>{region}</button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 mb-4">
            {selectedRegion === "Cu 2p" && (
              <>
                <label className="flex items-center gap-2 cursor-pointer bg-purple-800/30 px-3 py-2 rounded-lg border border-purple-700/30">
                  <input type="checkbox" checked={showSatellites} onChange={(e) => setShowSatellites(e.target.checked)} className="accent-blue-500" />
                  <span className="text-xs text-purple-300">Shake-up satellitlar (941-944 eV)</span>
                </label>
                <div className="flex gap-1">
                  <button onClick={() => setCompareMode("none")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "none" ? "bg-blue-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                    Yolg'iz
                  </button>
                  <button onClick={() => setCompareMode("cu1")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "cu1" ? "bg-orange-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                    vs Cu⁺ (d¹⁰)
                  </button>
                  <button onClick={() => setCompareMode("cu0")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "cu0" ? "bg-yellow-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                    vs Cu⁰ (metall)
                  </button>
                </div>
              </>
            )}
            <label className="flex items-center gap-2 cursor-pointer bg-purple-800/30 px-3 py-2 rounded-lg border border-purple-700/30">
              <input type="checkbox" checked={showSurvey} onChange={(e) => setShowSurvey(e.target.checked)} className="accent-blue-500" />
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
                <polygon points={`60,250 ` + spectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxIntensity) * 210}`).join(' ') + ` 580,250`} fill="#3b82f6" opacity="0.12" />

                {/* Main curve */}
                <polyline points={spectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxIntensity) * 210}`).join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2" />

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
                <text x="500" y="45" fill="#3b82f6" fontSize="9" textAnchor="end" fontWeight="bold">[Cu(NH₃)₄]²⁺ (Cu²⁺ d⁹)</text>
                {compareMode === "cu1" && <text x="500" y="60" fill="#f97316" fontSize="9" textAnchor="end">Cu⁺ (d¹⁰, no satellite)</text>}
                {compareMode === "cu0" && <text x="500" y="60" fill="#eab308" fontSize="9" textAnchor="end">Cu⁰ (metall)</text>}
              </svg>
            ) : (
              <svg viewBox="0 0 600 300" className="w-full h-72">
                <line x1="60" y1="250" x2="580" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <line x1="60" y1="30" x2="60" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <text x="320" y="285" fill="#c4b5fd" fontSize="11" textAnchor="middle">Bog'lanish energiyasi (eV)</text>
                <polygon points={`60,250 ` + surveySpectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxSurvey) * 210}`).join(' ') + ` 580,250`} fill="#a855f7" opacity="0.12" />
                <polyline points={surveySpectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxSurvey) * 210}`).join(' ')} fill="none" stroke="#a855f7" strokeWidth="2" />
                {[{ be: 934.0, label: "Cu 2p", color: "#ef4444" }, { be: 532.5, label: "O 1s", color: "#f59e0b" }, { be: 399.8, label: "N 1s", color: "#3b82f6" }, { be: 285.0, label: "C 1s", color: "#6b7280" }, { be: 168.5, label: "S 2p", color: "#eab308" }].map((peak, i) => {
                  const x = 60 + ((peak.be - 100) / 900) * 520
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
                  <p className={`${peak.assign.includes("Shake-up") ? "text-orange-400" : "text-blue-400"} font-bold font-mono text-lg`}>{peak.be} eV</p>
                  <p className="text-purple-300 text-[10px]">{peak.assign}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ═════ SHAKE-UP SATELLITLAR — D⁹ DIAGNOSTIKASI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📡</span> Shake-up satellitlar — d⁹ konfiguratsiya diagnostikasi
          </h2>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-blue-400">Cu²⁺ (d⁹)</strong> — XPS da eng oson aniqlanadigan oksidlanish darajalaridan biri.
              Sababi: d⁹ konfiguratsiyada <strong>kuchli shake-up satellitlar</strong> kuzatiladi (asosiy pikdan ~7-10 eV yuqorida).
              Bu satellitlar <strong>ligand-to-metal charge transfer (LMCT)</strong> jarayoni natijasida hosil bo'ladi:
              fotoelektron chiqarilganda, valent elektron liganddan metallga ko'chadi (d⁹ → d¹⁰L̄).
              <strong> Cu⁺ (d¹⁰) va Cu⁰ da bu satellitlar yo'q</strong> — chunki d-qobiq to'lgan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 text-sm">Cu²⁺ (d⁹)</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-purple-400">2p₃/₂ BE:</span><span className="text-blue-400 font-mono font-bold">934.0 eV</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Satellit:</span><span className="text-orange-400 font-bold">941-944 eV</span></div>
                <div className="flex justify-between"><span className="text-purple-400">I(sat)/I(main):</span><span className="text-orange-400 font-mono">~0.4-0.5</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Holat:</span><span className="text-green-400 font-bold">PARAMAGNIT</span></div>
              </div>
              <div className="mt-3 bg-blue-600/20 rounded p-2 text-[10px] text-blue-200">
                ✅ Kuchli satellit → d⁹ tasdiqlandi
              </div>
            </div>

            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3 text-sm">Cu⁺ (d¹⁰)</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-purple-400">2p₃/₂ BE:</span><span className="text-orange-400 font-mono font-bold">932.5 eV</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Satellit:</span><span className="text-green-400 font-bold">YO'Q</span></div>
                <div className="flex justify-between"><span className="text-purple-400">I(sat)/I(main):</span><span className="text-green-400 font-mono">0</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Holat:</span><span className="text-green-400 font-bold">DIAMAGNIT</span></div>
              </div>
              <div className="mt-3 bg-orange-600/20 rounded p-2 text-[10px] text-orange-200">
                ⚠️ Satellite yo'q + past BE → d¹⁰
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3 text-sm">Cu⁰ (metall)</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-purple-400">2p₃/₂ BE:</span><span className="text-yellow-400 font-mono font-bold">932.6 eV</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Satellit:</span><span className="text-green-400 font-bold">YO'Q</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Pik shakli:</span><span className="text-yellow-400 font-bold">Asimmetrik</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Holat:</span><span className="text-yellow-400 font-bold">METALL</span></div>
              </div>
              <div className="mt-3 bg-yellow-600/20 rounded p-2 text-[10px] text-yellow-200">
                ⚠️ Asimmetrik tail → metall holat
              </div>
            </div>
          </div>

          <div className="mt-4 bg-amber-600/10 border border-amber-500/30 rounded-lg p-4 text-xs text-purple-200">
            <p className="mb-2"><strong className="text-amber-400">💡 Cu oksidlanish darajasini aniqlash algoritmi:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li><strong>Satellit bormi?</strong> Ha → Cu²⁺ (d⁹). Yo'q → Cu⁺ yoki Cu⁰</li>
              <li><strong>BE qiymati?</strong> ~934 eV → Cu²⁺. ~932.5 eV → Cu⁺/Cu⁰</li>
              <li><strong>Pik shakli?</strong> Simmetrik → Cu⁺. Asimmetrik tail → Cu⁰</li>
              <li><strong>Auger parametri?</strong> Cu LMM Auger pik pozitsiyasi qo'shimcha tasdiq</li>
            </ol>
          </div>
        </div>

        {/* ═════ JAHN-TELLER EFFEKTI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🔷</span> Jahn-Teller effekti — nima uchun tekis kvadrat?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-950/50 rounded-xl p-5">
              <svg viewBox="0 0 300 380" className="w-full h-96">
                {/* Oktaedr (buzilgan) */}
                <text x="150" y="20" fill="#c4b5fd" fontSize="11" textAnchor="middle" fontWeight="bold">d⁹ — Jahn-Teller buzilishi</text>

                {/* O'qlar */}
                <line x1="150" y1="50" x2="150" y2="300" stroke="#6b7280" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="50" y1="175" x2="250" y2="175" stroke="#6b7280" strokeWidth="1" strokeDasharray="3,3" />

                {/* Markaziy Cu */}
                <circle cx="150" cy="175" r="12" fill="#3b82f6" />
                <text x="150" y="179" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">Cu²⁺</text>

                {/* Ekvatorial NH₃ (qisqa bog') */}
                <circle cx="80" cy="175" r="8" fill="#10b981" />
                <text x="80" y="178" fill="white" fontSize="7" textAnchor="middle">N</text>
                <line x1="92" y1="175" x2="138" y2="175" stroke="#10b981" strokeWidth="2" />

                <circle cx="220" cy="175" r="8" fill="#10b981" />
                <text x="220" y="178" fill="white" fontSize="7" textAnchor="middle">N</text>
                <line x1="162" y1="175" x2="208" y2="175" stroke="#10b981" strokeWidth="2" />

                {/* Aksial NH₃ (uzoq bog' — JT uzayishi) */}
                <circle cx="150" cy="70" r="8" fill="#10b981" opacity="0.5" />
                <text x="150" y="73" fill="white" fontSize="7" textAnchor="middle">N</text>
                <line x1="150" y1="82" x2="150" y2="163" stroke="#10b981" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />

                <circle cx="150" cy="280" r="8" fill="#10b981" opacity="0.5" />
                <text x="150" y="283" fill="white" fontSize="7" textAnchor="middle">N</text>
                <line x1="150" y1="187" x2="150" y2="268" stroke="#10b981" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />

                {/* Bog' uzunliklari */}
                <text x="110" y="165" fill="#10b981" fontSize="8" textAnchor="middle">2.0 Å</text>
                <text x="150" y="120" fill="#f59e0b" fontSize="8" textAnchor="middle">2.6 Å (uzun)</text>

                {/* Label */}
                <text x="150" y="330" fill="#3b82f6" fontSize="10" textAnchor="middle" fontWeight="bold">Tekis kvadrat (D₄ₕ)</text>
                <text x="150" y="348" fill="#f59e0b" fontSize="9" textAnchor="middle">Aksial bog'lar uzaygan</text>
                <text x="150" y="365" fill="#c4b5fd" fontSize="9" textAnchor="middle">4 ta qisqa + 2 ta uzun</text>
              </svg>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-blue-400 font-bold mb-3">Jahn-Teller teoremasi</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong>Teorema:</strong> Agar molekulaning asosiy holati degenerativ bo'lsa,
                  geometriya buziladi va degeneratsiya yo'qoladi.
                  <br/><br/>
                  <strong>d⁹ da:</strong> e<sub>g</sub> orbitalda 3 elektron → degenerativ →
                  oktaedr <strong>z-o'qi bo'ylab uzayadi</strong> → tekis kvadrat hosil bo'ladi.
                </p>
              </div>

              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-blue-400 font-bold mb-3">Energiya diagrammasi (D₄ₕ)</h3>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-red-400"><span>d<sub>x²-y²</sub></span><span>↑ (toq e⁻)</span></div>
                  <div className="h-px bg-purple-700/50 my-1"></div>
                  <div className="flex justify-between text-yellow-400"><span>d<sub>z²</sub></span><span>↑↓</span></div>
                  <div className="h-px bg-purple-700/50 my-1"></div>
                  <div className="flex justify-between text-green-400"><span>d<sub>xy</sub></span><span>↑↓</span></div>
                  <div className="h-px bg-purple-700/50 my-1"></div>
                  <div className="flex justify-between text-cyan-400"><span>d<sub>xz</sub>, d<sub>yz</sub></span><span>↑↓ ↑↓</span></div>
                </div>
                <p className="text-purple-300 text-[10px] mt-3">
                  d<sub>x²-y²</sub> — eng yuqori energiya, bitta toq elektron → paramagnit
                </p>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-5">
                <h3 className="text-blue-400 font-bold mb-2">XPS ga ta'siri</h3>
                <p className="text-purple-200 text-xs leading-relaxed">
                  JT buzilishi → <strong>Cu 2p piklari kengayadi</strong> (FWHM ≈ 2.0 eV).
                  Turli Cu-N bog' uzunliklari → turli kimyoviy muhitlar → pik broadening.
                  Bu <strong>tekis kvadrat geometriyaning</strong> XPS dagi belgisi.
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
                <p className="text-blue-400 font-bold font-mono text-sm">{el.be} eV</p>
                <p className="text-purple-300 text-xs mt-1">{el.atomic_percent.toFixed(1)} at.%</p>
                <p className="text-purple-500 text-[10px] mt-1">{el.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═════ CU OKSIDLANISH DARAJALARI SOLISHTIRISH ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>🔄</span> Cu oksidlanish darajalari — XPS solishtirish</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-left text-purple-300">Xususiyat</th>
                <th className="py-3 px-4 text-center text-yellow-400">Cu⁰</th>
                <th className="py-3 px-4 text-center text-orange-400">Cu⁺ (d¹⁰)</th>
                <th className="py-3 px-4 text-center text-blue-400">Cu²⁺ (d⁹)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Elektron konfiguratsiya", "[Ar]3d¹⁰4s¹", "d¹⁰", "d⁹"],
                  ["2p₃/₂ BE (eV)", "932.6", "932.5", "933.5-935.0"],
                  ["SO splitting (eV)", "19.8", "19.8", "19.8"],
                  ["Shake-up satellite", "Yo'q", "Yo'q", "Ha (941-944 eV)"],
                  ["I(sat)/I(main)", "0", "0", "0.3-0.6"],
                  ["Pik shakli", "Asimmetrik", "Simmetrik", "Kengaygan"],
                  ["Magnit xossasi", "Diamagnit", "Diamagnit", "Paramagnit"],
                  ["Rang", "Mis rang", "Rangsiz/oq", "Ko'k/yashil"],
                  ["Geometriya", "FCC metall", "Tetraedrik/chiziqli", "Tekis kvadrat/JT"],
                  ["Misol", "Cu foil", "Cu₂O, [Cu(CN)₄]³⁻", "[Cu(NH₃)₄]²⁺, CuO"]
                ].map((r, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${i === 3 || i === 4 ? 'bg-blue-900/10' : ''}`}>
                    <td className="py-2 px-4 font-semibold">{r[0]}</td>
                    <td className="py-2 px-4 text-center">{r[1]}</td>
                    <td className="py-2 px-4 text-center">{r[2]}</td>
                    <td className="py-2 px-4 text-center font-bold text-blue-400">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-amber-600/10 border border-amber-500/30 rounded-lg p-4 text-xs text-purple-200">
            <p><strong className="text-amber-400">💡 Asosiy diagnostik belgi:</strong> Shake-up satellitlar faqat <strong>Cu²⁺ (d⁹)</strong> da mavjud.
            Cu⁺ (d¹⁰) va Cu⁰ da d-qobiq to'lgan yoki deyarli to'lgan → LMCT mumkin emas → satellite yo'q.
            Bu XPS orqali Cu oksidlanish darajasini <strong>bir qiymatli aniqlash</strong> imkonini beradi.</p>
          </div>
        </div>

        {/* ═════ QO'LLANILISH ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>🏭</span> Amaliy qo'llanilishi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🧵</div>
              <h3 className="text-blue-400 font-bold mb-2 text-sm">Schweizer reaktivi</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                [Cu(NH₃)₄](OH)₂ — <strong>sellyuloza erituvchisi</strong>. Viskoza va rayron tola ishlab chiqarishda.
                Paxtani eritib, qayta shakllantirish mumkin.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🧪</div>
              <h3 className="text-blue-400 font-bold mb-2 text-sm">Analitik kimyo</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                Cu²⁺ uchun <strong>sifat reaksiyasi</strong> — NH₃ qo'shganda to'q ko'k rang.
                Spektrofotometrik aniqlash, kolorimetriya. Sezgirlik: 0.1 mg/L.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🔬</div>
              <h3 className="text-blue-400 font-bold mb-2 text-sm">Kataliz</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                Cu-ammin komplekslari <strong>oksidlanish katalizatorlari</strong>.
                Organik sintezda, polimerizatsiyada, ATRP jarayonlarida.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-blue-400 font-bold mb-2 text-sm">Pigmentlar</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                Mis-ammin komplekslari <strong>ko'k pigmentlar</strong> asosi.
                Keramik, shisha, bo'yoq sanoatida. Tarixiy: Misr ko'ki.
              </p>
            </div>
          </div>
        </div>

        {/* ═════ TARIX ═════ */}
        <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2"><span>📜</span> Tarixiy kontekst</h2>
          <div className="space-y-3 text-sm text-blue-100/90">
            <p><strong className="text-blue-300">1857</strong> — Matthias Eduard Schweizer [Cu(NH₃)₄](OH)₂ ni kashf etdi. Sellyuloza eritish xususiyati aniqlandi.</p>
            <p><strong className="text-blue-300">1890-yillar</strong> — Alfred Werner koordinatsion nazariyasida [Cu(NH₃)₄]²⁺ klassik misol bo'ldi.</p>
            <p><strong className="text-blue-300">1937</strong> — Hermann Jahn va Edward Teller JT effektini nazariy asosladi. d⁹ kompleksi bosh misol.</p>
            <p><strong className="text-blue-300">1970-yillar</strong> — XPS orqali Cu²⁺ shake-up satellitlari batafsil o'rganildi. d⁹ diagnostikasi standartlashtirildi.</p>
            <p><strong className="text-blue-300">Hozirgi kun</strong> — [Cu(NH₃)₄]²⁺ XPS da <strong>Cu²⁺ standarti</strong>. Kataliz, materialshunoslik, korroziya tadqiqotlarida.</p>
          </div>
        </div>

        {/* ═════ XULOSA ═════ */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span>✅</span> Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Cu(NH₃)₄]²⁺ — <strong className="text-blue-400">klassik d⁹ tekis kvadrat kompleks</strong></li>
            <li>Cu²⁺ (d⁹) — <strong>Jahn-Teller effekti</strong> kuchli, D₄ₕ simmetriya</li>
            <li><strong>Cu 2p₃/₂ BE = 934.0 eV</strong> — Cu²⁺ uchun xarakterli</li>
            <li><strong>Kuchli shake-up satellitlar (941-944 eV)</strong> — d⁹ ning asosiy diagnostik belgisi</li>
            <li>Cu⁺ (d¹⁰) va Cu⁰ da <strong>satellit yo'q</strong> — bir qiymatli farqlash</li>
            <li>SO splitting: <strong>19.8 eV</strong> (2p₃/₂ − 2p₁/₂)</li>
            <li>S = ½, μ ≈ <strong>1.73 BM</strong> — 1 ta toq elektron</li>
            <li>Schweizer reaktivi — sellyuloza erituvchisi</li>
            <li>XPS da <strong>Cu²⁺ standarti</strong> sifatida ishlatiladi</li>
            <li>JT effekti → pik kengayishi (FWHM ≈ 2.0 eV)</li>
          </ol>
        </div>

        {/* ═════ NAVIGATSIYA ═════ */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/xps/birikmalar/fe-h2o6-3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300">← [Fe(H₂O)₆]³⁺</Link>
          <Link href="/ilmiy/tahlil/xps/birikmalar/cu-cn-4" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">Keyingi: [Cu(CN)₄]³⁻ →</Link>
        </div>
      </section>
    </main>
  )
}