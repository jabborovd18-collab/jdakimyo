"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. CD SPEKTR SIMULYATORI ([Fe(phen)₃]²⁺ uchun)
// ============================================================================
function CDSpectrumSimulator() {
  const [enantiomer, setEnantiomer] = useState("delta")
  const [ee, setEe] = useState(100)
  const [showMLCT, setShowMLCT] = useState(true)

  // [Fe(phen)₃]²⁺ xarakterli parametrlar
  // ¹A₁g → ¹T₁g: ~510 nm (d-d o'tish, ko'rinadigan)
  // ¹A₁g → ¹T₂g: ~360 nm (d-d o'tish, UV)
  // MLCT: ~265 nm (kuchli, intensiv)
  const bands = [
    { lambda_max: 510, epsilon: 900, delta_epsilon_max: 3.5, assign: "¹A₁g → ¹T₁g (d-d)", type: "dd" },
    { lambda_max: 360, epsilon: 2500, delta_epsilon_max: -5.0, assign: "¹A₁g → ¹T₂g (d-d)", type: "dd" },
    { lambda_max: 265, epsilon: 12000, delta_epsilon_max: 15.0, assign: "MLCT (Fe→phen)", type: "mlct" },
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
        if (!showMLCT && band.type === "mlct") return
        
        const x = (lambda - band.lambda_max) / 35
        
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
  }, [enantiomer, ee, sign, eeFactor, showMLCT])

  const maxCotton = Math.max(...spectrum.map(p => Math.abs(p.cotton)), 0.1)
  const maxAbs = Math.max(...spectrum.map(p => p.absorption), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 CD spektr simulyatori — [Fe(phen)₃]²⁺</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30 space-y-4">
        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-bold mb-2">💎 Kuchli CD signal — MLCT o'tishlar:</p>
          <p className="text-purple-200 text-xs">
            [Fe(phen)₃]²⁺ — <strong>eng kuchli CD signallaridan biri</strong> (Δε ≈ ±3.5).
            Sababi: fenantrolin <strong>katta π-sistema</strong>ga ega → <strong>MLCT (Metal-to-Ligand Charge Transfer)</strong>
            o'tishlar juda intensiv. MLCT cho'qqisi (265 nm) d-d o'tishlardan <strong>10 marta kuchli</strong>.
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
                    ? "bg-red-600/80 text-white shadow-lg" 
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
                className="w-full h-2 bg-purple-900 rounded accent-red-500" />
            </div>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input type="checkbox" checked={showMLCT}
                onChange={(e) => setShowMLCT(e.target.checked)}
                className="accent-red-500" />
              <span className="text-purple-300">MLCT o'tishni ko'rsatish (265 nm, juda kuchli)</span>
            </label>
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-red-400 font-bold text-xs mb-2">
            CD spektri va absorbsiya: {enantiomer === "delta" ? "Δ" : "Λ"}-[Fe(phen)₃]²⁺
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
              if (!showMLCT && band.type === "mlct") return null
              const x = 40 + ((band.lambda_max - 220) / 600) * 340
              return (
                <g key={idx}>
                  <line x1={x} y1="20" x2={x} y2="260" 
                    stroke={band.type === "mlct" ? "#f59e0b" : "#fbbf24"} 
                    strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x={x} y="15" fill={band.type === "mlct" ? "#f59e0b" : "#fbbf24"} fontSize="7" textAnchor="middle">
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
              fill="none" stroke={sign > 0 ? "#ef4444" : "#f43f5e"} strokeWidth="2"
            />

            {/* Legend */}
            <text x="280" y="30" fill="#fbbf24" fontSize="8">— Absorbsiya (ε)</text>
            <text x="280" y="45" fill={sign > 0 ? "#ef4444" : "#f43f5e"} fontSize="8">
              — CD (Δε)
            </text>
            {showMLCT && (
              <text x="280" y="60" fill="#f59e0b" fontSize="8">
                ★ MLCT (265 nm)
              </text>
            )}
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className={`rounded-lg p-3 ${enantiomer === "delta" ? "bg-red-900/30 border border-red-500/50" : "bg-purple-900/50"}`}>
            <p className="text-purple-400">Enantiomer</p>
            <p className={`font-bold ${enantiomer === "delta" ? "text-red-400" : "text-rose-400"}`}>
              {enantiomer === "delta" ? "Δ (delta)" : "Λ (lambda)"}
            </p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Birinchi Cotton</p>
            <p className={`font-bold ${sign > 0 ? "text-emerald-400" : "text-red-400"}`}>
              {sign > 0 ? "Musbat (+)" : "Manfiy (−)"}
            </p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">ee</p>
            <p className="text-yellow-400 font-bold">{ee}%</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 MLCT nima uchun kuchli?</p>
          <p className="text-purple-200">
            <strong>MLCT (Metal-to-Ligand Charge Transfer)</strong> — elektron Fe²⁺ dan phen ligandiga ko'chadi.
            Bu <strong>to'liq ruxsat etilgan</strong> o'tish (Laporte va spin ruxsat) → ε juda katta (~12000 M⁻¹cm⁻¹).
            CD signali ham kuchli (Δε ≈ ±15) — phen ning <strong>katta π-sistemasi</strong> xiral muhitni kuchli his qiladi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. PHEN LIGAND STRUKTURASI
// ============================================================================
function PhenLigand() {
  const [showResonance, setShowResonance] = useState(false)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 Fenantrolin (phen) ligand strukturasi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-red-400 font-bold mb-3">Fenantrolin (C₁₂H₈N₂):</h4>
            <svg viewBox="0 0 200 180" className="w-full h-44">
              {/* 3 ta birikkan halqa */}
              {/* Chap halqa */}
              <polygon 
                points="40,60 60,50 80,60 80,80 60,90 40,80" 
                fill="none" 
                stroke="#a78bfa" 
                strokeWidth="1.5"
              />
              
              {/* O'rta halqa */}
              <polygon 
                points="80,60 100,50 120,60 120,80 100,90 80,80" 
                fill="none" 
                stroke="#a78bfa" 
                strokeWidth="1.5"
              />
              
              {/* O'ng halqa */}
              <polygon 
                points="120,60 140,50 160,60 160,80 140,90 120,80" 
                fill="none" 
                stroke="#a78bfa" 
                strokeWidth="1.5"
              />

              {/* N atomlari */}
              <circle cx="60" cy="90" r="8" fill="#3b82f6" />
              <text x="60" y="93" fill="white" fontSize="7" textAnchor="middle">N</text>
              
              <circle cx="140" cy="90" r="8" fill="#3b82f6" />
              <text x="140" y="93" fill="white" fontSize="7" textAnchor="middle">N</text>

              {/* Xelat belgisi */}
              <path d="M 60 90 Q 100 110 140 90" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="100" y="120" fill="#ef4444" fontSize="8" textAnchor="middle">N,N-xelat</text>

              <text x="100" y="145" fill="#a78bfa" fontSize="9" textAnchor="middle">
                C₁₂H₈N₂ (fenantrolin)
              </text>
              <text x="100" y="160" fill="#ef4444" fontSize="8" textAnchor="middle">
                Katta π-sistema (14 π-e⁻)
              </text>
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-red-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Zaryad:</span>
                <span className="text-red-400 font-bold">0 (neytral)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Donor atomlar:</span>
                <span className="text-blue-400 font-bold">2 × N (N,N-xelat)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Xelat halqasi:</span>
                <span className="text-emerald-400">5 a'zoli (Fe-N-C-C-N)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Maydon kuchi:</span>
                <span className="text-yellow-400">Juda kuchli</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">π-xususiyati:</span>
                <span className="text-purple-200">π-akseptor (kuchli)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">π-elektronlar:</span>
                <span className="text-red-400">14 ta (3 halqa)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun phen kuchli maydon?</p>
          <p className="text-purple-200">
            Fenantrolin — <strong>kuchli σ-donor</strong> (N atomlari) va <strong>kuchli π-akseptor</strong> (katta π-sistema).
            Bu <strong>katta Δ<sub>o</sub></strong> yaratadi → LS holatni afzal ko'radi.
            <br/>
            π-akseptor xususiyati <strong>MLCT o'tishlariga</strong> imkon beradi — elektron Fe²⁺ dan phen ga ko'chadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. Δ vs Λ 3D VIZUALIZATSIYA
// ============================================================================
function DeltaLambdaVisualization() {
  const [rotate, setRotate] = useState(0)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔷 Δ va Λ enantiomerlar — 3D vizualizatsiya</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30 space-y-4">
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Aylantirish burchagi:</span>
            <span className="text-emerald-400 font-mono">{rotate}°</span>
          </label>
          <input type="range" min="0" max="360" step="5" value={rotate}
            onChange={(e) => setRotate(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-red-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Δ */}
          <div className="bg-red-900/20 border-2 border-red-500/30 rounded-xl p-4">
            <h4 className="text-red-400 font-bold mb-2 text-center">Δ (delta) — P-helis</h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* C₃ o'qi */}
              <line x1="100" y1="20" x2="100" y2="180" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />
              <text x="110" y="15" fill="#fbbf24" fontSize="8">C₃</text>

              {/* Markaziy Fe */}
              <circle cx="100" cy="100" r="15" fill="#ef4444" />
              <text x="100" y="105" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Fe</text>

              {/* 3 ta phen ligand (spiral) */}
              {Array.from({ length: 3 }).map((_, i) => {
                const angle = (i * 120 + rotate) * Math.PI / 180
                const x1 = 100 + 40 * Math.cos(angle)
                const y1 = 100 + 40 * Math.sin(angle)
                const x2 = 100 + 75 * Math.cos(angle + 0.4)
                const y2 = 100 + 75 * Math.sin(angle + 0.4)
                return (
                  <g key={i}>
                    <line x1="100" y1="100" x2={x1} y2={y1} stroke="#f87171" strokeWidth="2" />
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f87171" strokeWidth="2" />
                    <circle cx={x1} cy={y1} r="5" fill="#3b82f6" />
                    <circle cx={x2} cy={y2} r="5" fill="#3b82f6" />
                    <text x={(x1+x2)/2} y={(y1+y2)/2 - 5} fill="#fca5a5" fontSize="7" textAnchor="middle">phen</text>
                  </g>
                )
              })}

              {/* Spiral yo'nalishi */}
              <path d="M 100 50 Q 140 75 145 100 Q 140 125 100 150" 
                fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="155" y="100" fill="#fbbf24" fontSize="8">O'ng vint →</text>
            </svg>
            <p className="text-red-400 text-xs text-center mt-2">
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

              {/* Markaziy Fe */}
              <circle cx="100" cy="100" r="15" fill="#f43f5e" />
              <text x="100" y="105" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Fe</text>

              {/* 3 ta phen ligand (teskari spiral) */}
              {Array.from({ length: 3 }).map((_, i) => {
                const angle = (i * 120 - rotate) * Math.PI / 180
                const x1 = 100 + 40 * Math.cos(angle)
                const y1 = 100 + 40 * Math.sin(angle)
                const x2 = 100 + 75 * Math.cos(angle - 0.4)
                const y2 = 100 + 75 * Math.sin(angle - 0.4)
                return (
                  <g key={i}>
                    <line x1="100" y1="100" x2={x1} y2={y1} stroke="#fb7185" strokeWidth="2" />
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fb7185" strokeWidth="2" />
                    <circle cx={x1} cy={y1} r="5" fill="#3b82f6" />
                    <circle cx={x2} cy={y2} r="5" fill="#3b82f6" />
                    <text x={(x1+x2)/2} y={(y1+y2)/2 - 5} fill="#fda4af" fontSize="7" textAnchor="middle">phen</text>
                  </g>
                )
              })}

              {/* Spiral yo'nalishi */}
              <path d="M 100 50 Q 60 75 55 100 Q 60 125 100 150" 
                fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="20" y="100" fill="#fbbf24" fontSize="8">← Chap vint</text>
            </svg>
            <p className="text-rose-400 text-xs text-center mt-2">
              C₃ o'qi bo'ylab chapga burilgan
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💎 Qizil rang sababi:</p>
          <p className="text-purple-200">
            [Fe(phen)₃]²⁺ — <strong>qizil rangli</strong>. Sababi: MLCT o'tish (265 nm) va d-d o'tishlar (510 nm).
            510 nm da <strong>yashil yutilish</strong> → komplementar rang <strong className="text-red-400">qizil</strong>.
            Bu rang <strong>juda intensiv</strong> — ε ≈ 900 M⁻¹cm⁻¹ (d-d uchun g'ayrioddiy yuqori).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. MLCT O'TISHLAR
// ============================================================================
function MLCTTransitions() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ MLCT (Metal-to-Ligand Charge Transfer)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30 space-y-4">
        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-bold mb-2">💎 MLCT nima?</p>
          <p className="text-purple-200 text-xs">
            <strong>MLCT</strong> — elektron <strong>metall d-orbitalidan</strong> ligandning <strong>π*-orbitaliga</strong> ko'chadi.
            Bu <strong>to'liq ruxsat etilgan</strong> o'tish → ε juda katta (10⁴ M⁻¹cm⁻¹).
            [Fe(phen)₃]²⁺ da MLCT <strong>265 nm</strong> da joylashgan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-red-400 font-bold mb-3">MLCT mexanizmi:</h4>
            <div className="space-y-2 text-xs">
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-300">1. Fe²⁺ (d⁶) — elektronlar t₂g da</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-300">2. phen — π* antibonding orbitallar bo'sh</p>
              </div>
              <div className="bg-red-900/30 border border-red-500/30 rounded p-2">
                <p className="text-red-400 font-bold">3. hν yutilishi → e⁻ Fe → phen</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-300">4. Vaqtincha Fe³⁺-phen⁻ holat</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-red-400 font-bold mb-3">MLCT xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">λ<sub>max</sub>:</span>
                <span className="text-red-400 font-mono">265 nm (UV)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">ε:</span>
                <span className="text-red-400 font-mono">12,000 M⁻¹cm⁻¹</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Δε (CD):</span>
                <span className="text-red-400 font-mono">±15 M⁻¹cm⁻¹</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Ruxsat:</span>
                <span className="text-emerald-400">To'liq ruxsat</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-red-400 font-bold text-xs mb-2">MLCT energiya diagrammasi:</h5>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            {/* Energiya o'qi */}
            <line x1="50" y1="180" x2="50" y2="20" stroke="#4c1d95" strokeWidth="1" />
            <text x="30" y="100" fill="#c4b5fd" fontSize="9" textAnchor="middle" transform="rotate(-90, 30, 100)">
              Energiya
            </text>

            {/* Fe t₂g */}
            <rect x="80" y="120" width="80" height="30" fill="#ef4444" opacity="0.3" stroke="#ef4444" strokeWidth="1" />
            <text x="120" y="140" fill="#ef4444" fontSize="9" textAnchor="middle">Fe t₂g (d⁶)</text>

            {/* phen π* */}
            <rect x="240" y="50" width="80" height="30" fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1" />
            <text x="280" y="70" fill="#3b82f6" fontSize="9" textAnchor="middle">phen π*</text>

            {/* MLCT strelka */}
            <line x1="160" y1="135" x2="240" y2="65" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrow)" />
            <defs>
              <marker id="arrow" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#fbbf24" />
              </marker>
            </defs>
            <text x="200" y="95" fill="#fbbf24" fontSize="10" textAnchor="middle" fontWeight="bold">
              MLCT (265 nm)
            </text>

            {/* hν */}
            <text x="200" y="110" fill="#fbbf24" fontSize="8" textAnchor="middle">
              hν = 4.7 eV
            </text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun MLCT kuchli CD beradi?</p>
          <p className="text-purple-200">
            MLCT o'tishda elektron <strong>phen π* orbitaliga</strong> ko'chadi. phen <strong>katta π-sistema</strong>ga ega →
            xiral muhitni <strong>kuchli his qiladi</strong>. Natijada CD signali <strong>juda intensiv</strong> (Δε ≈ ±15).
            Bu d-d o'tishlardan (Δε ≈ ±3.5) <strong>4 marta kuchli</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. ELEKTRON KONFIGURATSIYA VA O'TISHLAR
// ============================================================================
function ElektronKonfiguratsiya() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 Elektron konfiguratsiya va o'tishlar</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-red-400 font-bold mb-3">Kristall maydon diagrammasi:</h4>
            <div className="font-mono text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-purple-700/30 pb-2">
                <span className="text-red-400 w-24">e<sub>g</sub>*</span>
                <div className="flex gap-2">
                  <span className="text-purple-500">__</span>
                  <span className="text-purple-500">__</span>
                </div>
                <span className="text-purple-500">bo'sh</span>
              </div>

              <div className="text-center text-red-400 text-[10px] py-1">
                Δ<sub>o</sub> = 20,500 cm⁻¹ (kuchli maydon)
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

              <div className="bg-red-900/30 border border-red-500/30 rounded p-2 text-center mt-3">
                <p className="text-[10px] text-purple-300">Konfiguratsiya:</p>
                <p className="text-red-400 font-bold">t₂g⁶ e<sub>g</sub>⁰</p>
                <p className="text-[10px] text-purple-400 mt-1">¹A₁g ground state</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-red-400 font-bold mb-3">O'tishlar:</h4>
            <div className="space-y-2 text-xs">
              <div className="bg-purple-900/50 rounded p-2">
                <div className="flex justify-between">
                  <span className="text-red-400 font-bold">¹A₁g → ¹T₁g (d-d)</span>
                  <span className="text-emerald-400 font-mono">~510 nm</span>
                </div>
                <p className="text-purple-400 text-[10px] mt-1">Birinchi d-d o'tish — CD da asosiy signal</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <div className="flex justify-between">
                  <span className="text-red-400 font-bold">¹A₁g → ¹T₂g (d-d)</span>
                  <span className="text-emerald-400 font-mono">~360 nm</span>
                </div>
                <p className="text-purple-400 text-[10px] mt-1">Ikkinchi d-d o'tish</p>
              </div>
              <div className="bg-red-900/30 border border-red-500/30 rounded p-2">
                <div className="flex justify-between">
                  <span className="text-red-400 font-bold">MLCT (Fe→phen)</span>
                  <span className="text-red-400 font-mono">~265 nm</span>
                </div>
                <p className="text-red-400 text-[10px] mt-1">Kuchli, intensiv — CD da juda kuchli</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun λ<sub>max</sub> = 510 nm?</p>
          <p className="text-purple-200">
            Phen — <strong>kuchli maydon ligandi</strong> (σ-donor + π-akseptor).
            Bu <strong>katta Δ<sub>o</sub></strong> yaratadi (20,500 cm⁻¹).
            Lekin [Co(en)₃]³⁺ (Δ<sub>o</sub> = 22,900 cm⁻¹) dan <strong>biroz kichik</strong>.
            Sababi: Fe²⁺ (d⁶) — Co³⁺ (d⁶) dan <strong>past zaryad</strong> → kuchsizroq maydon.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. FOTOFIZIK XUSUSIYATLAR
// ============================================================================
function PhotophysicalProperties() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💡 Fotofizik xususiyatlar — lyuminestsensiya</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30 space-y-4">
        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-bold mb-2">💎 Lyuminestsensiya:</p>
          <p className="text-purple-200 text-xs">
            [Fe(phen)₃]²⁺ — <strong>zaif lyuminessent</strong> (MLCT holatidan).
            Lekin [Ru(bpy)₃]²⁺ (analog) — <strong>kuchli lyuminessent</strong> (Φ ≈ 0.04).
            Fe²⁺ da <strong>tez ichki konversiya</strong> (d-d holatlar orqali) → lyuminestsensiya kuchsiz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-red-400 font-bold mb-3">[Fe(phen)₃]²⁺:</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>• Lyuminestsensiya: <strong>zaif</strong></li>
              <li>• Hayot vaqti: <strong>~100 ps</strong> (juda qisqa)</li>
              <li>• Sababi: tez d-d o'tish (MC holat)</li>
              <li>• Qo'llanilishi: <strong>sensorlar</strong> (zaif)</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-red-400 font-bold mb-3">[Ru(bpy)₃]²⁺ (analog):</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>• Lyuminestsensiya: <strong>kuchli</strong></li>
              <li>• Hayot vaqti: <strong>~600 ns</strong> (uzun)</li>
              <li>• Sababi: Ru³⁺ og'ir atom → ISC tez</li>
              <li>• Qo'llanilishi: <strong>solar cells, LED</strong></li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Fe zaif, Ru kuchli?</p>
          <p className="text-purple-200">
            <strong>Fe²⁺</strong> — yengil atom → <strong>spin-orbital coupling kuchsiz</strong> →
            MLCT holatidan d-d holatiga <strong>tez ichki konversiya</strong> → lyuminestsensiya kuchsiz.
            <br/>
            <strong>Ru²⁺</strong> — og'ir atom → <strong>kuchli spin-orbital coupling</strong> →
            <strong>intersystem crossing (ISC)</strong> tez → triplet holatdan lyuminestsensiya kuchli.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. SOLISHTIRISH - TRIS-XELATLAR
// ============================================================================
function Solishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Tris-xelat komplekslar solishtirilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-blue-400">[Co(en)₃]³⁺</th>
                <th className="text-center py-3 px-2 text-indigo-400">[Co(ox)₃]³⁻</th>
                <th className="text-center py-3 px-2 text-emerald-400">[Cr(acac)₃]</th>
                <th className="text-center py-3 px-2 text-red-400">[Fe(phen)₃]²⁺</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Metal", "Co³⁺", "Co³⁺", "Cr³⁺", "Fe²⁺"],
                ["dⁿ", "d⁶", "d⁶", "d³", "d⁶"],
                ["Spin", "S=0", "S=0", "S=3/2", "S=0"],
                ["Magnit", "Diamagnit", "Diamagnit", "Paramagnit", "Diamagnit"],
                ["Zaryad", "+3", "−3", "0", "+2"],
                ["Ligand", "en", "ox²⁻", "acac⁻", "phen"],
                ["π-sistema", "Yo'q", "Kuchsiz", "Kuchsiz", "Kuchli"],
                ["MLCT", "Yo'q", "Yo'q", "Yo'q", "Bor (265 nm)"],
                ["λ_max (d-d)", "470 nm", "560 nm", "580 nm", "510 nm"],
                ["Δε (d-d)", "±2.0", "±1.5", "±0.8", "±3.5"],
                ["Δε (MLCT)", "—", "—", "—", "±15"],
                ["Rang", "Sariq", "Qizil", "Qizil-binafsha", "Qizil"],
                ["Lyumin.", "Yo'q", "Yo'q", "Yo'q", "Zaif"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-blue-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-indigo-400">{r[2]}</td>
                  <td className="py-2 px-2 text-center text-emerald-400">{r[3]}</td>
                  <td className="py-2 px-2 text-center text-red-400">{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-red-600/10 border border-red-500/30 rounded-lg p-3 text-xs">
          <p className="text-red-400 font-bold mb-1">💡 [Fe(phen)₃]²⁺ ning o'ziga xosligi:</p>
          <p className="text-purple-200">
            <strong>Kuchli π-akseptor ligand</strong> (phen) → <strong>MLCT o'tishlar</strong> mavjud.
            Bu uni boshqa tris-xelatlardan <strong>keskin farqlaydi</strong>.
            <br/>
            <strong>Eng kuchli CD signali</strong> — Δε ≈ ±15 (MLCT) va ±3.5 (d-d).
            <br/>
            <strong>Qizil rang</strong> — intensiv d-d va MLCT o'tishlar tufayli.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 8. TARIXIY KONTEKST
// ============================================================================
function TarixiyKontekst() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — [Fe(phen)₃]²⁺</h3>

      <div className="bg-gradient-to-br from-red-900/30 to-purple-900/30 rounded-xl p-5 border border-red-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">1879 — Fenantrolin sintezi</p>
                <p className="text-purple-200 text-xs mt-1">
                  1,10-fenantrolin birinchi marta sintez qilingan.
                  <strong> Heterotsiklik azot ligand</strong> — koordinatsion kimyoda keng qo'llaniladi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1930-50 — Metallocomplexes</p>
                <p className="text-purple-200 text-xs mt-1">
                  [Fe(phen)₃]²⁺ sintez qilindi va uning <strong>qizil rangi</strong> va
                  <strong> intensiv absorbsiyasi</strong> aniqlandi. MLCT o'tishlar tushunchasi shakllandi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📊</div>
              <div>
                <p className="text-yellow-400 font-bold">1960-70 — CD spektroskopiyasi</p>
                <p className="text-purple-200 text-xs mt-1">
                  [Fe(phen)₃]²⁺ CD spektroskopiyasida <strong>eng kuchli signallardan biri</strong>ga ega ekanligi ko'rsatildi.
                  MLCT o'tishlar CD da ham <strong>juda intensiv</strong> (Δε ≈ ±15).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🧪</div>
              <div>
                <p className="text-yellow-400 font-bold">Hozirgi qo'llanilishi</p>
                <p className="text-purple-200 text-xs mt-1">
                  [Fe(phen)₃]²⁺ va uning analoglari <strong>sensorlar</strong>, <strong>fotoelektrik qurilmalar</strong>,
                  <strong>biologik markerlar</strong> sifatida qo'llaniladi.
                  Ferroin indikatori — [Fe(phen)₃]²⁺/³⁺ redoks jufti.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Ferroin indikatori:</p>
          <p className="text-purple-200">
            <strong>Ferroin</strong> — [Fe(phen)₃]²⁺ (qizil) / [Fe(phen)₃]³⁺ (och ko'k) redoks jufti.
            Titrlashda <strong>redoks indikatori</strong> sifatida ishlatiladi.
            E° = +1.06 V (vs SHE) — standart potensial.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function FePhen3CD() {
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
          <span className="text-red-400">[Fe(phen)₃]²⁺</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🔄 [Fe(phen)₃]²⁺ — CD tahlili</h1>
          <p className="text-purple-400 text-sm">
            Fe²⁺ (d⁶ LS) • Δ/Λ enantiomerlar • MLCT o'tishlar • Kuchli CD signal • Ferroin
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-red-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-red-400">[Fe(phen)₃]²⁺</span>
            <div>
              <h2 className="text-xl font-bold text-white">CD tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Tris(1,10-fenantrolin)temir(II)" — MLCT klassikasi</p>
            </div>
          </div>

          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Fe(phen)₃]²⁺ — <strong className="text-red-400">eng kuchli CD signallaridan biri</strong>ga ega kompleks.
              Fe²⁺ (d⁶ LS) <strong>¹A₁g ground state</strong>ga ega.
              Δ-izomer birinchi d-d o'tishda (¹A₁g → ¹T₁g, ~510 nm) <strong>musbat Cotton effekti</strong> (Δε ≈ ±3.5) beradi.
              MLCT o'tish (265 nm) esa <strong>juda kuchli</strong> (Δε ≈ ±15).
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">Fe²⁺ (LS)</p>
              <p className="text-purple-300">d⁶, t₂g⁶</p>
              <p className="text-purple-400 mt-1">S = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">Δ/Λ</p>
              <p className="text-purple-300">enantiomerlar</p>
              <p className="text-purple-400 mt-1">xiral markaz</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">λ<sub>max</sub> = 510</p>
              <p className="text-purple-300">nm</p>
              <p className="text-purple-400 mt-1">¹T₁g o'tish</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">Δε ≈ ±3.5</p>
              <p className="text-purple-300">M⁻¹cm⁻¹</p>
              <p className="text-purple-400 mt-1">Cotton effekti</p>
            </div>
          </div>
        </div>

        {/* CD SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CDSpectrumSimulator />
        </div>

        {/* PHEN LIGAND */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <PhenLigand />
        </div>

        {/* Δ vs Λ VIZUALIZATSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <DeltaLambdaVisualization />
        </div>

        {/* MLCT O'TISHLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <MLCTTransitions />
        </div>

        {/* ELEKTRON KONFIGURATSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ElektronKonfiguratsiya />
        </div>

        {/* FOTOFIZIK XUSUSIYATLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <PhotophysicalProperties />
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
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Fe(phen)₃]²⁺ — <strong className="text-red-400">eng kuchli CD signallaridan biri</strong></li>
            <li>Fe²⁺ (d⁶ LS, t₂g⁶) — <strong>diamagnit</strong>, S=0</li>
            <li>phen — <strong>kuchli π-akseptor ligand</strong>, katta π-sistema</li>
            <li><strong>MLCT o'tishlar</strong> (265 nm) — juda intensiv (ε ≈ 12000)</li>
            <li>Δ-izomer → birinchi d-d o'tishda <strong>musbat</strong> Cotton effekti</li>
            <li>Λ-izomer → birinchi d-d o'tishda <strong>manfiy</strong> Cotton effekti</li>
            <li>λ<sub>max</sub> ≈ 510 nm (¹A₁g → ¹T₁g), Δε ≈ ±3.5</li>
            <li>MLCT da Δε ≈ <strong>±15</strong> — d-d dan 4 marta kuchli</li>
            <li><strong>Qizil rang</strong> — intensiv d-d va MLCT o'tishlar</li>
            <li><strong>Ferroin indikatori</strong> — redoks titrlashda</li>
            <li>Fotofizik xususiyatlar — zaif lyuminestsensiya</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/cd/birikmalar/cr-acac3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Cr(acac)₃]
          </Link>
          <Link href="/ilmiy/tahlil/cd/birikmalar/ru-bpy3" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">
            [Ru(bpy)₃]²⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}