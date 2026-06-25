"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. EPR SPEKTR SIMULYATORI (Co²⁺ — S=3/2, katta ZFS)
// ============================================================================
function EPRSpektrSimulyatori() {
  const [gIsotropic, setGIsotropic] = useState(4.3)
  const [D, setD] = useState(15) // cm⁻¹
  const [A, setA] = useState(50) // Gauss, ⁵⁹Co gipernozik
  const [linewidth, setLinewidth] = useState(80)
  const [temperature, setTemperature] = useState(77)
  const [frequency, setFrequency] = useState("X") // X yoki Q-band

  const nuGHz = frequency === "X" ? 9.5 : 35
  const h = 6.626e-34
  const muB = 9.274e-24

  // Co²⁺ S=3/2 uchun ikkita asosiy o'tish:
  // 1. "g≈4.3" — ±1/2 ↔ ±3/2 o'tish (low-field)
  // 2. "g≈2.0" — ±1/2 ↔ ∓1/2 o'tish (high-field)
  const B_43 = (h * nuGHz * 1e9) / (gIsotropic * muB) * 1e4 // ~1550 G (X-band)
  const B_20 = (h * nuGHz * 1e9) / (2.0 * muB) * 1e4 // ~3370 G (X-band)

  // Haroratga bog'liq (Boltzmann taqsimoti)
  const k_B = 1.381e-23
  const D_J = D * 1.986e-23 // cm⁻¹ → J
  const boltzmannFactor = Math.exp(-D_J / (k_B * temperature))
  const intensityFactor = Math.min(1, 298 / temperature) * (1 + boltzmannFactor)

  // Spektr simulyatsiyasi
  const spectrum = useMemo(() => {
    const points = []
    const B_min = 500
    const B_max = 5000
    
    for (let i = 0; i < 600; i++) {
      const B = B_min + (i / 600) * (B_max - B_min)
      let signal = 0
      
      // g≈4.3 signali (8 ta gipernozik cho'qqi)
      for (let m = 0; m < 8; m++) {
        const B_shift = B_43 + (m - 3.5) * A
        const gauss = Math.exp(-0.5 * Math.pow((B - B_shift) / (linewidth / 2), 2))
        signal += gauss * 0.6 * intensityFactor
      }
      
      // g≈2.0 signali (8 ta gipernozik cho'qqi, kuchsizroq)
      for (let m = 0; m < 8; m++) {
        const B_shift = B_20 + (m - 3.5) * (A / 3)
        const gauss = Math.exp(-0.5 * Math.pow((B - B_shift) / (linewidth / 2), 2))
        signal += gauss * 0.3 * intensityFactor * boltzmannFactor
      }
      
      points.push({ B, signal })
    }
    return points
  }, [B_43, B_20, A, linewidth, intensityFactor, boltzmannFactor])

  const maxSignal = Math.max(...spectrum.map(p => p.signal), 0.01)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📡 EPR spektr simulyatori — Co²⁺ (S=3/2)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-cyan-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 Co²⁺ ning o'ziga xosligi:</p>
          <p className="text-purple-200 text-xs">
            Co²⁺ (d⁷ HS, S=3/2) — <strong>yarim butun spin</strong> sistemasi. Katta <strong>ZFS (D≈15 cm⁻¹)</strong>
            tufayli EPR spektrida <strong>ikkita alohida signal</strong> ko'rinadi:
            <br/>• <strong className="text-cyan-400">g≈4.3</strong> — "low-field" o'tish (asosiy)
            <br/>• <strong className="text-emerald-400">g≈2.0</strong> — "high-field" o'tish (kuchsiz, past T da)
            <br/>
            ⁵⁹Co (I=7/2) → har bir signalda <strong>8 ta gipernozik cho'qqi</strong>.
          </p>
        </div>

        {/* BAND TANLASH */}
        <div>
          <p className="text-purple-300 text-xs mb-2 font-semibold">Mikroto'lqin bandi:</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "X", label: "X-band", nu: "9.5 GHz", desc: "Standart" },
              { id: "Q", label: "Q-band", nu: "35 GHz", desc: "Yuqori chastota" },
            ].map(b => (
              <button key={b.id} onClick={() => setFrequency(b.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  frequency === b.id
                    ? "bg-cyan-600/80 text-white shadow-lg"
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                <div>{b.label} ({b.nu})</div>
                <div className="text-[9px] opacity-70 mt-1">{b.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* SLIDERLAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">g (asosiy):</span>
                <span className="text-emerald-400 font-mono">{gIsotropic.toFixed(2)}</span>
              </label>
              <input type="range" min="4.0" max="4.5" step="0.01" value={gIsotropic}
                onChange={(e) => setGIsotropic(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-cyan-500" />
              <p className="text-purple-400 text-[10px] mt-1">g≈4.3 — rhombic signal</p>
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">D (ZFS, sm⁻¹):</span>
                <span className="text-emerald-400 font-mono">{D}</span>
              </label>
              <input type="range" min="0" max="30" step="1" value={D}
                onChange={(e) => setD(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-cyan-500" />
              <p className="text-purple-400 text-[10px] mt-1">Katta D → g≈2.0 kuchsiz</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">A (⁵⁹Co, G):</span>
                <span className="text-emerald-400 font-mono">{A}</span>
              </label>
              <input type="range" min="10" max="100" step="1" value={A}
                onChange={(e) => setA(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-cyan-500" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">ΔB (G):</span>
                <span className="text-emerald-400 font-mono">{linewidth}</span>
              </label>
              <input type="range" min="20" max="200" step="5" value={linewidth}
                onChange={(e) => setLinewidth(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-cyan-500" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">Harorat (K):</span>
                <span className="text-emerald-400 font-mono">{temperature}</span>
              </label>
              <input type="range" min="4" max="300" step="1" value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-cyan-500" />
            </div>
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-cyan-400 font-bold text-xs mb-2">
            EPR spektri ({frequency}-band, {nuGHz} GHz):
          </h5>
          <svg viewBox="0 0 400 220" className="w-full h-52">
            <line x1="40" y1="110" x2="380" y2="110" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="40" y1="20" x2="40" y2="200" stroke="#4c1d95" strokeWidth="1" />
            <line x1="380" y1="20" x2="380" y2="200" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="215" fill="#c4b5fd" fontSize="9" textAnchor="middle">B (Gauss)</text>
            <text x="40" y="210" fill="#a78bfa" fontSize="8">500</text>
            <text x="380" y="210" fill="#a78bfa" fontSize="8" textAnchor="end">5000</text>

            {/* Absorbsiya */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 600) * 340
                const y = 110 - (p.signal / maxSignal) * 80
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.4"
            />

            {/* Birinchi hosila */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 600) * 340
                const next = spectrum[i + 1] || p
                const derivative = (next.signal - p.signal) * 500
                const y = 110 - (derivative / maxSignal) * 80
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#06b6d4" strokeWidth="2"
            />

            {/* g≈4.3 belgisi */}
            <line x1={40 + ((B_43 - 500) / 4500) * 340} y1="20" x2={40 + ((B_43 - 500) / 4500) * 340} y2="200"
              stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((B_43 - 500) / 4500) * 340} y="15" fill="#06b6d4" fontSize="9" textAnchor="middle" fontWeight="bold">
              g≈4.3
            </text>

            {/* g≈2.0 belgisi */}
            <line x1={40 + ((B_20 - 500) / 4500) * 340} y1="25" x2={40 + ((B_20 - 500) / 4500) * 340} y2="200"
              stroke="#10b981" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((B_20 - 500) / 4500) * 340} y="20" fill="#10b981" fontSize="9" textAnchor="middle" fontWeight="bold">
              g≈2.0
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
          <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-3">
            <p className="text-cyan-400">g≈4.3</p>
            <p className="text-emerald-400 font-bold font-mono">{B_43.toFixed(0)} G</p>
          </div>
          <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-3">
            <p className="text-emerald-400">g≈2.0</p>
            <p className="text-emerald-400 font-bold font-mono">{B_20.toFixed(0)} G</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-yellow-400">D</p>
            <p className="text-emerald-400 font-bold font-mono">{D} cm⁻¹</p>
          </div>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-400">A (⁵⁹Co)</p>
            <p className="text-emerald-400 font-bold font-mono">{A} G</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Kuzatishlar:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Harorat pastlashi</strong> → g≈2.0 signali kuchayadi (Boltzmann)</li>
            <li><strong>D oshsa</strong> → g≈2.0 signali kuchsizlanadi</li>
            <li><strong>Q-band</strong> → rezolyutsiya yaxshilanadi</li>
            <li>Har bir signalda <strong>8 ta cho'qqi</strong> (⁵⁹Co, I=7/2)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. ZFS ENERGIYA SATHLARI (S=3/2)
// ============================================================================
function ZFSEnergiya() {
  const [D, setD] = useState(15)
  const [E, setE] = useState(3)

  // S=3/2 uchun 4 ta sath: Ms = ±3/2, ±1/2
  const levels = useMemo(() => {
    // E(Ms) = D[Ms² - S(S+1)/3] + E term (rombik)
    const S = 1.5
    const S_term = S * (S + 1) / 3
    return [
      { Ms: 1.5, E: D * (2.25 - S_term) + E * 0.75 },
      { Ms: 0.5, E: D * (0.25 - S_term) - E * 0.75 },
      { Ms: -0.5, E: D * (0.25 - S_term) - E * 0.75 },
      { Ms: -1.5, E: D * (2.25 - S_term) + E * 0.75 },
    ]
  }, [D, E])

  const maxE = Math.max(...levels.map(l => Math.abs(l.E)), 1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ Nol-maydon bo'linishi — S=3/2</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-cyan-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-2">Spin Hamiltonian:</p>
          <p className="text-cyan-400 text-sm">Ĥ<sub>ZFS</sub> = D[Ŝ<sub>z</sub>² − S(S+1)/3] + E(Ŝ<sub>x</sub>² − Ŝ<sub>y</sub>²)</p>
          <p className="text-purple-400 text-xs mt-2">S = 3/2 → 4 ta sath (Ms = ±3/2, ±1/2)</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">D (sm⁻¹):</span>
              <span className="text-emerald-400 font-mono">{D}</span>
            </label>
            <input type="range" min="0" max="30" step="1" value={D}
              onChange={(e) => setD(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-cyan-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">E (sm⁻¹):</span>
              <span className="text-emerald-400 font-mono">{E}</span>
            </label>
            <input type="range" min="0" max={D/3 || 1} step="0.5" value={E}
              onChange={(e) => setE(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-cyan-500" />
          </div>
        </div>

        {/* Energiya diagrammasi */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-cyan-400 font-bold text-xs mb-2">Spin sathlari:</h5>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="50" y1="20" x2="50" y2="180" stroke="#4c1d95" strokeWidth="1" />
            <text x="30" y="100" fill="#c4b5fd" fontSize="9" textAnchor="middle" transform="rotate(-90, 30, 100)">
              Energiya
            </text>

            <line x1="50" y1="100" x2="380" y2="100" stroke="#7c3aed" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x="385" y="103" fill="#a78bfa" fontSize="8">E = 0</text>

            {levels.map((level, i) => {
              const y = 100 - (level.E / maxE) * 70
              const color = Math.abs(level.Ms) === 1.5 ? "#06b6d4" : "#f59e0b"
              return (
                <g key={i}>
                  <line x1="80" y1={y} x2="350" y2={y} stroke={color} strokeWidth="3" />
                  <text x="70" y={y + 4} fill={color} fontSize="10" textAnchor="end" fontWeight="bold">
                    M<sub>s</sub> = {level.Ms > 0 ? '+' : ''}{level.Ms}
                  </text>
                  <text x="360" y={y + 4} fill="#c4b5fd" fontSize="9">
                    {level.E.toFixed(1)} cm⁻¹
                  </text>
                </g>
              )
            })}

            {/* O'tishlar */}
            <line x1="200" y1={100 - (levels[0].E / maxE) * 70} x2="200" y2={100 - (levels[1].E / maxE) * 70}
              stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrowRed)" />
            <defs>
              <marker id="arrowRed" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#ef4444" />
              </marker>
            </defs>
            <text x="210" y={100 - (levels[0].E + levels[1].E) / 2 / maxE * 70} fill="#ef4444" fontSize="8">
              ΔE = {Math.abs(levels[0].E - levels[1].E).toFixed(1)} cm⁻¹
            </text>

            <text x="215" y="15" fill="#06b6d4" fontSize="10" textAnchor="middle" fontWeight="bold">
              D = {D} cm⁻¹ | E/D = {D > 0 ? (E / D).toFixed(2) : "—"}
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-3">
            <p className="text-cyan-400 font-bold mb-1">M<sub>s</sub> = ±3/2 (past)</p>
            <p className="text-purple-200 text-[10px]">
              D &gt; 0 bo'lsa, bu sathlar past energiyada. g≈4.3 o'tishi shu sathlar orasida.
            </p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">M<sub>s</sub> = ±1/2 (yuqori)</p>
            <p className="text-purple-200 text-[10px]">
              D &gt; 0 bo'lsa, yuqori energiya. g≈2.0 o'tishi shu sathlar orasida.
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun ikkita signal?</p>
          <p className="text-purple-200">
            Katta ZFS (D≈15 cm⁻¹) tufayli sathlar orasidagi energiya farqi katta.
            <br/>• <strong>g≈4.3</strong> — ±1/2 ↔ ±3/2 o'tish (X-band da ko'rinadi)
            <br/>• <strong>g≈2.0</strong> — +1/2 ↔ −1/2 o'tish (faqat past T da yoki Q-band da)
            <br/>
            Xona haroratida (298 K) g≈2.0 signali deyarli ko'rinmaydi — Boltzmann taqsimoti tufayli.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. GIPERNOZIK TUZILISH — ⁵⁹Co (I=7/2)
// ============================================================================
function GipernozikTuzilish() {
  const [A, setA] = useState(50)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 ⁵⁹Co gipernozik tuzilish — 8 cho'qqi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-cyan-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-cyan-400 font-bold text-xs mb-2">⁵⁹Co yadro xususiyatlari:</h5>
          <div className="grid grid-cols-3 gap-3 text-xs text-center">
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">Spin (I)</p>
              <p className="text-emerald-400 font-bold">7/2</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">Tabiiylik</p>
              <p className="text-emerald-400 font-bold">100%</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">Cho'qqilar</p>
              <p className="text-emerald-400 font-bold">2I+1 = 8</p>
            </div>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">A (G):</span>
            <span className="text-emerald-400 font-mono">{A}</span>
          </label>
          <input type="range" min="10" max="100" step="1" value={A}
            onChange={(e) => setA(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-cyan-500" />
        </div>

        {/* 8 CHO'QQI VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 150" className="w-full h-36">
            <line x1="40" y1="120" x2="360" y2="120" stroke="#4c1d95" strokeWidth="1" />
            
            {Array.from({ length: 8 }).map((_, i) => {
              const x = 60 + (i / 7) * 280
              return (
                <g key={i}>
                  <line x1={x} y1="120" x2={x} y2={120 - 80}
                    stroke="#06b6d4" strokeWidth="4" />
                  <text x={x} y="135" fill="#c4b5fd" fontSize="8" textAnchor="middle">
                    m<sub>I</sub>={3.5 - i}
                  </text>
                </g>
              )
            })}

            <text x="200" y="15" fill="#06b6d4" fontSize="10" textAnchor="middle" fontWeight="bold">
              8 ta cho'qqi (2I+1 = 8)
            </text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 ⁵⁹Co ning afzalligi:</p>
          <p className="text-purple-200">
            ⁵⁹Co <strong>100% tabiiy</strong>likka ega (⁵⁷Fe dan farqli — u atigi 2.1%).
            Shuning uchun Co²⁺ EPR spektrida <strong>gipernozik tuzilish aniq ko'rinadi</strong>.
            8 ta cho'qqi orasidagi masofa — <strong>A konstantasi</strong> — kovalentlik darajasini beradi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. TETRAEDRIK VS OKTAEDRIK
// ============================================================================
function TetraedrikVsOktaedrik() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Tetraedrik vs Oktaedrik Co²⁺</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-cyan-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-cyan-400">[CoCl₄]²⁻ (Tet)</th>
                <th className="text-center py-3 px-2 text-blue-400">[Co(H₂O)₆]²⁺ (Okta)</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Geometriya", "Tetraedrik", "Oktaedrik"],
                ["Simmetriya", "T<sub>d</sub>", "O<sub>h</sub>"],
                ["Rang", "Ko'k", "Pushti"],
                ["μ<sub>eff</sub>", "4.6 μ<sub>B</sub>", "4.8 μ<sub>B</sub>"],
                ["g-faktor", "g≈4.3, g≈2.0", "g≈2.0 (keng)"],
                ["ZFS (D)", "15 cm⁻¹ (katta)", "5 cm⁻¹ (kichik)"],
                ["A (⁵⁹Co)", "~50 G", "~80 G"],
                ["EPR ko'rinishi", "Aniq, 2 signal", "Keng, noaniq"],
                ["Harorat effekti", "Kuchli", "Kuchsiz"],
                ["Qo'llanilish", "EPR standart", "Magnit tadqiqot"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-cyan-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-blue-400">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-cyan-600/10 border border-cyan-500/30 rounded-lg p-3 text-xs">
          <p className="text-cyan-400 font-bold mb-1">💡 Nima uchun [CoCl₄]²⁻ EPR uchun yaxshi?</p>
          <p className="text-purple-200">
            Tetraedrik simmetriyada <strong>ZFS katta</strong> (D≈15 cm⁻¹) → sathlar aniq ajralgan.
            g≈4.3 signali <strong>ajratilgan, aniq</strong> ko'rinadi. Oktaedrik Co²⁺ da ZFS kichik,
            spektr <strong>keng va noaniq</strong> — o'rganish qiyin.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. TURLI Co²⁺ KOMPLEKSLAR SOLISHTIRISH
// ============================================================================
function SolishtirishJadvali() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Turli Co²⁺ komplekslar — EPR solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-cyan-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Kompleks</th>
                <th className="text-center py-3 px-2 text-yellow-400">Geometriya</th>
                <th className="text-center py-3 px-2 text-yellow-400">D (sm⁻¹)</th>
                <th className="text-center py-3 px-2 text-yellow-400">A (G)</th>
                <th className="text-left py-3 px-2 text-yellow-400">EPR xususiyati</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["[CoCl₄]²⁻", "Tetraedrik", "15", "50", "g≈4.3, 8 cho'qqi"],
                ["[CoBr₄]²⁻", "Tetraedrik", "20", "60", "Katta D, aniq"],
                ["[Co(NCS)₄]²⁻", "Tetraedrik", "12", "45", "O'rtacha"],
                ["[Co(H₂O)₆]²⁺", "Oktaedrik", "5", "80", "Keng signal"],
                ["[Co(en)₃]²⁺", "Oktaedrik", "8", "70", "Keng signal"],
                ["Co²⁺ shisha", "Aralash", "10-30", "40-70", "Murakkab"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 ${i === 0 ? 'bg-cyan-600/10' : ''} hover:bg-purple-800/20`}>
                  <td className="py-2 px-2 font-bold text-cyan-400">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-[11px]">{r[1]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[2]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[3]}</td>
                  <td className="py-2 px-2 text-[11px]">{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-purple-400 text-xs mt-3">
          * Tetraedrik Co²⁺ komplekslar <strong>EPR uchun eng qulay</strong> — aniq, ajratilgan signallar.
          Oktaedrik Co²⁺ da keng spektr — tahlil qilish qiyin.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// 6. AMALIY QO'LLANILISH
// ============================================================================
function AmaliyQollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 Co²⁺ EPR ning amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-cyan-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🧬</div>
            <h4 className="text-cyan-400 font-bold mb-2">Biologiya</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Vitamin B₁₂</strong> — Co³⁺/Co²⁺ EPR</li>
              <li><strong>Co-containing fermentlar</strong></li>
              <li><strong>Spin label</strong> — oqsillar dinamikasi</li>
              <li><strong>Shisha holat</strong> tadqiqoti</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚗️</div>
            <h4 className="text-cyan-400 font-bold mb-2">Kataliz</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Co-zeolitlar</strong> — NO<sub>x</sub> qaytarish</li>
              <li><strong>Fischer-Tropsch</strong> katalizatorlari</li>
              <li><strong>Co nanopartikullar</strong></li>
              <li><strong>Single-atom kataliz</strong></li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-cyan-400 font-bold mb-2">Materiallar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Co shishalari</strong> — EPR standart</li>
              <li><strong>Magnit materiallar</strong></li>
              <li><strong>Spin qoldiqlari</strong></li>
              <li><strong>Defektlar</strong> tadqiqi</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🌍</div>
            <h4 className="text-cyan-400 font-bold mb-2">Geologiya</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Minerallar</strong> — Co tarkibi</li>
              <li><strong>EPR dating</strong></li>
              <li><strong>Tuproq</strong> tahlili</li>
              <li><strong>Meteoritlar</strong></li>
            </ul>
          </div>
        </div>

        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-lg p-4">
          <p className="text-cyan-400 font-bold mb-2">🌟 Qiziqarli faktlar:</p>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• [CoCl₄]²⁻ — <strong>EPR ning "standart namuna"</strong> sifatida ishlatiladi</li>
            <li>• g≈4.3 signali — <strong>high-spin Co²⁺ ning "barmoq izi"</strong></li>
            <li>• ⁵⁹Co (100% tabiiy) — <strong>eng yaxshi gipernozik tuzilish</strong> ko'rsatadi</li>
            <li>• Vitamin B₁₂ — tabiatdagi <strong>yagona Co birikma</strong></li>
            <li>• Co²⁺ shishalari — <strong>kalibrlash standarti</strong> (g, A qiymatlari aniq)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function CoCl4EPR() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <nav className="flex items-center gap-2 text-sm flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300">Tahlil</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/epr" className="text-purple-400 hover:text-purple-300">EPR</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/epr/birikmalar" className="text-purple-400 hover:text-purple-300">Birikmalar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-cyan-400">[CoCl₄]²⁻</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">📡 [CoCl₄]²⁻ — EPR tahlili</h1>
          <p className="text-purple-400 text-sm">
            Co²⁺ (d⁷ HS, S=3/2) • Tetraedrik • Katta ZFS • g≈4.3, g≈2.0 • ⁵⁹Co (I=7/2)
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-cyan-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-cyan-400">[CoCl₄]²⁻</span>
            <div>
              <h2 className="text-xl font-bold text-white">EPR tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Tetraxlorokobaltat(II)" — high-spin Co²⁺ klassikasi</p>
            </div>
          </div>

          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [CoCl₄]²⁻ — <strong className="text-cyan-400">high-spin Co²⁺</strong> (d⁷, S=3/2) ning eng klassik namunasi.
              Tetraedrik geometriyada <strong>katta ZFS</strong> (D≈15 cm⁻¹) mavjud.
              EPR spektrida <strong>ikkita alohida signal</strong> ko'rinadi:
              <strong className="text-cyan-400"> g≈4.3</strong> (asosiy) va <strong className="text-emerald-400">g≈2.0</strong> (kuchsiz).
              ⁵⁹Co (I=7/2, 100% tabiiy) bilan har bir signalda <strong>8 ta gipernozik cho'qqi</strong> hosil bo'ladi.
              Bu kompleks <strong>EPR spektroskopiyasining standarti</strong> sifatida ishlatiladi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-cyan-400 font-bold text-lg">Co²⁺ (d⁷)</p>
              <p className="text-purple-300">S = 3/2</p>
              <p className="text-purple-400 mt-1">3 toq e⁻</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-cyan-400 font-bold text-lg">g≈4.3</p>
              <p className="text-purple-300">g≈2.0</p>
              <p className="text-purple-400 mt-1">2 signal</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-cyan-400 font-bold text-lg">D≈15</p>
              <p className="text-purple-300">sm⁻¹</p>
              <p className="text-purple-400 mt-1">katta ZFS</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-cyan-400 font-bold text-lg">⁵⁹Co</p>
              <p className="text-purple-300">I=7/2</p>
              <p className="text-purple-400 mt-1">8 cho'qqi</p>
            </div>
          </div>
        </div>

        {/* EPR SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EPRSpektrSimulyatori />
        </div>

        {/* ZFS ENERGIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ZFSEnergiya />
        </div>

        {/* GIPERNOZIK TUZILISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <GipernozikTuzilish />
        </div>

        {/* TETRAEDRIK VS OKTAEDRIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TetraedrikVsOktaedrik />
        </div>

        {/* SOLISHTIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SolishtirishJadvali />
        </div>

        {/* AMALIYOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AmaliyQollanilish />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Co²⁺ (d⁷ HS) — <strong className="text-cyan-400">S=3/2</strong> (yarim butun spin)</li>
            <li>Tetraedrik geometriya — <strong className="text-cyan-400">katta ZFS</strong> (D≈15 cm⁻¹)</li>
            <li><strong className="text-cyan-400">Ikki signal</strong>: g≈4.3 (asosiy), g≈2.0 (kuchsiz)</li>
            <li>⁵⁹Co (I=7/2, 100% tabiiy) → <strong>8 ta gipernozik cho'qqi</strong></li>
            <li>Harorat pastlashi → g≈2.0 signali kuchayadi (Boltzmann)</li>
            <li>Q-band (35 GHz) → rezolyutsiya yaxshilanadi</li>
            <li>Oktaedrik Co²⁺ dan farqli — <strong>aniq, ajratilgan spektr</strong></li>
            <li>EPR spektroskopiyasining <strong>standart namunasi</strong></li>
            <li>Amaliy: biologiya (B₁₂), kataliz, materiallar, geologiya</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/epr/birikmalar/cu-h2o6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Cu(H₂O)₆]²⁺
          </Link>
          <Link href="/ilmiy/tahlil/epr/birikmalar/cr-h2o6" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold">
            [Cr(H₂O)₆]³⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}