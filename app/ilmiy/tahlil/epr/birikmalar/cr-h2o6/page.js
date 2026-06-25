"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. EPR SPEKTR SIMULYATORI (Cr³⁺ — S=3/2, kichik ZFS)
// ============================================================================
function EPRSpektrSimulyatori() {
  const [gParallel, setGParallel] = useState(1.983)
  const [gPerp, setGPerp] = useState(1.980)
  const [A, setA] = useState(16) // Gauss, ⁵³Cr gipernozik
  const [linewidth, setLinewidth] = useState(25)
  const [showCr53, setShowCr53] = useState(false) // ⁵³Cr gipernozik ko'rsatish
  const [temperature, setTemperature] = useState(298)

  const nuGHz = 9.5
  const h = 6.626e-34
  const muB = 9.274e-24

  // Rezonans maydonlari
  const BParallel = (h * nuGHz * 1e9) / (gParallel * muB) * 1e4
  const BPerp = (h * nuGHz * 1e9) / (gPerp * muB) * 1e4

  // Cr³⁺ S=3/2, lekin D kichik → asosan "allowed" ΔMs=±1 o'tishlar
  // 3 ta o'tish: -3/2↔-1/2, -1/2↔+1/2, +1/2↔+3/2
  // Harorat effekti (Boltzmann)
  const intensityFactor = 298 / temperature

  // Spektr simulyatsiyasi
  const spectrum = useMemo(() => {
    const points = []
    const B_min = 3000
    const B_max = 3800
    
    for (let i = 0; i < 500; i++) {
      const B = B_min + (i / 500) * (B_max - B_min)
      let signal = 0
      
      // Powder spektr — parallel va perpendikulyar aralashmasi
      // Parallel komponent (1/3 hissa)
      if (showCr53) {
        // ⁵³Cr bilan (I=3/2 → 4 cho'qqi, lekin 9.5% tabiiy)
        for (let m = 0; m < 4; m++) {
          const B_shift = BParallel + (m - 1.5) * A
          const gauss = Math.exp(-0.5 * Math.pow((B - B_shift) / (linewidth / 2), 2))
          signal += gauss * 0.33 * 0.095 * intensityFactor // 9.5% tabiiy
        }
      } else {
        // ⁵²Cr (I=0 → 1 cho'qqi, 83.8% tabiiy)
        const gauss = Math.exp(-0.5 * Math.pow((B - BParallel) / (linewidth / 2), 2))
        signal += gauss * 0.33 * 0.838 * intensityFactor
      }
      
      // Perpendicular komponent (2/3 hissa)
      if (showCr53) {
        for (let m = 0; m < 4; m++) {
          const B_shift = BPerp + (m - 1.5) * (A / 3)
          const gauss = Math.exp(-0.5 * Math.pow((B - B_shift) / (linewidth / 2), 2))
          signal += gauss * 0.67 * 0.095 * intensityFactor
        }
      } else {
        const gauss = Math.exp(-0.5 * Math.pow((B - BPerp) / (linewidth / 2), 2))
        signal += gauss * 0.67 * 0.838 * intensityFactor
      }
      
      points.push({ B, signal })
    }
    return points
  }, [BParallel, BPerp, A, linewidth, intensityFactor, showCr53])

  const maxSignal = Math.max(...spectrum.map(p => p.signal), 0.01)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📡 EPR spektr simulyatori — Cr³⁺ (S=3/2)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 Cr³⁺ ning o'ziga xosligi:</p>
          <p className="text-purple-200 text-xs">
            Cr³⁺ (d³, S=3/2) — <strong>⁴A₂g ground state</strong> (A term). Orbital moment <strong>to'liq so'ngan</strong>,
            shuning uchun <strong>g-faktor g<sub>e</sub>=2.0023 ga juda yaqin</strong>. ZFS <strong>juda kichik</strong>
            (D≈0.2 cm⁻¹) — Co²⁺ dan 100 marta kichik! Spektr <strong>izotropga yaqin</strong>,
            lekin kuchsiz anizotropiya (g∥ ≈ 1.983, g⊥ ≈ 1.980) mavjud.
          </p>
        </div>

        {/* IZOTOP TANLASH */}
        <div>
          <p className="text-purple-300 text-xs mb-2 font-semibold">Cr izotopi:</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setShowCr53(false)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                !showCr53 ? "bg-emerald-600/80 text-white shadow-lg" : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              <div>⁵²Cr (I=0, 83.8%)</div>
              <div className="text-[9px] opacity-70 mt-1">Gipernozik yo'q — 1 cho'qqi</div>
            </button>
            <button onClick={() => setShowCr53(true)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                showCr53 ? "bg-emerald-600/80 text-white shadow-lg" : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              <div>⁵³Cr (I=3/2, 9.5%)</div>
              <div className="text-[9px] opacity-70 mt-1">Gipernozik bor — 4 cho'qqi (kuchsiz)</div>
            </button>
          </div>
        </div>

        {/* SLIDERLAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">g<sub>∥</sub> (parallel):</span>
                <span className="text-emerald-400 font-mono">{gParallel.toFixed(3)}</span>
              </label>
              <input type="range" min="1.95" max="2.02" step="0.001" value={gParallel}
                onChange={(e) => setGParallel(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
              <p className="text-purple-400 text-[10px] mt-1">B<sub>∥</sub> = {BParallel.toFixed(0)} G</p>
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">g<sub>⊥</sub> (perpendikulyar):</span>
                <span className="text-emerald-400 font-mono">{gPerp.toFixed(3)}</span>
              </label>
              <input type="range" min="1.95" max="2.02" step="0.001" value={gPerp}
                onChange={(e) => setGPerp(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
              <p className="text-purple-400 text-[10px] mt-1">B<sub>⊥</sub> = {BPerp.toFixed(0)} G</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">A (⁵³Cr, G):</span>
                <span className="text-emerald-400 font-mono">{A}</span>
              </label>
              <input type="range" min="5" max="30" step="1" value={A}
                onChange={(e) => setA(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
              <p className="text-purple-400 text-[10px] mt-1">Kuchsiz gipernozik</p>
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">ΔB (G):</span>
                <span className="text-emerald-400 font-mono">{linewidth}</span>
              </label>
              <input type="range" min="10" max="80" step="1" value={linewidth}
                onChange={(e) => setLinewidth(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">Harorat (K):</span>
                <span className="text-emerald-400 font-mono">{temperature}</span>
              </label>
              <input type="range" min="4" max="400" step="1" value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
            </div>
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-2">EPR spektri (X-band, 9.5 GHz):</h5>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="100" x2="380" y2="100" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="40" y1="20" x2="40" y2="180" stroke="#4c1d95" strokeWidth="1" />
            <line x1="380" y1="20" x2="380" y2="180" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">B (Gauss)</text>
            <text x="40" y="195" fill="#a78bfa" fontSize="8">3000</text>
            <text x="380" y="195" fill="#a78bfa" fontSize="8" textAnchor="end">3800</text>

            {/* Absorbsiya */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 500) * 340
                const y = 100 - (p.signal / maxSignal) * 70
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.4"
            />

            {/* Birinchi hosila */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 500) * 340
                const next = spectrum[i + 1] || p
                const derivative = (next.signal - p.signal) * 500
                const y = 100 - (derivative / maxSignal) * 70
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#10b981" strokeWidth="2"
            />

            {/* g∥ va g⊥ belgilari */}
            <line x1={40 + ((BParallel - 3000) / 800) * 340} y1="20" x2={40 + ((BParallel - 3000) / 800) * 340} y2="180"
              stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((BParallel - 3000) / 800) * 340} y="15" fill="#ef4444" fontSize="8" textAnchor="middle">
              g∥={gParallel.toFixed(3)}
            </text>

            <line x1={40 + ((BPerp - 3000) / 800) * 340} y1="25" x2={40 + ((BPerp - 3000) / 800) * 340} y2="180"
              stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((BPerp - 3000) / 800) * 340} y="20" fill="#3b82f6" fontSize="8" textAnchor="middle">
              g⊥={gPerp.toFixed(3)}
            </text>

            {/* Markaz - g_e */}
            <line x1={40 + ((3430 - 3000) / 800) * 340} y1="30" x2={40 + ((3430 - 3000) / 800) * 340} y2="180"
              stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="1,1" />
            <text x={40 + ((3430 - 3000) / 800) * 340} y="25" fill="#fbbf24" fontSize="7" textAnchor="middle">
              g_e=2.002
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400">g<sub>∥</sub></p>
            <p className="text-emerald-400 font-bold font-mono">{gParallel.toFixed(3)}</p>
          </div>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-400">g<sub>⊥</sub></p>
            <p className="text-emerald-400 font-bold font-mono">{gPerp.toFixed(3)}</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-yellow-400">Δg</p>
            <p className="text-emerald-400 font-bold font-mono">{(gParallel - gPerp).toFixed(3)}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">g<sub>av</sub></p>
            <p className="text-emerald-400 font-bold font-mono">{((gParallel + 2 * gPerp) / 3).toFixed(3)}</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Kuzatishlar:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>g ≈ 2.0</strong> — orbital moment so'ngan (⁴A₂g)</li>
            <li><strong>Kuchsiz anizotropiya</strong> — g∥ ≈ g⊥ (oktaedrik simmetriya)</li>
            <li><strong>⁵³Cr gipernozik kuchsiz</strong> — A ≈ 16 G, tabiiylik 9.5%</li>
            <li><strong>⁵²Cr (83.8%)</strong> — gipernozik yo'q, aniq signal</li>
            <li>g<sub>∥</sub> &lt; g<sub>e</sub> — liganddan metallga zaryad ko'chishi</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. SPIN-ONLY BILAN SOLIShTIRISH
// ============================================================================
function SpinOnlySolishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🎯 Spin-only bilan solishtirish — ideal moslik</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-2">Cr³⁺ (d³) — spin-only klassikasi:</p>
          <p className="text-emerald-400 text-lg">μ<sub>eff</sub> = √[n(n+2)] = √15 ≈ 3.87 μ<sub>B</sub></p>
          <p className="text-purple-400 text-xs mt-2">Eksperimental: 3.7-3.9 μ<sub>B</sub></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-emerald-400 font-bold mb-3">Nima uchun ideal mos?</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>• <strong>t₂g³ konfiguratsiya</strong> — yarim to'lgan</li>
              <li>• <strong>⁴A₂g ground state</strong> — A term</li>
              <li>• <strong>Orbital moment L = 0</strong></li>
              <li>• <strong>Spin-orbital coupling kuchsiz</strong></li>
              <li>• <strong>Yahn-Teller effekti yo'q</strong> (simmetrik to'lgan)</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-emerald-400 font-bold mb-3">g-faktor tahlili:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">g<sub>e</sub> (erkin e⁻):</span>
                <span className="text-emerald-400 font-mono">2.0023</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">g<sub>∥</sub> (Cr³⁺):</span>
                <span className="text-emerald-400 font-mono">1.983</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Δg:</span>
                <span className="text-yellow-400 font-mono">-0.019</span>
              </div>
              <p className="text-purple-400 text-[10px] mt-2">
                Δg &lt; 0 — liganddan metallga zaryad ko'chishi (LMCT)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-3 text-xs">
          <p className="text-emerald-400 font-bold mb-1">✨ Cr³⁺ — spin-only nazariyasining "oltin standarti"</p>
          <p className="text-purple-200">
            Boshqa d³ ionlar (Mo³⁺, W³⁺) ham spin-only ga yaqin. Lekin Cr³⁺ eng keng o'rganilgan —
            barqaror, ko'p komplekslar hosil qiladi, EPR spektri aniq.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. KICHKINA ZFS (D≈0.2 cm⁻¹)
// ============================================================================
function KichikZFS() {
  const [D, setD] = useState(0.2)
  const [E, setE] = useState(0.02)

  // S=3/2 uchun 4 ta sath
  const levels = useMemo(() => {
    const S = 1.5
    const S_term = S * (S + 1) / 3
    return [
      { Ms: 1.5, E: D * (2.25 - S_term) },
      { Ms: 0.5, E: D * (0.25 - S_term) },
      { Ms: -0.5, E: D * (0.25 - S_term) },
      { Ms: -1.5, E: D * (2.25 - S_term) },
    ]
  }, [D])

  const maxE = Math.max(...levels.map(l => Math.abs(l.E)), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ Kichik ZFS — D≈0.2 cm⁻¹</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-2">Co²⁺ vs Cr³⁺ ZFS:</h5>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-cyan-900/30 border border-cyan-500/30 rounded p-3">
              <p className="text-cyan-400 font-bold">Co²⁺ (d⁷)</p>
              <p className="text-purple-200">D ≈ 15 cm⁻¹</p>
              <p className="text-purple-400 text-[10px]">Katta ZFS</p>
            </div>
            <div className="bg-emerald-900/30 border border-emerald-500/30 rounded p-3">
              <p className="text-emerald-400 font-bold">Cr³⁺ (d³)</p>
              <p className="text-purple-200">D ≈ 0.2 cm⁻¹</p>
              <p className="text-purple-400 text-[10px]">Kichik ZFS (100× kichik!)</p>
            </div>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">D (sm⁻¹):</span>
            <span className="text-emerald-400 font-mono">{D.toFixed(2)}</span>
          </label>
          <input type="range" min="0" max="1" step="0.01" value={D}
            onChange={(e) => setD(parseFloat(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
        </div>

        {/* Energiya diagrammasi */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 180" className="w-full h-44">
            <line x1="50" y1="20" x2="50" y2="160" stroke="#4c1d95" strokeWidth="1" />
            <line x1="50" y1="90" x2="380" y2="90" stroke="#7c3aed" strokeWidth="0.5" strokeDasharray="2,2" />

            {levels.map((level, i) => {
              const y = 90 - (level.E / maxE) * 60
              const color = Math.abs(level.Ms) === 1.5 ? "#10b981" : "#f59e0b"
              return (
                <g key={i}>
                  <line x1="80" y1={y} x2="350" y2={y} stroke={color} strokeWidth="3" />
                  <text x="70" y={y + 4} fill={color} fontSize="10" textAnchor="end" fontWeight="bold">
                    M<sub>s</sub> = {level.Ms > 0 ? '+' : ''}{level.Ms}
                  </text>
                  <text x="360" y={y + 4} fill="#c4b5fd" fontSize="9">
                    {level.E.toFixed(3)} cm⁻¹
                  </text>
                </g>
              )
            })}

            <text x="215" y="15" fill="#10b981" fontSize="10" textAnchor="middle" fontWeight="bold">
              D = {D.toFixed(2)} cm⁻¹ (juda kichik!)
            </text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun ZFS kichik?</p>
          <p className="text-purple-200">
            Cr³⁺ da <strong>t₂g³ yarim to'lgan</strong> — simmetrik elektron taqsimoti.
            Orbital moment yo'q (⁴A₂g) → spin-orbital coupling kuchsiz → <strong>ZFS minimal</strong>.
            Shuning uchun Cr³⁺ EPR spektri <strong>oddiy, izotropga yaqin</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. RUBY VA EMERALD — Cr³⁺ RANGI
// ============================================================================
function RubyEmerald() {
  const [tosha, setTosha] = useState("ruby")

  const toshlar = {
    ruby: {
      name: "Ruby (Yoqut)",
      formula: "Al₂O₃ : Cr³⁺",
      rang: "Qizil",
      color: "#dc2626",
      sababi: "Cr³⁺ → ⁴T₂ o'tish (694 nm). Ruby laser 694.3 nm da ishlaydi!",
      delta: "17800 cm⁻¹",
      icon: "💎"
    },
    emerald: {
      name: "Emerald (Zumrad)",
      formula: "Be₃Al₂Si₆O₁₈ : Cr³⁺",
      rang: "Yashil",
      color: "#16a34a",
      sababi: "Cr³⁺ → maydon kuchsiz (16800 cm⁻¹), yashil komplementar",
      delta: "16800 cm⁻¹",
      icon: "💚"
    },
    alexandrite: {
      name: "Alexandrite",
      formula: "BeAl₂O₄ : Cr³⁺",
      rang: "Yashil ↔ Qizil",
      color: "#7c3aed",
      sababi: "Yorug'lik manbaiga bog'liq rang o'zgarishi (termoxromizm)",
      delta: "17200 cm⁻¹",
      icon: "🔮"
    }
  }

  const t = toshlar[tosha]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💎 Cr³⁺ — qimmatbaho toshlar rangi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(toshlar).map(([key, val]) => (
            <button key={key} onClick={() => setTosha(key)}
              className={`px-3 py-3 rounded-lg text-xs font-bold transition-all ${
                tosha === key
                  ? "bg-emerald-600/80 text-white shadow-lg"
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              <div className="text-2xl mb-1">{val.icon}</div>
              <div className="text-[10px]">{val.name}</div>
            </button>
          ))}
        </div>

        <div className="bg-purple-950/50 rounded-xl p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white/20"
              style={{backgroundColor: t.color}}></div>
            <div>
              <h4 className="text-white font-bold text-xl">{t.name}</h4>
              <p className="text-purple-400 text-sm font-mono">{t.formula}</p>
              <p className="text-emerald-400 font-bold mt-1">{t.rang}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-900/50 rounded p-3">
              <p className="text-purple-400 text-xs">Δ<sub>o</sub></p>
              <p className="text-emerald-400 font-bold font-mono">{t.delta}</p>
            </div>
            <div className="bg-purple-900/50 rounded p-3">
              <p className="text-purple-400 text-xs">Rang sababi</p>
              <p className="text-purple-200 text-[10px]">{t.sababi}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💎 Bir xil Cr³⁺, turli rang:</p>
          <p className="text-purple-200">
            <strong>Ruby</strong> — Al₂O₃ panjarasida Cr³⁺ → Δ<sub>o</sub> = 17800 cm⁻¹ → qizil yutilish →
            <strong className="text-red-400"> qizil rang</strong>.
            <br/>
            <strong>Emerald</strong> — Be₃Al₂Si₆O₁₈ da Cr³⁺ → Δ<sub>o</sub> = 16800 cm⁻¹ → ko'k-qizil yutilish →
            <strong className="text-emerald-400"> yashil rang</strong>.
            <br/>
            Bu <strong>"kristall maydon ta'siri"</strong>ning ajoyib namunasi — bir xil ion, turli muhit → turli rang!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. RUBY LASER
// ============================================================================
function RubyLaser() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1. Pompalash (flash lamp)",
      desc: "Xenon lamp orqali Cr³⁺ ni ⁴T₂ holatiga ko'tarish",
      formula: "Cr³⁺ (⁴A₂g) + hν → Cr³⁺ (⁴T₂)",
      icon: "💡"
    },
    {
      title: "2. Nurlanishsiz o'tish",
      desc: "⁴T₂ → ²E (tez, ~10⁻⁸ s)",
      formula: "Cr³⁺ (⁴T₂) → Cr³⁺ (²E) + issiqlik",
      icon: "⚡"
    },
    {
      title: "3. Meta-barqaror holat",
      desc: "²E — uzoq umr ko'rish (~3 ms)",
      formula: "Cr³⁺ (²E) — meta-barqaror",
      icon: "⏱️"
    },
    {
      title: "4. Lazer nurlanishi",
      desc: "²E → ⁴A₂g o'tish → 694.3 nm qizil nur",
      formula: "Cr³⁺ (²E) → Cr³⁺ (⁴A₂g) + hν (694.3 nm)",
      icon: "🔴"
    }
  ]

  const s = steps[step]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔴 Ruby laser — birinchi laser (1960)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 font-bold mb-2">🏆 Tarixiy ahamiyat:</p>
          <p className="text-purple-200 text-xs">
            <strong>1960 yil, Theodore Maiman</strong> — birinchi ishlaydigan laser.
            Ruby kristali (Al₂O₃:Cr³⁺) faol muhit sifatida ishlatilgan.
            <strong> 694.3 nm</strong> da qizil nur chiqaradi.
          </p>
        </div>

        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                step === i ? "bg-emerald-600/80 text-white shadow-lg" : "bg-purple-800/40 text-purple-300"
              }`}>
              {i + 1}
            </button>
          ))}
        </div>

        <div className="bg-purple-950/50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{s.icon}</span>
            <h4 className="text-emerald-400 font-bold text-lg">{s.title}</h4>
          </div>
          <p className="text-purple-200 text-sm mb-3">{s.desc}</p>
          <div className="bg-purple-900/50 rounded p-3 font-mono text-xs text-center text-emerald-400">
            {s.formula}
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Cr³⁺ laser uchun ideal?</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>²E meta-barqaror</strong> — uzoq umr (3 ms), aholi inversiyasi oson</li>
            <li><strong>Kuchli o'tish</strong> — ⁴A₂g → ⁴T₂ (keng yutilish diapazoni)</li>
            <li><strong>Barqaror kristall</strong> — Al₂O₃ mexanik mustahkam</li>
            <li><strong>Aniq to'lqin uzunligi</strong> — 694.3 nm (monoxromatik)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. TURLI Cr³⁺ MUHITLARI
// ============================================================================
function TurliMuhitlar() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Cr³⁺ turli muhitlarda — EPR solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Muhit</th>
                <th className="text-center py-3 px-2 text-yellow-400">g<sub>∥</sub></th>
                <th className="text-center py-3 px-2 text-yellow-400">g<sub>⊥</sub></th>
                <th className="text-center py-3 px-2 text-yellow-400">D (sm⁻¹)</th>
                <th className="text-left py-3 px-2 text-yellow-400">Rang</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["[Cr(H₂O)₆]³⁺", "1.983", "1.980", "0.2", "Binafsha-yashil"],
                ["[Cr(NH₃)₆]³⁺", "1.985", "1.985", "0.1", "Sariq"],
                ["[Cr(en)₃]³⁺", "1.990", "1.990", "0.1", "Sariq"],
                ["[Cr(CN)₆]³⁻", "1.980", "1.980", "0.15", "Sariq"],
                ["Ruby (Al₂O₃)", "1.984", "1.984", "0.19", "Qizil"],
                ["Emerald", "1.982", "1.982", "0.18", "Yashil"],
                ["Cr³⁺ shisha", "1.970-1.990", "—", "0.1-0.5", "Binafsha"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 ${i === 0 ? 'bg-emerald-600/10' : ''} hover:bg-purple-800/20`}>
                  <td className="py-2 px-2 font-bold text-emerald-400">{r[0]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[1]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[2]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[3]}</td>
                  <td className="py-2 px-2 text-[11px]">{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-purple-400 text-xs mt-3">
          * Barcha Cr³⁺ komplekslarida <strong>g ≈ 1.98</strong> — izotropga yaqin.
          D qiymati kichik (0.1-0.5 cm⁻¹) — spin-only ga yaqin xatti-harakat.
          Rang ligand maydoni kuchiga (Δ<sub>o</sub>) bog'liq.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// 7. AMALIY QO'LLANILISH
// ============================================================================
function AmaliyQollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 Cr³⁺ ning amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💎</div>
            <h4 className="text-emerald-400 font-bold mb-2">Qimmatbaho toshlar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Ruby</strong> — yoqut</li>
              <li><strong>Emerald</strong> — zumrad</li>
              <li><strong>Alexandrite</strong> — rang o'zgaruvchi</li>
              <li>Zargarlik, kolleksiyalar</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔴</div>
            <h4 className="text-emerald-400 font-bold mb-2">Lazerlar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Ruby laser</strong> — 694.3 nm</li>
              <li>Tibbiyot (ko'z jarrohligi)</li>
              <li>Sanoat (kesish, payvandlash)</li>
              <li>Holografiya</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🎨</div>
            <h4 className="text-emerald-400 font-bold mb-2">Pigmentlar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Xrom yashil</strong> (Cr₂O₃)</li>
              <li>Keramik glazurlar</li>
              <li>Shisha bo'yoqlari</li>
              <li>Harbiy kamuflage</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚗️</div>
            <h4 className="text-emerald-400 font-bold mb-2">Kataliz</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Phillips katalizatori</strong> (CrO₃/SiO₂)</li>
              <li>Polyetilen ishlab chiqarish</li>
              <li>Cr-zeolitlar</li>
              <li>Fotokataliz</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔧</div>
            <h4 className="text-emerald-400 font-bold mb-2">Qotishmalar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Zanglamas po'lat</strong> (Fe-Cr-Ni)</li>
              <li>Xromli po'lat</li>
              <li>Nichrome (issiqlikka chidamli)</li>
              <li>Aviasiya, tibbiyot</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">📡</div>
            <h4 className="text-emerald-400 font-bold mb-2">EPR standart</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Cr³⁺ shisha</strong> — kalibrlash</li>
              <li>g-faktor standarti</li>
              <li>Magnit maydon o'lchash</li>
              <li>Spin konsentratsiyasi</li>
            </ul>
          </div>
        </div>

        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 font-bold mb-2">🌟 Qiziqarli faktlar:</p>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• Cr³⁺ — <strong>eng barqaror oksidlanish darajasi</strong> (t₂g³ yarim to'lgan)</li>
            <li>• <strong>Kinetik inert</strong> — ligand almashinishi juda sekin (t<sub>1/2</sub> ≈ 40 soat)</li>
            <li>• <strong>Ruby laser</strong> — 1960 yilda birinchi laser</li>
            <li>• <strong>"Xrom"</strong> yunoncha "chroma" (rang) — barcha birikmalari rangli</li>
            <li>• <strong>Mars qizil</strong> — Fe₂O₃ bilan birga Cr³⁺ ham bor</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function CrH2O6EPR() {
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
          <span className="text-emerald-400">[Cr(H₂O)₆]³⁺</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-emerald-400">📡 [Cr(H₂O)₆]³⁺ — EPR tahlili</h1>
          <p className="text-purple-400 text-sm">
            Cr³⁺ (d³, S=3/2) • ⁴A₂g • Spin-only klassikasi • g≈1.98 • Kichik ZFS • Ruby/Emerald
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-emerald-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-emerald-400">[Cr(H₂O)₆]³⁺</span>
            <div>
              <h2 className="text-xl font-bold text-white">EPR tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Geksaakvaxrom(III)" — spin-only klassikasi</p>
            </div>
          </div>

          <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Cr(H₂O)₆]³⁺ — <strong className="text-emerald-400">spin-only nazariyasining eng yaxshi tasdig'i</strong>.
              Cr³⁺ (d³) <strong>t₂g³ yarim to'lgan</strong> konfiguratsiyaga ega — bu alohida barqaror.
              <strong> ⁴A₂g ground state</strong> (A term) — orbital moment to'liq so'ngan.
              Shuning uchun g-faktor <strong>g<sub>e</sub>=2.0023 ga juda yaqin</strong> (g≈1.98).
              ZFS <strong>juda kichik</strong> (D≈0.2 cm⁻¹) — Co²⁺ dan 100 marta kichik!
              EPR spektri <strong>izotropga yaqin</strong>, aniq va o'rganish oson.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">Cr³⁺ (d³)</p>
              <p className="text-purple-300">S = 3/2</p>
              <p className="text-purple-400 mt-1">t₂g³</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">g ≈ 1.98</p>
              <p className="text-purple-300">izotrop</p>
              <p className="text-purple-400 mt-1">⁴A₂g</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">D ≈ 0.2</p>
              <p className="text-purple-300">sm⁻¹</p>
              <p className="text-purple-400 mt-1">kichik ZFS</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">3.87 μ<sub>B</sub></p>
              <p className="text-purple-300">μ<sub>eff</sub></p>
              <p className="text-purple-400 mt-1">spin-only</p>
            </div>
          </div>
        </div>

        {/* EPR SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EPRSpektrSimulyatori />
        </div>

        {/* SPIN-ONLY SOLISHTIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SpinOnlySolishtirish />
        </div>

        {/* KICHKINA ZFS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <KichikZFS />
        </div>

        {/* RUBY VA EMERALD */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <RubyEmerald />
        </div>

        {/* RUBY LASER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <RubyLaser />
        </div>

        {/* TURLI MUHITLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TurliMuhitlar />
        </div>

        {/* AMALIYOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AmaliyQollanilish />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-emerald-600/10 to-purple-600/10 border border-emerald-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Cr³⁺ (d³) — <strong className="text-emerald-400">t₂g³ yarim to'lgan</strong>, alohida barqaror</li>
            <li><strong>⁴A₂g ground state</strong> — orbital moment yo'q (A term)</li>
            <li>g ≈ <strong>1.98</strong> — g<sub>e</sub>=2.0023 ga yaqin (spin-only ga yaqin)</li>
            <li><strong>Kuchsiz anizotropiya</strong> — g∥ ≈ g⊥ (oktaedrik simmetriya)</li>
            <li><strong>Kichik ZFS</strong> — D ≈ 0.2 cm⁻¹ (Co²⁺ dan 100× kichik)</li>
            <li>⁵³Cr (I=3/2, 9.5%) — kuchsiz gipernozik (A ≈ 16 G)</li>
            <li>⁵²Cr (I=0, 83.8%) — gipernozik yo'q, aniq signal</li>
            <li>μ<sub>eff</sub> ≈ <strong>3.87 μ<sub>B</sub></strong> — spin-only bilan ideal mos</li>
            <li><strong>Ruby</strong> va <strong>Emerald</strong> — Cr³⁺ rangi (kristall maydon ta'siri)</li>
            <li><strong>Ruby laser</strong> (1960) — birinchi laser (694.3 nm)</li>
            <li>Kinetik inert — ligand almashinishi juda sekin (t<sub>1/2</sub> ≈ 40 soat)</li>
            <li>Amaliy: qimmatbaho toshlar, lazerlar, pigmentlar, kataliz, EPR standart</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/epr/birikmalar/co-cl4" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [CoCl₄]²⁻
          </Link>
          <Link href="/ilmiy/tahlil/epr/birikmalar" className="px-6 py-3 bg-emerald-600/80 rounded-xl hover:bg-emerald-500 text-white font-semibold">
            EPR birikmalar →
          </Link>
        </div>

      </section>
    </main>
  )
}