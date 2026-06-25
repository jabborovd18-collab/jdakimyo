"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. REZONANS KALKULYATORI (hν = gμBB)
// ============================================================================
function RezonansKalkulyatori() {
  const [nuGHz, setNuGHz] = useState(9.5) // X-band
  const [g, setG] = useState(2.0023)
  
  // Konstantalar
  const h = 6.626e-34      // J·s
  const muB = 9.274e-24    // J/T
  
  // B = hν / (g·μB)
  const nuHz = nuGHz * 1e9
  const B_Tesla = (h * nuHz) / (g * muB)
  const B_Gauss = B_Tesla * 1e4

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Rezonans kalkulyatori — hν = gμ<sub>B</sub>B</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-2">EPR rezonans sharti:</p>
          <p className="text-lime-400 text-xl">hν = g · μ<sub>B</sub> · B</p>
          <p className="text-purple-400 text-xs mt-2">→ B = hν / (g · μ<sub>B</sub>)</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Mikroto'lqin chastotasi (ν):</span>
              <span className="text-emerald-400 font-mono">{nuGHz.toFixed(2)} GHz</span>
            </label>
            <input type="range" min="1" max="95" step="0.5" value={nuGHz}
              onChange={(e) => setNuGHz(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-lime-500" />
            <div className="flex justify-between text-[10px] text-purple-400 mt-1">
              <span>L-band (1)</span>
              <span>X-band (9.5)</span>
              <span>Q-band (35)</span>
              <span>W-band (95)</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">g-faktor:</span>
              <span className="text-emerald-400 font-mono">{g.toFixed(4)}</span>
            </label>
            <input type="range" min="1.5" max="6" step="0.001" value={g}
              onChange={(e) => setG(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-lime-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-lime-900/40 border border-lime-500/40 rounded-lg p-4">
            <p className="text-lime-400 text-xs mb-1">Rezonans maydoni</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{B_Gauss.toFixed(0)}</p>
            <p className="text-purple-400 text-[10px]">Gauss</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4">
            <p className="text-purple-400 text-xs mb-1">Tesla</p>
            <p className="text-yellow-400 font-bold font-mono text-2xl">{B_Tesla.toFixed(4)}</p>
            <p className="text-purple-400 text-[10px]">T</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Standart bandlar:</p>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {[
              { name: "L-band", nu: 1.5, B: "~500 G" },
              { name: "X-band", nu: 9.5, B: "~3400 G" },
              { name: "Q-band", nu: 35, B: "~12500 G" },
              { name: "W-band", nu: 95, B: "~34000 G" },
            ].map((b, i) => (
              <div key={i} className={`rounded p-2 ${Math.abs(nuGHz - b.nu) < 1 ? 'bg-lime-600/30 border border-lime-500/50' : 'bg-purple-900/50'}`}>
                <p className="text-lime-400 font-bold text-[10px]">{b.name}</p>
                <p className="text-purple-200 text-[10px]">{b.nu} GHz</p>
                <p className="text-purple-400 text-[9px]">{b.B}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. EPR SPEKTR SIMULYATORI (interaktiv)
// ============================================================================
function EPRSpektrSimulyatori() {
  const [g, setG] = useState(2.05)
  const [A, setA] = useState(0) // Gauss
  const [I, setI] = useState(0) // yadro spini
  const [linewidth, setLinewidth] = useState(20) // Gauss
  const [nuclearLines, setNuclearLines] = useState(0) // ligand supergipernozik

  const nuGHz = 9.5
  const h = 6.626e-34
  const muB = 9.274e-24
  const B_center = (h * nuGHz * 1e9) / (g * muB) * 1e4 // Gauss

  // Cho'qqilar soni: 2I+1 (metall) × (nuclearLines+1) (ligand)
  const metalLines = I > 0 ? Math.round(2 * I + 1) : 1
  const totalLines = metalLines * (nuclearLines + 1)

  // Spektr nuqtalari
  const spectrum = useMemo(() => {
    const points = []
    const B_min = B_center - 500
    const B_max = B_center + 500
    
    for (let i = 0; i < 400; i++) {
      const B = B_min + (i / 400) * (B_max - B_min)
      let signal = 0
      
      // Metall gipernozik
      for (let m = 0; m < metalLines; m++) {
        const B_shift = B_center + (m - (metalLines - 1) / 2) * A
        
        // Ligand supergipernozik
        for (let n = 0; n <= nuclearLines; n++) {
          const B_final = B_shift + (n - nuclearLines / 2) * (A / 4)
          const gauss = Math.exp(-0.5 * Math.pow((B - B_final) / (linewidth / 2), 2))
          signal += gauss
        }
      }
      
      points.push({ B, signal: signal / totalLines })
    }
    return points
  }, [B_center, A, metalLines, linewidth, nuclearLines])

  const maxSignal = Math.max(...spectrum.map(p => p.signal), 0.01)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📡 EPR spektr simulyatori — interaktiv</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="flex justify-between text-[10px] mb-1">
              <span className="text-yellow-400">g:</span>
              <span className="text-emerald-400 font-mono">{g.toFixed(3)}</span>
            </label>
            <input type="range" min="1.9" max="2.4" step="0.001" value={g}
              onChange={(e) => setG(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-purple-900 rounded accent-lime-500" />
          </div>
          <div>
            <label className="flex justify-between text-[10px] mb-1">
              <span className="text-yellow-400">A (G):</span>
              <span className="text-emerald-400 font-mono">{A}</span>
            </label>
            <input type="range" min="0" max="200" step="5" value={A}
              onChange={(e) => setA(parseInt(e.target.value))}
              className="w-full h-1.5 bg-purple-900 rounded accent-lime-500" />
          </div>
          <div>
            <label className="flex justify-between text-[10px] mb-1">
              <span className="text-yellow-400">I (yadro):</span>
              <span className="text-emerald-400 font-mono">{I}</span>
            </label>
            <select value={I} onChange={(e) => setI(parseFloat(e.target.value))}
              className="w-full bg-purple-900 border border-purple-700 rounded px-1 py-0.5 text-[10px] text-white">
              <option value="0">0 (yo'q)</option>
              <option value="0.5">1/2 (¹H, ³¹P)</option>
              <option value="1">1 (¹⁴N, ²H)</option>
              <option value="1.5">3/2 (⁶³Cu)</option>
              <option value="2.5">5/2 (⁵⁵Mn)</option>
              <option value="3.5">7/2 (⁵⁹Co, ⁵¹V)</option>
            </select>
          </div>
          <div>
            <label className="flex justify-between text-[10px] mb-1">
              <span className="text-yellow-400">ΔB (G):</span>
              <span className="text-emerald-400 font-mono">{linewidth}</span>
            </label>
            <input type="range" min="5" max="80" step="1" value={linewidth}
              onChange={(e) => setLinewidth(parseInt(e.target.value))}
              className="w-full h-1.5 bg-purple-900 rounded accent-lime-500" />
          </div>
        </div>

        <div>
          <label className="flex justify-between text-[10px] mb-1">
            <span className="text-yellow-400">Ligand supergipernozik (N ta ekvivalent yadro, I=1/2):</span>
            <span className="text-emerald-400 font-mono">{nuclearLines}</span>
          </label>
          <input type="range" min="0" max="4" step="1" value={nuclearLines}
            onChange={(e) => setNuclearLines(parseInt(e.target.value))}
            className="w-full h-1.5 bg-purple-900 rounded accent-lime-500" />
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-lime-400 font-bold text-xs">EPR spektri (birinchi hosila)</h5>
            <p className="text-purple-400 text-[10px]">
              Jami cho'qqilar: <span className="text-lime-400 font-bold">{totalLines}</span>
              {" "}(2×{I}+1={metalLines}) × ({nuclearLines}+1={nuclearLines+1})
            </p>
          </div>
          
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="100" x2="380" y2="100" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="40" y1="20" x2="40" y2="180" stroke="#4c1d95" strokeWidth="1" />
            <line x1="380" y1="20" x2="380" y2="180" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">B (Gauss)</text>
            <text x="40" y="195" fill="#a78bfa" fontSize="8">{(B_center - 500).toFixed(0)}</text>
            <text x="380" y="195" fill="#a78bfa" fontSize="8" textAnchor="end">{(B_center + 500).toFixed(0)}</text>
            <text x="20" y="100" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 100)">dI/dB</text>

            {/* Absorbsiya egri chizig'i */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 400) * 340
                const y = 100 - (p.signal / maxSignal) * 70
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#84cc16" strokeWidth="1.5" opacity="0.4"
            />

            {/* Birinchi hosila (derivative) */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 400) * 340
                const next = spectrum[i + 1] || p
                const derivative = (next.signal - p.signal) * 500
                const y = 100 - (derivative / maxSignal) * 70
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#84cc16" strokeWidth="2"
            />

            {/* Markaz */}
            <line x1={40 + ((B_center - (B_center - 500)) / 1000) * 340} y1="20"
              x2={40 + ((B_center - (B_center - 500)) / 1000) * 340} y2="180"
              stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Kuzatishlar:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>g oshsa</strong> → spektr chapga siljiydi (kamroq maydon)</li>
            <li><strong>A oshsa</strong> → cho'qqilar orasi kengayadi</li>
            <li><strong>I oshsa</strong> → cho'qqilar soni ko'payadi (2I+1)</li>
            <li><strong>ΔB oshsa</strong> → cho'qqilar kengayadi, yomon ajraladi</li>
            <li><strong>Ligandlar</strong> → har bir cho'qqi ichida qo'shimcha tuzilish</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. GIPERNOZIK TUZILISH VIZUALIZATSIYASI
// ============================================================================
function GipernozikVizualizatsiya() {
  const [I, setI] = useState(1.5) // 63Cu
  const lines = Math.round(2 * I + 1)

  const isotoplar = [
    { name: "¹H, ³¹P, ¹⁹F", I: 0.5, lines: 2 },
    { name: "¹⁴N, ²H", I: 1, lines: 3 },
    { name: "⁶³Cu, ⁶⁵Cu", I: 1.5, lines: 4 },
    { name: "⁵⁵Mn", I: 2.5, lines: 6 },
    { name: "⁵⁹Co, ⁵¹V", I: 3.5, lines: 8 },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 Gipernozik tuzilish — 2I+1 qoidasi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-2">Gipernozik cho'qqilar soni:</p>
          <p className="text-lime-400 text-2xl">2I + 1 = {lines}</p>
          <p className="text-purple-400 text-xs mt-2">I = {I} (yadro spini)</p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Yadro spini (I):</span>
            <span className="text-emerald-400 font-mono">{I}</span>
          </label>
          <input type="range" min="0.5" max="3.5" step="0.5" value={I}
            onChange={(e) => setI(parseFloat(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-lime-500" />
        </div>

        {/* Cho'qqilar vizualizatsiyasi */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 150" className="w-full h-36">
            <line x1="40" y1="120" x2="360" y2="120" stroke="#4c1d95" strokeWidth="1" />
            
            {Array.from({ length: lines }).map((_, i) => {
              const x = 60 + (i / (lines - 1 || 1)) * 280
              const intensity = 1 // Bir xil intensivlik (soddalashtirilgan)
              return (
                <g key={i}>
                  <line x1={x} y1="120" x2={x} y2={120 - intensity * 80}
                    stroke="#84cc16" strokeWidth="3" />
                  <text x={x} y="135" fill="#c4b5fd" fontSize="8" textAnchor="middle">
                    m<sub>I</sub> = {(I - i).toFixed(I % 1 === 0 ? 0 : 1)}
                  </text>
                </g>
              )
            })}

            <text x="200" y="15" fill="#84cc16" fontSize="10" textAnchor="middle" fontWeight="bold">
              {lines} ta cho'qqi (2×{I}+1)
            </text>
          </svg>
        </div>

        {/* Izotoplar jadvali */}
        <div className="bg-purple-900/50 rounded-lg p-4">
          <h5 className="text-lime-400 font-bold text-xs mb-2">Keng tarqalgan EPR-faol yadrolar:</h5>
          <div className="grid grid-cols-5 gap-2">
            {isotoplar.map((iso, i) => (
              <div key={i} onClick={() => setI(iso.I)}
                className={`rounded p-2 text-center cursor-pointer transition-all ${
                  Math.abs(I - iso.I) < 0.01 
                    ? 'bg-lime-600/30 border border-lime-500/50' 
                    : 'bg-purple-900/50 hover:bg-purple-800/50'
                }`}>
                <p className="text-lime-400 font-bold text-[10px]">{iso.name}</p>
                <p className="text-purple-200 text-[10px]">I = {iso.I}</p>
                <p className="text-purple-400 text-[9px]">{iso.lines} cho'qqi</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Intensivlik taqsimoti:</p>
          <p className="text-purple-200">
            Ekvivalent yadrolar bo'lsa (masalan, 3 ta ¹H), intensivlik <strong>Pascal uchburchagi</strong>
            bo'yicha taqsimlanadi: 1:3:3:1. Lekin metall yadrosi bilan o'zaro ta'sirda barcha cho'qqilar
            deyarli bir xil intensivlikka ega.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. ZFS ENERGIYA SATHLARI
// ============================================================================
function ZFSEnergiya() {
  const [S, setS] = useState(1.5)
  const [D, setD] = useState(0.1) // cm⁻¹
  const [E, setE] = useState(0) // cm⁻¹

  // Energiya sathlari: E(Ms) = D[Ms² - S(S+1)/3]
  const levels = useMemo(() => {
    const result = []
    for (let Ms = -S; Ms <= S; Ms += 1) {
      const E_level = D * (Ms * Ms - S * (S + 1) / 3)
      result.push({ Ms, E: E_level })
    }
    return result
  }, [S, D])

  const maxE = Math.max(...levels.map(l => Math.abs(l.E)), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ Nol-maydon bo'linishi (ZFS) — S ≥ 1</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-2">Spin Hamiltonian:</p>
          <p className="text-lime-400 text-sm">Ĥ<sub>ZFS</sub> = D[Ŝ<sub>z</sub>² − S(S+1)/3] + E(Ŝ<sub>x</sub>² − Ŝ<sub>y</sub>²)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400">Spin (S):</span>
              <span className="text-emerald-400 font-mono">{S}</span>
            </label>
            <select value={S} onChange={(e) => setS(parseFloat(e.target.value))}
              className="w-full bg-purple-900 border border-purple-700 rounded px-2 py-1 text-xs text-white">
              <option value="1">1 (Ni²⁺, O₂)</option>
              <option value="1.5">3/2 (Co²⁺, Cr³⁺)</option>
              <option value="2">2 (Fe²⁺ HS, Mn³⁺)</option>
              <option value="2.5">5/2 (Fe³⁺ HS, Mn²⁺)</option>
            </select>
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400">D (sm⁻¹):</span>
              <span className="text-emerald-400 font-mono">{D.toFixed(2)}</span>
            </label>
            <input type="range" min="-1" max="1" step="0.01" value={D}
              onChange={(e) => setD(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-lime-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400">E (sm⁻¹):</span>
              <span className="text-emerald-400 font-mono">{E.toFixed(2)}</span>
            </label>
            <input type="range" min="0" max={Math.abs(D) / 3 || 0.01} step="0.01" value={E}
              onChange={(e) => setE(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-lime-500" />
          </div>
        </div>

        {/* Energiya diagrammasi */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-lime-400 font-bold text-xs mb-2">Spin sathlari:</h5>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="50" y1="20" x2="50" y2="180" stroke="#4c1d95" strokeWidth="1" />
            <text x="30" y="100" fill="#c4b5fd" fontSize="9" textAnchor="middle" transform="rotate(-90, 30, 100)">
              Energiya
            </text>

            {/* Nol chizig'i */}
            <line x1="50" y1="100" x2="380" y2="100" stroke="#7c3aed" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x="385" y="103" fill="#a78bfa" fontSize="8">E = 0</text>

            {/* Sathlar */}
            {levels.map((level, i) => {
              const y = 100 - (level.E / maxE) * 70
              const color = level.Ms === 0 ? "#fbbf24" : level.Ms > 0 ? "#84cc16" : "#ef4444"
              return (
                <g key={i}>
                  <line x1="80" y1={y} x2="350" y2={y} stroke={color} strokeWidth="3" />
                  <text x="70" y={y + 4} fill={color} fontSize="10" textAnchor="end" fontWeight="bold">
                    M<sub>s</sub> = {level.Ms}
                  </text>
                  <text x="360" y={y + 4} fill="#c4b5fd" fontSize="9">
                    {level.E.toFixed(3)} cm⁻¹
                  </text>
                </g>
              )
            })}

            <text x="215" y="15" fill="#84cc16" fontSize="10" textAnchor="middle" fontWeight="bold">
              D = {D.toFixed(2)} cm⁻¹ | E/D = {Math.abs(D) > 0 ? (E / Math.abs(D)).toFixed(2) : "—"}
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-lime-400 font-bold mb-1">D &gt; 0 (oson o'q)</p>
            <p className="text-purple-200 text-[10px]">
              M<sub>s</sub> = ±S past energiya → "oson o'q" anizotropiyasi
            </p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-lime-400 font-bold mb-1">D &lt; 0 (qiyin o'q)</p>
            <p className="text-purple-200 text-[10px]">
              M<sub>s</sub> = 0 past energiya → "qiyin o'q" anizotropiyasi
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 E/D nisbati nima anglatadi?</p>
          <p className="text-purple-200">
            <strong>E/D = 0</strong> — sof aksial simmetriya (oktaedrik, tetragonal).
            <strong> E/D = 1/3</strong> — maksimal rombik buzilish.
            Katta ZFS (|D| &gt; 1 cm⁻¹) → <strong>single-molecule magnet</strong> bo'lishi mumkin.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. g-FAKTOR JADVALI (interaktiv)
// ============================================================================
function GFactorJadvali() {
  const [filter, setFilter] = useState("hammasi")

  const komplekslar = [
    { ion: "Cu²⁺", config: "d⁹", S: "1/2", g: "g∥=2.30, g⊥=2.05", geom: "Cho'zilgan oktaedr", tip: "o'tish" },
    { ion: "VO²⁺", config: "d¹", S: "1/2", g: "g∥=1.95, g⊥=1.98", geom: "Kvadrat piramidal", tip: "o'tish" },
    { ion: "Cr³⁺", config: "d³", S: "3/2", g: "g≈1.98", geom: "Oktaedrik", tip: "o'tish" },
    { ion: "Mn²⁺", config: "d⁵ HS", S: "5/2", g: "g≈2.00, A=90 G", geom: "Oktaedrik", tip: "o'tish" },
    { ion: "Fe³⁺ HS", config: "d⁵", S: "5/2", g: "g≈2.0", geom: "Oktaedrik", tip: "o'tish" },
    { ion: "Fe³⁺ LS", config: "d⁵", S: "1/2", g: "g=2.76, 2.20, 2.00", geom: "Oktaedrik (rombik)", tip: "o'tish" },
    { ion: "Co²⁺", config: "d⁷ HS", S: "3/2", g: "g≈4.3, 2.0", geom: "Tetraedrik", tip: "o'tish" },
    { ion: "Ni²⁺", config: "d⁸", S: "1", g: "g≈2.2", geom: "Kvadrat planar", tip: "o'tish" },
    { ion: "Organik radikal", config: "π*", S: "1/2", g: "g≈2.003", geom: "Erkin radikal", tip: "organik" },
    { ion: "SEM (spin label)", config: "NO•", S: "1/2", g: "g∥=2.002, g⊥=2.006", geom: "Anizotrop", tip: "organik" },
  ]

  const filtered = filter === "hammasi" ? komplekslar : komplekslar.filter(k => k.tip === filter)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📋 g-Faktor jadvali — turli komplekslar</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30 space-y-4">
        <div className="flex gap-2">
          {[
            { id: "hammasi", label: "Hammasi" },
            { id: "o'tish", label: "O'tish metallari" },
            { id: "organik", label: "Organik radikallar" },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                filter === f.id ? 'bg-lime-600/80 text-white' : 'bg-purple-800/40 text-purple-300'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-2 px-2 text-yellow-400">Ion</th>
                <th className="text-center py-2 px-2 text-yellow-400">Konfig.</th>
                <th className="text-center py-2 px-2 text-yellow-400">S</th>
                <th className="text-left py-2 px-2 text-yellow-400">g-faktor</th>
                <th className="text-left py-2 px-2 text-yellow-400">Geometriya</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {filtered.map((k, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-lime-400">{k.ion}</td>
                  <td className="py-2 px-2 text-center font-mono">{k.config}</td>
                  <td className="py-2 px-2 text-center">{k.S}</td>
                  <td className="py-2 px-2 font-mono text-emerald-400">{k.g}</td>
                  <td className="py-2 px-2 text-[11px]">{k.geom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 g-faktor qanday ma'lumot beradi?</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>g ≈ 2.0</strong> — erkin elektron, kuchsiz spin-orbital coupling</li>
            <li><strong>g &gt; 2.1</strong> — kuchli spin-orbital coupling, orbital moment hissasi</li>
            <li><strong>g &lt; 2.0</strong> — liganddan metallga zaryad ko'chishi (LMCT)</li>
            <li><strong>g anizotropiyasi</strong> (g∥ ≠ g⊥) — past simmetriya, Yahn-Teller</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. ANIZOTROPIYA VIZUALIZATSIYASI
// ============================================================================
function Anizotropiya() {
  const [gParallel, setGParallel] = useState(2.3)
  const [gPerp, setGPerp] = useState(2.05)

  const gAverage = (gParallel + 2 * gPerp) / 3

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🎯 Anizotropiya — g∥ va g⊥</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">g<sub>∥</sub> (parallel, z-o'q):</span>
              <span className="text-emerald-400 font-mono">{gParallel.toFixed(3)}</span>
            </label>
            <input type="range" min="1.9" max="4" step="0.01" value={gParallel}
              onChange={(e) => setGParallel(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-lime-500" />

            <label className="flex justify-between text-xs mb-1 mt-3">
              <span className="text-yellow-400 font-bold">g<sub>⊥</sub> (perpendikulyar):</span>
              <span className="text-emerald-400 font-mono">{gPerp.toFixed(3)}</span>
            </label>
            <input type="range" min="1.9" max="4" step="0.01" value={gPerp}
              onChange={(e) => setGPerp(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-lime-500" />
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <h5 className="text-lime-400 font-bold text-xs mb-2">g-tenzor ellipsoidi:</h5>
            <svg viewBox="0 0 200 200" className="w-full h-40">
              {/* O'qlar */}
              <line x1="100" y1="20" x2="100" y2="180" stroke="#4c1d95" strokeWidth="1" />
              <line x1="20" y1="100" x2="180" y2="100" stroke="#4c1d95" strokeWidth="1" />
              <text x="105" y="15" fill="#c4b5fd" fontSize="9">z (g∥)</text>
              <text x="185" y="105" fill="#c4b5fd" fontSize="9">x,y (g⊥)</text>

              {/* Ellipsoid */}
              <ellipse cx="100" cy="100"
                rx={Math.min(80, Math.max(20, (gPerp - 1.9) * 60))}
                ry={Math.min(80, Math.max(20, (gParallel - 1.9) * 40))}
                fill="#84cc16" opacity="0.3" stroke="#84cc16" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-lime-900/30 border border-lime-500/30 rounded-lg p-3">
            <p className="text-lime-400">g<sub>∥</sub></p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{gParallel.toFixed(3)}</p>
          </div>
          <div className="bg-lime-900/30 border border-lime-500/30 rounded-lg p-3">
            <p className="text-lime-400">g<sub>⊥</sub></p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{gPerp.toFixed(3)}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">g<sub>av</sub></p>
            <p className="text-yellow-400 font-bold font-mono text-lg">{gAverage.toFixed(3)}</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Anizotropiya nima haqida gapiradi?</p>
          <p className="text-purple-200">
            <strong>g<sub>∥</sub> &gt; g<sub>⊥</sub> &gt; 2.0</strong> — cho'zilgan oktaedr, toq elektron d<sub>x²-y²</sub> da
            (Cu²⁺ klassik misol).
            <strong> g<sub>⊥</sub> &gt; g<sub>∥</sub> &gt; 2.0</strong> — qisqargan oktaedr, toq elektron d<sub>z²</sub> da.
            <strong> g<sub>∥</sub> = g<sub>⊥</sub></strong> — izotrop, yuqori simmetriya.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. EPR VS NMR SOLISHTIRISH
// ============================================================================
function EPRvsNMR() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 EPR vs NMR — qiyosiy tahlil</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-lime-400">EPR</th>
                <th className="text-center py-3 px-2 text-blue-400">NMR</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["O'rganiladigan zarracha", "Elektron (S)", "Yadro (I)"],
                ["Rezonans chastotasi", "~9.5 GHz (X-band)", "100-900 MHz"],
                ["Magnit maydon", "~0.34 T (X-band)", "2.3-21 T"],
                ["Sezgirlik", "~10¹¹ spin", "~10¹⁸ yadro"],
                ["Namuna miqdori", "~1 mg", "~10-100 mg"],
                ["Qo'llanilishi", "Paramagnit (toq e⁻)", "Diamagnit (juft e⁻)"],
                ["Vaqt shkalasi", "~10⁻⁹ s", "~10⁻³ s"],
                ["Tipik cho'qqi kengligi", "1-100 G", "0.1-10 Hz"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-lime-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-blue-400">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-lime-400 font-bold text-xs mb-2">Asosiy farq:</h5>
          <p className="text-purple-200 text-xs">
            Elektron magnit momenti yadro magnit momentidan <strong>~1000 marta katta</strong>.
            Shuning uchun EPR sezgirligi NMR dan <strong>million marta yuqori</strong>.
            EPR faqat <strong>paramagnit</strong> (toq elektronli) sistemalarda ishlaydi,
            NMR esa <strong>diamagnit</strong> (juft elektronli) sistemalarda.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 8. AMALIY QO'LLANILISH
// ============================================================================
function AmaliyQollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 EPR ning amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🧬</div>
            <h4 className="text-lime-400 font-bold mb-2">Biologiya</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Spin label</strong> — oqsillar dinamikasi</li>
              <li><strong>Metall fermentlar</strong> — gemoglobin, sitoxrom</li>
              <li><strong>Erkin radikallar</strong> — ROS, antioksidantlar</li>
              <li><strong>EPR imaging</strong> — tibbiy diagnostika</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚗️</div>
            <h4 className="text-lime-400 font-bold mb-2">Kataliz</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>O'tish metallari</strong> — katalitik markazlar</li>
              <li><strong>Radikal oraliq mahsulotlar</strong></li>
              <li><strong>Single-atom kataliz</strong></li>
              <li><strong>Fotokataliz</strong> mexanizmlari</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-lime-400 font-bold mb-2">Materiallar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Single-molecule magnets</strong></li>
              <li><strong>Defektlar</strong> — yarimo'tkazgichlar</li>
              <li><strong>Nanopartikullar</strong> — o'lcham effekti</li>
              <li><strong>Superconductors</strong></li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🌍</div>
            <h4 className="text-lime-400 font-bold mb-2">Geologiya</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Minerallar</strong> — tarkibi, tuzilishi</li>
              <li><strong>EPR dating</strong> — yoshini aniqlash</li>
              <li><strong>Radiatsiya dozimetriyasi</strong></li>
              <li><strong>Meteoritlar</strong> tahlili</li>
            </ul>
          </div>
        </div>

        <div className="bg-lime-600/10 border border-lime-500/30 rounded-lg p-4">
          <p className="text-lime-400 font-bold mb-2">🌟 Qiziqarli faktlar:</p>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• EPR 1944 yilda <strong>Y.K. Zavoisky</strong> (Qozon universiteti) tomonidan kashf etilgan</li>
            <li>• Zavoisky keyinchalik <strong>Nobel mukofotiga</strong> nomzod bo'lgan</li>
            <li>• Dunyoda har yili <strong>10,000+ EPR maqola</strong> chop etiladi</li>
            <li>• <strong>Eng sezgir EPR</strong> — bitta spin ni aniqlay oladi!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function EPRSpektroskopiya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg">← Tahlil usullari</Link>
        <div>
          <h1 className="text-2xl font-bold text-lime-400">📡 EPR spektroskopiya</h1>
          <p className="text-purple-400 text-sm">
            Elektron Paramagnit Rezonans • g-faktor • Gipernozik tuzilish • ZFS • Anizotropiya
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* BIRIKMALAR KARTASI */}
        <Link
          href="/ilmiy/tahlil/epr/birikmalar"
          className="group block bg-gradient-to-r from-lime-900/40 to-purple-900/40 border border-lime-700/50 rounded-2xl p-6 hover:bg-lime-900/60 hover:border-lime-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-lime-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">📡</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-lime-400 group-hover:text-lime-300 transition-colors">
                Birikmalarning EPR spektroskopik tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Har bir birikmaning EPR spektri, g-faktor, gipernozik tuzilish va ZFS parametrlari batafsil.
              </p>
            </div>
            <div className="text-3xl text-lime-400 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-lime-600/20 text-lime-400 border border-lime-600/30 px-3 py-1 rounded-full text-xs">12 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">g-faktor</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Gipernozik</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">ZFS</span>
          </div>
        </Link>

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 EPR spektroskopiya haqida</h2>

          <div className="bg-lime-600/10 border border-lime-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-lime-400">Elektron Paramagnit Rezonans (EPR)</strong> — faqat <strong>toq elektronlarga</strong> ega
              bo'lgan moddalarni o'rganish uchun eng sezgir spektroskopik usul.
              Paramagnit komplekslar (Cu²⁺, Cr³⁺, Fe³⁺, Co²⁺, Mn²⁺, VO²⁺, organik radikallar)
              EPR signal beradi. <strong>Diamagnit</strong> (d⁰, d⁶ LS, d⁸ kvadrat, d¹⁰) komplekslar
              EPR da <strong>ko'rinmaydi</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-lime-400 font-bold text-2xl">~10¹¹</p>
              <p className="text-purple-300 text-xs">spin sezgirlik</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-lime-400 font-bold text-2xl">1944</p>
              <p className="text-purple-300 text-xs">kashf etilgan (Zavoisky)</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-lime-400 font-bold text-2xl">X-band</p>
              <p className="text-purple-300 text-xs">9.5 GHz standart</p>
            </div>
          </div>
        </div>

        {/* REZONANS KALKULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <RezonansKalkulyatori />
        </div>

        {/* EPR SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EPRSpektrSimulyatori />
        </div>

        {/* GIPERNOZIK VIZUALIZATSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <GipernozikVizualizatsiya />
        </div>

        {/* ZFS ENERGIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ZFSEnergiya />
        </div>

        {/* ANIZOTROPIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Anizotropiya />
        </div>

        {/* g-FAKTOR JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <GFactorJadvali />
        </div>

        {/* EPR vs NMR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EPRvsNMR />
        </div>

        {/* AMALIY QO'LLANILISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AmaliyQollanilish />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-lime-600/10 to-purple-600/10 border border-lime-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>EPR — <strong className="text-lime-400">faqat paramagnit</strong> (toq elektronli) komplekslar uchun</li>
            <li>Rezonans sharti: <strong>hν = gμ<sub>B</sub>B</strong> — chastota va maydon bog'langan</li>
            <li><strong>g-faktor</strong> — elektron konfiguratsiya, geometriya, simmetriya ko'rsatkichi</li>
            <li><strong>Gipernozik tuzilish (A)</strong> — 2I+1 cho'qqi, kovalentlik darajasi</li>
            <li><strong>ZFS (D, E)</strong> — S≥1 sistemalar uchun nol-maydon bo'linishi</li>
            <li><strong>Anizotropiya</strong> (g∥ ≠ g⊥) — past simmetriya, Yahn-Teller belgisi</li>
            <li>EPR sezgirligi NMR dan <strong>million marta yuqori</strong></li>
            <li>Qo'llanilishi: biologiya, kataliz, materialshunoslik, geologiya</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/cd" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← CD spektroskopiya
          </Link>
          <Link href="/ilmiy/tahlil/mossbauer" className="px-6 py-3 bg-lime-600/80 rounded-xl hover:bg-lime-500 text-white font-semibold">
            Mössbauer spektroskopiya →
          </Link>
        </div>

      </section>
    </main>
  )
}