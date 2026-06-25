"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. CD SPEKTR SIMULYATORI ([Rh(en)₃]³⁺ uchun)
// ============================================================================
function CDSpectrumSimulator() {
  const [enantiomer, setEnantiomer] = useState("delta")
  const [ee, setEe] = useState(100)
  const [showSecondBand, setShowSecondBand] = useState(true)

  // [Rh(en)₃]³⁺ xarakterli parametrlar
  // ¹A₁g → ¹T₁g: ~345 nm (UV, kuchli)
  // ¹A₁g → ¹T₂g: ~290 nm (UV, juda kuchli)
  const bands = [
    { lambda_max: 345, epsilon: 350, delta_epsilon_max: 4.0, assign: "¹A₁g → ¹T₁g" },
    { lambda_max: 290, epsilon: 5000, delta_epsilon_max: -12.0, assign: "¹A₁g → ¹T₂g" },
  ]

  const sign = enantiomer === "delta" ? 1 : -1
  const eeFactor = ee / 100

  // CD spektri simulyatsiyasi
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 220 + i * 1.5 // 220-820 nm
      let cotton = 0
      let absorption = 0

      bands.forEach((band, idx) => {
        if (!showSecondBand && idx === 1) return
        
        const x = (lambda - band.lambda_max) / 30
        
        // Cotton effekti (Gaussian derivative)
        const cottonBand = sign * x * Math.exp(-0.5 * x * x) * band.delta_epsilon_max * eeFactor
        
        // Absorbsiya (Gaussian)
        const absBand = Math.exp(-0.5 * x * x) * band.epsilon * eeFactor
        
        cotton += cottonBand
        absorption += absBand
      })

      points.push({ lambda, cotton, absorption })
    }
    return points
  }, [enantiomer, ee, sign, eeFactor, showSecondBand])

  const maxCotton = Math.max(...spectrum.map(p => Math.abs(p.cotton)), 0.1)
  const maxAbs = Math.max(...spectrum.map(p => p.absorption), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 CD spektr simulyatori — [Rh(en)₃]³⁺</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-cyan-700/30 space-y-4">
        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-lg p-4">
          <p className="text-cyan-400 font-bold mb-2">💎 4d metall — kuchliroq CD signal:</p>
          <p className="text-purple-200 text-xs">
            [Rh(en)₃]³⁺ — [Co(en)₃]³⁺ ning <strong>4d analogi</strong>. Rh³⁺ (4d⁶ LS)
            <strong> kuchli spin-orbital coupling</strong>ga ega → CD signallari [Co(en)₃]³⁺ dan
            <strong> 2-3 marta kuchliroq</strong>. Birinchi d-d o'tish (¹T₁g, ~345 nm) UV sohada joylashgan.
            Δε ≈ ±4.0 (Co: ±2.0) — bu <strong>og'ir atom effekti</strong>ning natijasi.
          </p>
        </div>

        {/* BOSHQARUV */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-yellow-400 font-bold mb-2 block">Enantiomer:</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setEnantiomer("delta")}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  enantiomer === "delta" 
                    ? "bg-cyan-600/80 text-white shadow-lg" 
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                Δ (delta) — P-helis
              </button>
              <button onClick={() => setEnantiomer("lambda")}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  enantiomer === "lambda" 
                    ? "bg-rose-600/80 text-white shadow-lg" 
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                Λ (lambda) — M-helis
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">ee (%):</span>
                <span className="text-emerald-400 font-mono">{ee}%</span>
              </label>
              <input type="range" min="0" max="100" step="5" value={ee}
                onChange={(e) => setEe(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-cyan-500" />
            </div>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input type="checkbox" checked={showSecondBand}
                onChange={(e) => setShowSecondBand(e.target.checked)}
                className="accent-cyan-500" />
              <span className="text-purple-300">Ikkinchi o'tishni ko'rsatish (¹T₂g, 290 nm)</span>
            </label>
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-cyan-400 font-bold text-xs mb-2">
            CD spektri va absorbsiya: {enantiomer === "delta" ? "Δ" : "Λ"}-[Rh(en)₃]³⁺
          </h5>
          <svg viewBox="0 0 400 280" className="w-full h-64">
            {/* O'qlar */}
            <line x1="40" y1="140" x2="380" y2="140" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="40" y1="20" x2="40" y2="260" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="275" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="270" fill="#a78bfa" fontSize="8">220</text>
            <text x="380" y="270" fill="#a78bfa" fontSize="8" textAnchor="end">820</text>
            <text x="20" y="140" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 140)">
              Δε / ε
            </text>

            {/* λ_max belgilari */}
            {bands.map((band, idx) => {
              if (!showSecondBand && idx === 1) return null
              const x = 40 + ((band.lambda_max - 220) / 600) * 340
              return (
                <g key={idx}>
                  <line x1={x} y1="20" x2={x} y2="260" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x={x} y="15" fill="#fbbf24" fontSize="7" textAnchor="middle">
                    {band.lambda_max} nm
                  </text>
                </g>
              )
            })}

            {/* Absorbsiya egri chizig'i */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 400) * 340
                const y = 260 - (p.absorption / maxAbs) * 110
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6"
            />

            {/* CD spektri */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 400) * 340
                const y = 140 - (p.cotton / maxCotton) * 110
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke={sign > 0 ? "#06b6d4" : "#f43f5e"} strokeWidth="2"
            />

            {/* Legend */}
            <text x="280" y="30" fill="#fbbf24" fontSize="8">— Absorbsiya (ε)</text>
            <text x="280" y="45" fill={sign > 0 ? "#06b6d4" : "#f43f5e"} fontSize="8">
              — CD (Δε)
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className={`rounded-lg p-3 ${enantiomer === "delta" ? "bg-cyan-900/30 border border-cyan-500/50" : "bg-purple-900/50"}`}>
            <p className="text-purple-400">Enantiomer</p>
            <p className={`font-bold ${enantiomer === "delta" ? "text-cyan-400" : "text-rose-400"}`}>
              {enantiomer === "delta" ? "Δ (delta)" : "Λ (lambda)"}
            </p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Birinchi Cotton</p>
            <p className={`font-bold ${sign > 0 ? "text-emerald-400" : "text-red-400"}`}>
              {sign > 0 ? "Musbat (+)" : "Manfiy (-)"}
            </p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">ee</p>
            <p className="text-yellow-400 font-bold">{ee}%</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 [Co(en)₃]³⁺ bilan farq:</p>
          <p className="text-purple-200">
            <strong>[Rh(en)₃]³⁺</strong> — λ<sub>max</sub> = 345 nm (UV), Δε ≈ ±4.0
            <br/>
            <strong>[Co(en)₃]³⁺</strong> — λ<sub>max</sub> = 470 nm (ko'rinadigan), Δε ≈ ±2.0
            <br/>
            Rh³⁺ da d-d o'tishlar <strong>UV sohada</strong> (katta Δ<sub>o</sub>) va
            <strong> 2 marta kuchliroq</strong> CD signali (og'ir atom effekti).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. Δ vs Λ 3D VIZUALIZATSIYA
// ============================================================================
function DeltaLambdaVisualization() {
  const [rotate, setRotate] = useState(0)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔷 Δ va Λ enantiomerlar — 3D vizualizatsiya</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-cyan-700/30 space-y-4">
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Aylantirish burchagi:</span>
            <span className="text-emerald-400 font-mono">{rotate}°</span>
          </label>
          <input type="range" min="0" max="360" step="5" value={rotate}
            onChange={(e) => setRotate(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-cyan-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Δ */}
          <div className="bg-cyan-900/20 border-2 border-cyan-500/30 rounded-xl p-4">
            <h4 className="text-cyan-400 font-bold mb-2 text-center">Δ (delta) — P-helis</h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* C₃ o'qi */}
              <line x1="100" y1="20" x2="100" y2="180" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />
              <text x="110" y="15" fill="#fbbf24" fontSize="8">C₃</text>

              {/* Markaziy Rh */}
              <circle cx="100" cy="100" r="15" fill="#06b6d4" />
              <text x="100" y="105" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Rh</text>

              {/* 3 ta en ligand */}
              {Array.from({ length: 3 }).map((_, i) => {
                const angle = (i * 120 + rotate) * Math.PI / 180
                const x1 = 100 + 40 * Math.cos(angle)
                const y1 = 100 + 40 * Math.sin(angle)
                const x2 = 100 + 70 * Math.cos(angle + 0.4)
                const y2 = 100 + 70 * Math.sin(angle + 0.4)
                return (
                  <g key={i}>
                    <line x1="100" y1="100" x2={x1} y2={y1} stroke="#22d3ee" strokeWidth="2" />
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22d3ee" strokeWidth="2" />
                    <circle cx={x1} cy={y1} r="5" fill="#10b981" />
                    <circle cx={x2} cy={y2} r="5" fill="#10b981" />
                    <text x={(x1+x2)/2} y={(y1+y2)/2 - 5} fill="#67e8f9" fontSize="7" textAnchor="middle">en</text>
                  </g>
                )
              })}

              {/* Spiral yo'nalishi */}
              <path d="M 100 50 Q 140 75 145 100 Q 140 125 100 150" 
                fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="155" y="100" fill="#fbbf24" fontSize="8">O'ng vint</text>
            </svg>
            <p className="text-cyan-400 text-xs text-center mt-2">
              C₃ o'qi bo'ylab o'ngga burilgan
            </p>
          </div>

          {/* Λ */}
          <div className="bg-rose-900/20 border-2 border-rose-500/30 rounded-xl p-4">
            <h4 className="text-rose-400 font-bold mb-2 text-center">Λ (lambda) — M-helis</h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* C₃ o'qi */}
              <line x1="100" y1="20" x2="100" y2="180" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />
              <text x="110" y="15" fill="#fbbf24" fontSize="8">C₃</text>

              {/* Markaziy Rh */}
              <circle cx="100" cy="100" r="15" fill="#f43f5e" />
              <text x="100" y="105" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Rh</text>

              {/* 3 ta en ligand (teskari) */}
              {Array.from({ length: 3 }).map((_, i) => {
                const angle = (i * 120 - rotate) * Math.PI / 180
                const x1 = 100 + 40 * Math.cos(angle)
                const y1 = 100 + 40 * Math.sin(angle)
                const x2 = 100 + 70 * Math.cos(angle - 0.4)
                const y2 = 100 + 70 * Math.sin(angle - 0.4)
                return (
                  <g key={i}>
                    <line x1="100" y1="100" x2={x1} y2={y1} stroke="#fb7185" strokeWidth="2" />
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fb7185" strokeWidth="2" />
                    <circle cx={x1} cy={y1} r="5" fill="#10b981" />
                    <circle cx={x2} cy={y2} r="5" fill="#10b981" />
                    <text x={(x1+x2)/2} y={(y1+y2)/2 - 5} fill="#fda4af" fontSize="7" textAnchor="middle">en</text>
                  </g>
                )
              })}

              {/* Spiral yo'nalishi */}
              <path d="M 100 50 Q 60 75 55 100 Q 60 125 100 150" 
                fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="20" y="100" fill="#fbbf24" fontSize="8">Chap vint</text>
            </svg>
            <p className="text-rose-400 text-xs text-center mt-2">
              C₃ o'qi bo'ylab chapga burilgan
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. OG'IR ATOM EFFEKTI
// ============================================================================
function HeavyAtomEffect() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚛️ Og'ir atom effekti — nima uchun Rh kuchliroq?</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-cyan-700/30 space-y-4">
        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-lg p-4">
          <p className="text-cyan-400 font-bold mb-2">💎 Asosiy tushuncha:</p>
          <p className="text-purple-200 text-xs">
            <strong>Og'ir atom effekti</strong> — yadro zaryadi oshgani sayin
            <strong> spin-orbital coupling</strong> kuchayadi. Bu <strong>CD signalini kuchaytiradi</strong>
            va <strong>elektron o'tishlarga</strong> qo'shimcha intensivlik beradi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-cyan-400 font-bold mb-3">3d vs 4d vs 5d:</h4>
            <div className="space-y-3">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-400 font-bold">Co³⁺ (3d⁶)</span>
                  <span className="text-emerald-400 font-mono">Z = 27</span>
                </div>
                <p className="text-purple-300 text-[10px] mt-1">SOC: kuchsiz | Δε ≈ ±2.0</p>
              </div>
              <div className="bg-cyan-900/20 border border-cyan-500/30 rounded p-3">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 font-bold">Rh³⁺ (4d⁶)</span>
                  <span className="text-emerald-400 font-mono">Z = 45</span>
                </div>
                <p className="text-purple-300 text-[10px] mt-1">SOC: o'rtacha | Δε ≈ ±4.0</p>
              </div>
              <div className="bg-purple-900/20 border border-purple-500/30 rounded p-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-400 font-bold">Ir³⁺ (5d⁶)</span>
                  <span className="text-emerald-400 font-mono">Z = 77</span>
                </div>
                <p className="text-purple-300 text-[10px] mt-1">SOC: kuchli | Δε ≈ ±8.0</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-cyan-400 font-bold mb-3">SOC nima qiladi?</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>CD signalini kuchaytiradi</strong> — Δε 2-4 marta oshadi</li>
              <li>✓ <strong>Laporte taqiqini buzadi</strong> — d-d o'tishlar intensivroq</li>
              <li>✓ <strong>ISC tezligini oshiradi</strong> — fotofizik xossalar</li>
              <li>✓ <strong>g-faktorni o'zgartiradi</strong> — EPR spektrlari</li>
              <li>✓ <strong>Δ<sub>o</sub> ni oshiradi</strong> — d-d o'tishlar UV ga siljiydi</li>
            </ul>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-cyan-400 font-bold text-xs mb-2">SOC ning Δε ga ta'siri:</h5>
          <svg viewBox="0 0 400 150" className="w-full h-36">
            <line x1="40" y1="120" x2="380" y2="120" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="120" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="145" fill="#c4b5fd" fontSize="9" textAnchor="middle">Atom og'irligi (Z)</text>
            <text x="20" y="70" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 70)">
              |Δε|
            </text>

            {/* Co */}
            <rect x="80" y="90" width="50" height="30" fill="#3b82f6" opacity="0.6" />
            <text x="105" y="85" fill="#3b82f6" fontSize="9" textAnchor="middle">Co (Z=27)</text>
            <text x="105" y="110" fill="white" fontSize="8" textAnchor="middle">2.0</text>

            {/* Rh */}
            <rect x="170" y="60" width="50" height="60" fill="#06b6d4" opacity="0.6" />
            <text x="195" y="55" fill="#06b6d4" fontSize="9" textAnchor="middle">Rh (Z=45)</text>
            <text x="195" y="95" fill="white" fontSize="8" textAnchor="middle">4.0</text>

            {/* Ir */}
            <rect x="260" y="30" width="50" height="90" fill="#a855f7" opacity="0.6" />
            <text x="285" y="25" fill="#a855f7" fontSize="9" textAnchor="middle">Ir (Z=77)</text>
            <text x="285" y="80" fill="white" fontSize="8" textAnchor="middle">8.0</text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Xulosa:</p>
          <p className="text-purple-200">
            <strong>3d → 4d → 5d</strong> o'tishda spin-orbital coupling <strong>Z⁴</strong> ga proporsional oshadi.
            Shuning uchun Rh³⁺ va Ir³⁺ komplekslari <strong>kuchliroq CD signallar</strong> beradi
            va <strong>fotofizik xossalari</strong> (lyuminestsensiya, fosforessensiya) yaxshiroq.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. ELEKTRON KONFIGURATSIYA
// ============================================================================
function ElektronKonfiguratsiya() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 Elektron konfiguratsiya va o'tishlar</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-cyan-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-cyan-400 font-bold mb-3">Kristall maydon diagrammasi:</h4>
            <div className="font-mono text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-purple-700/30 pb-2">
                <span className="text-red-400 w-24">e<sub>g</sub>*</span>
                <div className="flex gap-2">
                  <span className="text-purple-500">__</span>
                  <span className="text-purple-500">__</span>
                </div>
                <span className="text-purple-500">bo'sh</span>
              </div>

              <div className="text-center text-cyan-400 text-[10px] py-1">
                Δ<sub>o</sub> = 34,100 cm⁻¹ (juda kuchli!)
              </div>

              <div className="flex justify-between items-center border-t border-purple-700/30 pt-2">
                <span className="text-emerald-400 w-24">t₂g</span>
                <div className="flex gap-2">
                  <span className="text-yellow-400">↑↓</span>
                  <span className="text-yellow-400">↑↓</span>
                  <span className="text-yellow-400">↑↓</span>
                </div>
                <span className="text-emerald-400">6 e⁻</span>
              </div>

              <div className="bg-cyan-900/30 border border-cyan-500/30 rounded p-2 text-center mt-3">
                <p className="text-[10px] text-purple-300">Konfiguratsiya:</p>
                <p className="text-cyan-400 font-bold">t₂g⁶ e<sub>g</sub>⁰</p>
                <p className="text-[10px] text-purple-400 mt-1">¹A₁g ground state</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-cyan-400 font-bold mb-3">d-d o'tishlar:</h4>
            <div className="space-y-2 text-xs">
              <div className="bg-purple-900/50 rounded p-2">
                <div className="flex justify-between">
                  <span className="text-cyan-400 font-bold">¹A₁g → ¹T₁g</span>
                  <span className="text-emerald-400 font-mono">~345 nm</span>
                </div>
                <p className="text-purple-400 text-[10px] mt-1">Birinchi o'tish — UV sohada</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <div className="flex justify-between">
                  <span className="text-cyan-400 font-bold">¹A₁g → ¹T₂g</span>
                  <span className="text-emerald-400 font-mono">~290 nm</span>
                </div>
                <p className="text-purple-400 text-[10px] mt-1">Ikkinchi o'tish — chuqur UV</p>
              </div>
            </div>

            <div className="mt-3 bg-yellow-900/20 border border-yellow-500/30 rounded p-2 text-[10px]">
              <p className="text-yellow-400 font-bold">Nima uchun UV da?</p>
              <p className="text-purple-300">
                Δ<sub>o</sub> = 34,100 cm⁻¹ — Co³⁺ (22,900) dan 50% katta!
                Sababi: 4d orbitallar kengroq → kuchliroq bog'lanish.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. Co³⁺ vs Rh³⁺ vs Ir³⁺ SOLISHTIRISH
// ============================================================================
function Solishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Co³⁺ vs Rh³⁺ vs Ir³⁺ — 9-guruh solishtirilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-cyan-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-blue-400">[Co(en)₃]³⁺</th>
                <th className="text-center py-3 px-2 text-cyan-400">[Rh(en)₃]³⁺</th>
                <th className="text-center py-3 px-2 text-purple-400">[Ir(en)₃]³⁺</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Metal", "Co³⁺ (3d⁶)", "Rh³⁺ (4d⁶)", "Ir³⁺ (5d⁶)"],
                ["Atom raqami", "Z = 27", "Z = 45", "Z = 77"],
                ["Spin", "S=0 (LS)", "S=0 (LS)", "S=0 (LS)"],
                ["Magnit", "Diamagnit", "Diamagnit", "Diamagnit"],
                ["Δ_o (cm⁻¹)", "22,900", "34,100", "41,000"],
                ["λ_max (¹T₁g)", "470 nm", "345 nm", "310 nm"],
                ["Δε (CD)", "±2.0", "±4.0", "±8.0"],
                ["SOC kuchi", "Kuchsiz", "O'rtacha", "Kuchli"],
                ["Rang", "Sariq", "Rangsiz", "Rangsiz"],
                ["Barqarorlik", "Yuqori", "Juda yuqori", "Eng yuqori"],
                ["Kinetik inertlik", "Inert", "Juda inert", "Eng inert"],
                ["Narx", "Arzon", "Qimmat", "Juda qimmat"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-blue-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-cyan-400">{r[2]}</td>
                  <td className="py-2 px-2 text-center text-purple-400">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-cyan-600/10 border border-cyan-500/30 rounded-lg p-3 text-xs">
          <p className="text-cyan-400 font-bold mb-1">💡 Asosiy tendentsiyalar (3d → 4d → 5d):</p>
          <p className="text-purple-200">
            <strong>Δ<sub>o</sub> oshadi</strong> → d-d o'tishlar UV ga siljiydi
            <br/>
            <strong>CD signali kuchayadi</strong> → SOC ortadi
            <br/>
            <strong>Kinetik inertlik oshadi</strong> → ligand almashinishi sekinlashadi
            <br/>
            <strong>Barqarorlik oshadi</strong> → termodinamik va kinetik
            <br/>
            <strong>Narx oshadi</strong> → Co (arzon) → Rh (qimmat) → Ir (juda qimmat)
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. XELAT KONFORMATSIYA
// ============================================================================
function ChelateConformation() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 Xelat halqasi konformatsiyasi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-cyan-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-5">
            <h4 className="text-emerald-400 font-bold mb-2">lel konformatsiya</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ Δ-[Rh(en)₃]³⁺ + λλλ xelat</li>
              <li>✓ Λ-[Rh(en)₃]³⁺ + δδδ xelat</li>
              <li>✓ <strong>Eng barqaror</strong></li>
              <li>✓ Sterik to'siq minimal</li>
              <li>✓ CD: kuchli Cotton effekti</li>
            </ul>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-5">
            <h4 className="text-red-400 font-bold mb-2">ob konformatsiya</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ Δ-[Rh(en)₃]³⁺ + δδδ xelat</li>
              <li>✓ Λ-[Rh(en)₃]³⁺ + λλλ xelat</li>
              <li>✓ <strong>Kam barqaror</strong></li>
              <li>✓ Sterik to'siq mavjud</li>
              <li>✓ CD: kuchsiz/teskari signal</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Rh³⁺ da xelat konformatsiyasi:</p>
          <p className="text-purple-200">
            Rh³⁺ <strong>kinetik juda inert</strong> — xelat halqasi konformatsiyasi
            <strong>o'zgarmaydi</strong> (Co³⁺ dan ham barqaror).
            Shuning uchun lel va ob diastereomerlar <strong>alohida ajratilishi</strong> mumkin.
            Bu <strong>CD spektroskopiyasi</strong>da aniq signallar beradi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. TARIXIY KONTEKST
// ============================================================================
function TarixiyKontekst() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — Rodiy kimyosi</h3>

      <div className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 rounded-xl p-5 border border-cyan-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">1803 — Rodiy kashf etilishi</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>William Hyde Wollaston</strong> (Angliya) rodiyni kashf etdi.
                  Yunoncha "rhodon" (pushti) — tuzlarining rangidan.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1950-60 — Rh(en)₃]³⁺ CD tadqiqotlari</p>
                <p className="text-purple-200 text-xs mt-1">
                  [Rh(en)₃]³⁺ ning CD spektri o'rganildi. Co(III) analogiga qaraganda
                  <strong> kuchliroq CD signallar</strong> aniqlandi. Empirik qoida tasdiqlandi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🧪</div>
              <div>
                <p className="text-yellow-400 font-bold">1970+ — Kataliz va fotokimyo</p>
                <p className="text-purple-200 text-xs mt-1">
                  Rh komplekslari <strong>gomogen kataliz</strong>da (Wilkinson katalizatori)
                  va <strong>fotokimyo</strong>da keng qo'llanila boshladi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 [Rh(en)₃]³⁺ ning ahamiyati:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>CD spektroskopiyasi standarti</strong> — kuchli Cotton effekti</li>
            <li><strong>Empirik qoida tasdig'i</strong> — Δ → musbat, Λ → manfiy</li>
            <li><strong>Kinetik inert</strong> — barqaror enantiomerlar</li>
            <li><strong>Og'ir atom effekti</strong> — kuchli SOC, intensiv CD</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function RhEn3CD() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <nav className="flex items-center gap-2 text-sm flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300">Tahlil</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/cd" className="text-purple-400 hover:text-purple-300">CD</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/cd/birikmalar" className="text-purple-400 hover:text-purple-300">Birikmalar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-cyan-400">[Rh(en)₃]³⁺</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">🔄 [Rh(en)₃]³⁺ — CD tahlili</h1>
          <p className="text-purple-400 text-sm">
            Rh³⁺ (4d⁶ LS) • Δ/Λ enantiomerlar • Kuchli CD • Og'ir atom effekti
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-cyan-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-cyan-400">[Rh(en)₃]³⁺</span>
            <div>
              <h2 className="text-xl font-bold text-white">CD tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Tris(etilendiamin)rodiy(III)" — 4d metall CD klassikasi</p>
            </div>
          </div>

          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Rh(en)₃]³⁺ — <strong className="text-cyan-400">[Co(en)₃]³⁺ ning 4d analogi</strong>.
              Rh³⁺ (4d⁶ LS) <strong>kuchli spin-orbital coupling</strong>ga ega →
              CD signallari <strong>2 marta kuchliroq</strong> (Δε ≈ ±4.0 vs ±2.0).
              d-d o'tishlar <strong>UV sohada</strong> (λ<sub>max</sub> = 345 nm) — Δ<sub>o</sub> juda katta (34,100 cm⁻¹).
              <strong> Kinetik juda inert</strong> — enantiomerlar barqaror.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-cyan-400 font-bold text-lg">Rh³⁺ (4d⁶)</p>
              <p className="text-purple-300">LS, t₂g⁶</p>
              <p className="text-purple-400 mt-1">S = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-cyan-400 font-bold text-lg">Δ/Λ</p>
              <p className="text-purple-300">enantiomerlar</p>
              <p className="text-purple-400 mt-1">xiral markaz</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-cyan-400 font-bold text-lg">λ<sub>max</sub> = 345</p>
              <p className="text-purple-300">nm (UV)</p>
              <p className="text-purple-400 mt-1">¹T₁g o'tish</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-cyan-400 font-bold text-lg">Δε ≈ ±4.0</p>
              <p className="text-purple-300">M⁻¹cm⁻¹</p>
              <p className="text-purple-400 mt-1">2× kuchli</p>
            </div>
          </div>
        </div>

        {/* CD SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CDSpectrumSimulator />
        </div>

        {/* Δ vs Λ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <DeltaLambdaVisualization />
        </div>

        {/* OG'IR ATOM EFFEKTI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <HeavyAtomEffect />
        </div>

        {/* ELEKTRON KONFIGURATSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ElektronKonfiguratsiya />
        </div>

        {/* XELAT KONFORMATSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ChelateConformation />
        </div>

        {/* SOLISHTIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Solishtirish />
        </div>

        {/* TARIX */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TarixiyKontekst />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Rh(en)₃]³⁺ — <strong className="text-cyan-400">[Co(en)₃]³⁺ ning 4d analogi</strong></li>
            <li>Rh³⁺ (4d⁶ LS, t₂g⁶) — <strong>diamagnit</strong>, S=0</li>
            <li><strong>Kuchli spin-orbital coupling</strong> → Δε ≈ ±4.0 (2× kuchli)</li>
            <li>d-d o'tishlar <strong>UV sohada</strong>: ¹T₁g (345 nm), ¹T₂g (290 nm)</li>
            <li>Δ<sub>o</sub> = <strong>34,100 cm⁻¹</strong> — Co³⁺ dan 50% katta</li>
            <li>Δ-izomer → <strong>musbat</strong> Cotton effekti (empirik qoida)</li>
            <li>Λ-izomer → <strong>manfiy</strong> Cotton effekti</li>
            <li><strong>Kinetik juda inert</strong> — enantiomerlar barqaror</li>
            <li><strong>Og'ir atom effekti</strong>: 3d → 4d → 5d da CD kuchayadi</li>
            <li>CD spektroskopiyasida <strong>absolyut konfiguratsiya standarti</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/cd/birikmalar/ru-bpy3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Ru(bpy)₃]²⁺
          </Link>
          <Link href="/ilmiy/tahlil/cd/birikmalar/co-r-pn3" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold">
            [Co(R-pn)₃]³⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}