"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. CD SPEKTR SIMULYATORI ([Ru(bpy)₃]²⁺ uchun)
// ============================================================================
function CDSpectrumSimulator() {
  const [enantiomer, setEnantiomer] = useState("delta")
  const [ee, setEe] = useState(100)
  const [showExciton, setShowExciton] = useState(true)

  // [Ru(bpy)₃]²⁺ xarakterli parametrlar
  // MLCT: ~452 nm (ko'rinadigan, juda intensiv)
  // Eksiton coupling: ~285 nm (bisignate)
  // π-π*: ~245 nm (ligand ichki)
  const bands = [
    { lambda_max: 452, epsilon: 14600, delta_epsilon_max: 8.0, assign: "MLCT (Ru→bpy)", type: "mlct" },
    { lambda_max: 285, epsilon: 60000, delta_epsilon_max: 25.0, assign: "Eksiton coupling", type: "exciton" },
    { lambda_max: 245, epsilon: 40000, delta_epsilon_max: -15.0, assign: "π-π* (bpy)", type: "pi" },
  ]

  const sign = enantiomer === "delta" ? 1 : -1
  const eeFactor = ee / 100

  // CD spektri simulyatsiyasi
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 200 + i * 1.75 // 200-900 nm
      let cotton = 0
      let absorption = 0

      bands.forEach((band, idx) => {
        if (!showExciton && band.type === "exciton") return
        
        const x = (lambda - band.lambda_max) / 35
        
        let cottonBand
        if (band.type === "exciton") {
          // Eksiton coupling — bisignate (derivative of Gaussian)
          cottonBand = sign * x * Math.exp(-0.5 * x * x) * band.delta_epsilon_max * eeFactor
        } else {
          // Oddiy Cotton effekti
          cottonBand = sign * x * Math.exp(-0.5 * x * x) * band.delta_epsilon_max * eeFactor
        }
        
        // Absorbsiya (Gaussian)
        const absBand = Math.exp(-0.5 * x * x) * band.epsilon * eeFactor
        
        cotton += cottonBand
        absorption += absBand
      })

      points.push({ lambda, cotton, absorption })
    }
    return points
  }, [enantiomer, ee, sign, eeFactor, showExciton])

  const maxCotton = Math.max(...spectrum.map(p => Math.abs(p.cotton)), 0.1)
  const maxAbs = Math.max(...spectrum.map(p => p.absorption), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 CD spektr simulyatori — [Ru(bpy)₃]²⁺</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-4">
          <p className="text-amber-400 font-bold mb-2">💎 Eng intensiv CD — eksiton coupling:</p>
          <p className="text-purple-200 text-xs">
            [Ru(bpy)₃]²⁺ — <strong>eng kuchli CD signallaridan biri</strong> (Δε ≈ ±25).
            Sababi: uchta bpy ligand o'rtasida <strong>eksiton coupling</strong> → <strong>bisignate Cotton effekti</strong>.
            MLCT o'tish (452 nm) ham juda intensiv (Δε ≈ ±8). Bu uni <strong>absolyut konfiguratsiya aniqlash</strong>da
            ideal namuna qiladi.
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
                    ? "bg-amber-600/80 text-white shadow-lg" 
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
                className="w-full h-2 bg-purple-900 rounded accent-amber-500" />
            </div>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input type="checkbox" checked={showExciton}
                onChange={(e) => setShowExciton(e.target.checked)}
                className="accent-amber-500" />
              <span className="text-purple-300">Eksiton coupling ni ko'rsatish (285 nm, bisignate)</span>
            </label>
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-amber-400 font-bold text-xs mb-2">
            CD spektri va absorbsiya: {enantiomer === "delta" ? "Δ" : "Λ"}-[Ru(bpy)₃]²⁺
          </h5>
          <svg viewBox="0 0 400 280" className="w-full h-64">
            {/* O'qlar */}
            <line x1="40" y1="140" x2="380" y2="140" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="40" y1="20" x2="40" y2="260" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="275" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="270" fill="#a78bfa" fontSize="8">200</text>
            <text x="380" y="270" fill="#a78bfa" fontSize="8" textAnchor="end">900</text>
            <text x="20" y="140" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 140)">
              Δε / ε
            </text>

            {/* λ_max belgilari */}
            {bands.map((band, idx) => {
              if (!showExciton && band.type === "exciton") return null
              const x = 40 + ((band.lambda_max - 200) / 700) * 340
              return (
                <g key={idx}>
                  <line x1={x} y1="20" x2={x} y2="260" 
                    stroke={band.type === "exciton" ? "#f59e0b" : band.type === "mlct" ? "#ef4444" : "#fbbf24"} 
                    strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x={x} y="15" fill={band.type === "exciton" ? "#f59e0b" : band.type === "mlct" ? "#ef4444" : "#fbbf24"} fontSize="7" textAnchor="middle">
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
              fill="none" stroke={sign > 0 ? "#f59e0b" : "#f43f5e"} strokeWidth="2"
            />

            {/* Legend */}
            <text x="280" y="30" fill="#fbbf24" fontSize="8">— Absorbsiya (ε)</text>
            <text x="280" y="45" fill={sign > 0 ? "#f59e0b" : "#f43f5e"} fontSize="8">
              — CD (Δε)
            </text>
            {showExciton && (
              <text x="280" y="60" fill="#f59e0b" fontSize="8">
                ★ Eksiton (285 nm)
              </text>
            )}
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className={`rounded-lg p-3 ${enantiomer === "delta" ? "bg-amber-900/30 border border-amber-500/50" : "bg-purple-900/50"}`}>
            <p className="text-purple-400">Enantiomer</p>
            <p className={`font-bold ${enantiomer === "delta" ? "text-amber-400" : "text-rose-400"}`}>
              {enantiomer === "delta" ? "Δ (delta)" : "Λ (lambda)"}
            </p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Eksiton CD</p>
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
          <p className="text-yellow-400 font-bold mb-1">💡 Eksiton coupling nima?</p>
          <p className="text-purple-200">
            Uchta bpy ligand o'zaro <strong>elektron o'zaro ta'sir</strong> qiladi → <strong>eksiton coupling</strong>.
            Natijada CD spektrida <strong>bisignate</strong> (musbat + manfiy) shakl paydo bo'ladi.
            Bu <strong>absolyut konfiguratsiyani</strong> aniqlashda eng ishonchli usul.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. BPY LIGAND STRUKTURASI
// ============================================================================
function BpyLigand() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 2,2'-Bipiridin (bpy) ligand strukturasi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-amber-400 font-bold mb-3">Bipiridin (C₁₀H₈N₂):</h4>
            <svg viewBox="0 0 200 180" className="w-full h-44">
              {/* Chap halqa */}
              <polygon 
                points="40,60 60,50 80,60 80,80 60,90 40,80" 
                fill="none" 
                stroke="#a78bfa" 
                strokeWidth="1.5"
              />
              
              {/* Bog' */}
              <line x1="80" y1="70" x2="120" y2="70" stroke="#a78bfa" strokeWidth="2" />
              
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
              <path d="M 60 90 Q 100 110 140 90" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="100" y="120" fill="#f59e0b" fontSize="8" textAnchor="middle">N,N-xelat</text>

              <text x="100" y="145" fill="#a78bfa" fontSize="9" textAnchor="middle">
                C₁₀H₈N₂ (2,2'-bipiridin)
              </text>
              <text x="100" y="160" fill="#f59e0b" fontSize="8" textAnchor="middle">
                Katta π-sistema (12 π-e⁻)
              </text>
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-amber-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Zaryad:</span>
                <span className="text-amber-400 font-bold">0 (neytral)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Donor atomlar:</span>
                <span className="text-blue-400 font-bold">2 × N (N,N-xelat)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Xelat halqasi:</span>
                <span className="text-emerald-400">5 a'zoli (Ru-N-C-C-N)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Maydon kuchi:</span>
                <span className="text-yellow-400">Juda kuchli</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">π-xususiyati:</span>
                <span className="text-purple-200">π-akseptor (juda kuchli)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">π-elektronlar:</span>
                <span className="text-amber-400">12 ta (2 halqa)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 bpy vs phen farqi:</p>
          <p className="text-purple-200">
            <strong>bpy</strong> — ikkita piridin halqasi (12 π-e⁻), erkin aylanadi.
            <br/>
            <strong>phen</strong> — uchta birikkan halqa (14 π-e⁻), qattiq struktura.
            <br/>
            Ikkalasi ham <strong>kuchli π-akseptor</strong>, lekin phen biroz kuchliroq.
            [Ru(bpy)₃]²⁺ va [Ru(phen)₃]²⁺ xossalari deyarli bir xil.
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

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Aylantirish burchagi:</span>
            <span className="text-emerald-400 font-mono">{rotate}°</span>
          </label>
          <input type="range" min="0" max="360" step="5" value={rotate}
            onChange={(e) => setRotate(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-amber-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Δ */}
          <div className="bg-amber-900/20 border-2 border-amber-500/30 rounded-xl p-4">
            <h4 className="text-amber-400 font-bold mb-2 text-center">Δ (delta) — P-helis</h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* C₃ o'qi */}
              <line x1="100" y1="20" x2="100" y2="180" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />
              <text x="110" y="15" fill="#fbbf24" fontSize="8">C₃</text>

              {/* Markaziy Ru */}
              <circle cx="100" cy="100" r="15" fill="#f59e0b" />
              <text x="100" y="105" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Ru</text>

              {/* 3 ta bpy ligand (spiral) */}
              {Array.from({ length: 3 }).map((_, i) => {
                const angle = (i * 120 + rotate) * Math.PI / 180
                const x1 = 100 + 40 * Math.cos(angle)
                const y1 = 100 + 40 * Math.sin(angle)
                const x2 = 100 + 75 * Math.cos(angle + 0.4)
                const y2 = 100 + 75 * Math.sin(angle + 0.4)
                return (
                  <g key={i}>
                    <line x1="100" y1="100" x2={x1} y2={y1} stroke="#fbbf24" strokeWidth="2" />
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fbbf24" strokeWidth="2" />
                    <circle cx={x1} cy={y1} r="5" fill="#3b82f6" />
                    <circle cx={x2} cy={y2} r="5" fill="#3b82f6" />
                    <text x={(x1+x2)/2} y={(y1+y2)/2 - 5} fill="#fde68a" fontSize="7" textAnchor="middle">bpy</text>
                  </g>
                )
              })}

              {/* Spiral yo'nalishi */}
              <path d="M 100 50 Q 140 75 145 100 Q 140 125 100 150" 
                fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="155" y="100" fill="#fbbf24" fontSize="8">O'ng vint →</text>
            </svg>
            <p className="text-amber-400 text-xs text-center mt-2">
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

              {/* Markaziy Ru */}
              <circle cx="100" cy="100" r="15" fill="#f43f5e" />
              <text x="100" y="105" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Ru</text>

              {/* 3 ta bpy ligand (teskari spiral) */}
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
                    <text x={(x1+x2)/2} y={(y1+y2)/2 - 5} fill="#fda4af" fontSize="7" textAnchor="middle">bpy</text>
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
          <p className="text-yellow-400 font-bold mb-1">💎 To'q sariq rang sababi:</p>
          <p className="text-purple-200">
            [Ru(bpy)₃]²⁺ — <strong>to'q sariq rangli</strong>. Sababi: MLCT o'tish (452 nm).
            452 nm da <strong>ko'k-binafsha yutilish</strong> → komplementar rang <strong className="text-amber-400">sariq</strong>.
            Bu rang <strong>juda intensiv</strong> — ε ≈ 14600 M⁻¹cm⁻¹ (MLCT uchun xarakterli).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. EKSSITON COUPLING
// ============================================================================
function ExcitonCoupling() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ Eksiton coupling — bisignate Cotton effekti</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-4">
          <p className="text-amber-400 font-bold mb-2">💎 Eksiton coupling nima?</p>
          <p className="text-purple-200 text-xs">
            Uchta bpy ligand <strong>bir-biri bilan yaqin</strong> joylashgan → ularning <strong>π-π* o'tishlari</strong> o'zaro ta'sirlashadi.
            Bu <strong>eksiton coupling</strong> deb ataladi. Natijada CD spektrida <strong>bisignate</strong> (musbat + manfiy)
            shakl paydo bo'ladi — bu <strong>absolyut konfiguratsiyani</strong> aniqlashda eng ishonchli belgi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-amber-400 font-bold mb-3">Eksiton mexanizmi:</h4>
            <div className="space-y-2 text-xs">
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-300">1. Har bir bpy da π-π* o'tish (245 nm)</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-300">2. Uchta bpy o'zaro ta'sirlashadi</p>
              </div>
              <div className="bg-amber-900/30 border border-amber-500/30 rounded p-2">
                <p className="text-amber-400 font-bold">3. Eksiton holatlar ajraladi</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-300">4. Bisignate CD signali (285 nm)</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-amber-400 font-bold mb-3">Bisignate xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">λ<sub>max</sub>:</span>
                <span className="text-amber-400 font-mono">285 nm</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Δε:</span>
                <span className="text-amber-400 font-mono">±25 M⁻¹cm⁻¹</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Shakl:</span>
                <span className="text-amber-400">Bisignate (+/−)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Ahamiyati:</span>
                <span className="text-emerald-400">Absolyut konfiguratsiya</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-amber-400 font-bold text-xs mb-2">Bisignate CD spektri:</h5>
          <svg viewBox="0 0 400 150" className="w-full h-36">
            <line x1="40" y1="75" x2="380" y2="75" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="40" y1="20" x2="40" y2="130" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="145" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="20" y="75" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 75)">
              Δε
            </text>

            {/* Bisignate egri chiziq */}
            <polyline
              points={Array.from({ length: 100 }, (_, i) => {
                const lambda = 250 + i * 1.5
                const x = 40 + (i / 100) * 340
                const x0 = (lambda - 285) / 15
                
                // Bisignate (derivative of Gaussian)
                const cotton = x0 * Math.exp(-0.5 * x0 * x0) * 25
                const y = 75 - (cotton / 25) * 50
                
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#f59e0b" strokeWidth="2"
            />

            {/* Beliglar */}
            <text x="150" y="30" fill="#10b981" fontSize="9" textAnchor="middle">+</text>
            <text x="270" y="120" fill="#ef4444" fontSize="9" textAnchor="middle">−</text>
            <text x="210" y="15" fill="#f59e0b" fontSize="9" textAnchor="middle" fontWeight="bold">
              285 nm (bisignate)
            </text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Bisignate qoidasi:</p>
          <p className="text-purple-200">
            <strong>Δ-izomer</strong> → birinchi musbat, keyin manfiy (+/−)
            <br/>
            <strong>Λ-izomer</strong> → birinchi manfiy, keyin musbat (−/+)
            <br/>
            Bu qoida <strong>barcha tris-xelat komplekslar</strong> uchun ishlaydi va absolyut konfiguratsiyani
            <strong>100% ishonchli</strong> aniqlashga imkon beradi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. LYUMINESSENTSIYA
// ============================================================================
function Lyuminessensiya() {
  const [showEmission, setShowEmission] = useState(true)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💡 Lyuminestsensiya — kuchli nurlanish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-4">
          <p className="text-amber-400 font-bold mb-2">💎 Kuchli lyuminestsensiya:</p>
          <p className="text-purple-200 text-xs">
            [Ru(bpy)₃]²⁺ — <strong>kuchli lyuminessent</strong> (Φ ≈ 0.04, τ ≈ 600 ns).
            MLCT holatidan <strong>qizil-norinjgi nurlanish</strong> (λ<sub>em</sub> ≈ 620 nm).
            Bu uni <strong>solar cells, LED, sensorlar</strong> uchun ideal qiladi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-amber-400 font-bold mb-3">Lyuminestsensiya xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">λ<sub>em</sub>:</span>
                <span className="text-amber-400 font-mono">620 nm (qizil)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Φ (kvant chiqimi):</span>
                <span className="text-amber-400 font-mono">0.04</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">τ (hayot vaqti):</span>
                <span className="text-amber-400 font-mono">600 ns</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Holat:</span>
                <span className="text-amber-400">³MLCT (triplet)</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-amber-400 font-bold mb-3">Jabbski diagrammasi:</h4>
            <svg viewBox="0 0 200 180" className="w-full h-44">
              {/* Energiya sathlari */}
              <rect x="30" y="140" width="40" height="20" fill="#3b82f6" opacity="0.3" stroke="#3b82f6" />
              <text x="50" y="155" fill="#3b82f6" fontSize="8" textAnchor="middle">¹GS</text>

              <rect x="30" y="80" width="40" height="20" fill="#f59e0b" opacity="0.3" stroke="#f59e0b" />
              <text x="50" y="95" fill="#f59e0b" fontSize="8" textAnchor="middle">¹MLCT</text>

              <rect x="130" y="90" width="40" height="20" fill="#ef4444" opacity="0.3" stroke="#ef4444" />
              <text x="150" y="105" fill="#ef4444" fontSize="8" textAnchor="middle">³MLCT</text>

              {/* O'tishlar */}
              <line x1="50" y1="140" x2="50" y2="100" stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#arrow)" />
              <text x="60" y="120" fill="#fbbf24" fontSize="7">hν (452 nm)</text>

              <path d="M 70 90 Q 100 85 130 100" fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="2,2" />
              <text x="100" y="80" fill="#a78bfa" fontSize="7">ISC</text>

              <line x1="150" y1="110" x2="50" y2="160" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrow)" />
              <text x="110" y="140" fill="#ef4444" fontSize="7">hν' (620 nm)</text>

              <defs>
                <marker id="arrow" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0,0 5,2.5 0,5" fill="#fbbf24" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun kuchli lyuminestsensiya?</p>
          <p className="text-purple-200">
            <strong>Ru</strong> — og'ir atom (4d) → <strong>kuchli spin-orbital coupling</strong> →
            <strong> intersystem crossing (ISC)</strong> tez (¹MLCT → ³MLCT).
            <br/>
            ³MLCT holatidan <strong>fosforessensiya</strong> (τ ≈ 600 ns) → qizil nurlanish.
            <br/>
            Fe²⁺ da bu jarayon <strong>tez ichki konversiya</strong> bilan raqobatlashadi → lyuminestsensiya kuchsiz.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. ELEKTRON KONFIGURATSIYA
// ============================================================================
function ElektronKonfiguratsiya() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 Elektron konfiguratsiya va o'tishlar</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-amber-400 font-bold mb-3">Kristall maydon diagrammasi:</h4>
            <div className="font-mono text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-purple-700/30 pb-2">
                <span className="text-red-400 w-24">e<sub>g</sub>*</span>
                <div className="flex gap-2">
                  <span className="text-purple-500">__</span>
                  <span className="text-purple-500">__</span>
                </div>
                <span className="text-purple-500">bo'sh</span>
              </div>

              <div className="text-center text-amber-400 text-[10px] py-1">
                Δ<sub>o</sub> = 24,000 cm⁻¹ (juda kuchli)
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

              <div className="bg-amber-900/30 border border-amber-500/30 rounded p-2 text-center mt-3">
                <p className="text-[10px] text-purple-300">Konfiguratsiya:</p>
                <p className="text-amber-400 font-bold">t₂g⁶ e<sub>g</sub>⁰</p>
                <p className="text-[10px] text-purple-400 mt-1">¹A₁g ground state</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-amber-400 font-bold mb-3">O'tishlar:</h4>
            <div className="space-y-2 text-xs">
              <div className="bg-amber-900/30 border border-amber-500/30 rounded p-2">
                <div className="flex justify-between">
                  <span className="text-amber-400 font-bold">MLCT (Ru→bpy)</span>
                  <span className="text-amber-400 font-mono">~452 nm</span>
                </div>
                <p className="text-amber-400 text-[10px] mt-1">Kuchli, intensiv — ko'rinadigan sohada</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <div className="flex justify-between">
                  <span className="text-purple-300">Eksiton coupling</span>
                  <span className="text-emerald-400 font-mono">~285 nm</span>
                </div>
                <p className="text-purple-400 text-[10px] mt-1">Bisignate CD — absolyut konfiguratsiya</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <div className="flex justify-between">
                  <span className="text-purple-300">π-π* (bpy)</span>
                  <span className="text-emerald-400 font-mono">~245 nm</span>
                </div>
                <p className="text-purple-400 text-[10px] mt-1">Ligand ichki o'tish</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun MLCT ko'rinadigan sohada?</p>
          <p className="text-purple-200">
            <strong>Ru²⁺</strong> — 4d metall → d-orbitallar <strong>yuqori energiyada</strong> (Fe²⁺ dan yuqori).
            bpy π* orbitallar <strong>past energiyada</strong> → MLCT energiya farqi kichik →
            <strong> uzunroq to'lqin uzunligi</strong> (452 nm vs 265 nm Fe uchun).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. SOLISHTIRISH - Fe vs Ru
// ============================================================================
function Solishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 [Fe(phen)₃]²⁺ vs [Ru(bpy)₃]²⁺ — solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-red-400">[Fe(phen)₃]²⁺</th>
                <th className="text-center py-3 px-2 text-amber-400">[Ru(bpy)₃]²⁺</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Metal", "Fe²⁺ (3d)", "Ru²⁺ (4d)"],
                ["dⁿ", "d⁶", "d⁶"],
                ["Spin", "S=0 (LS)", "S=0 (LS)"],
                ["Magnit", "Diamagnit", "Diamagnit"],
                ["Ligand", "phen", "bpy"],
                ["π-sistema", "14 π-e⁻", "12 π-e⁻"],
                ["MLCT λ<sub>max</sub>", "265 nm (UV)", "452 nm (ko'rinadigan)"],
                ["MLCT ε", "12,000", "14,600"],
                ["Eksiton", "Kuchsiz", "Kuchli (bisignate)"],
                ["Δε (MLCT)", "±15", "±8"],
                ["Δε (eksiton)", "—", "±25"],
                ["Lyuminestsensiya", "Zaif (100 ps)", "Kuchli (600 ns)"],
                ["Φ", "~0.001", "0.04"],
                ["Rang", "Qizil", "To'q sariq"],
                ["Qo'llanilishi", "Sensorlar", "Solar cells, LED"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-red-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-amber-400">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-amber-600/10 border border-amber-500/30 rounded-lg p-3 text-xs">
          <p className="text-amber-400 font-bold mb-1">💡 Asosiy farqlar:</p>
          <p className="text-purple-200">
            <strong>Ru²⁺</strong> — 4d metall → <strong>kuchli spin-orbital coupling</strong> →
            <strong> kuchli lyuminestsensiya</strong> (Φ = 0.04, τ = 600 ns).
            <br/>
            <strong>MLCT ko'rinadigan sohada</strong> (452 nm) → to'q sariq rang.
            <br/>
            <strong>Eksiton coupling kuchli</strong> → bisignate CD (Δε ≈ ±25) → absolyut konfiguratsiya aniqlash.
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
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — [Ru(bpy)₃]²⁺</h3>

      <div className="bg-gradient-to-br from-amber-900/30 to-purple-900/30 rounded-xl p-5 border border-amber-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">1930-50 — Birinchi sintez</p>
                <p className="text-purple-200 text-xs mt-1">
                  [Ru(bpy)₃]²⁺ birinchi marta sintez qilindi. Lekin uning <strong>noyob xossalari</strong>
                  keyinroq aniqlandi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1960-70 — Lyuminestsensiya kashfiyoti</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Crosby, Demas, Crosby</strong> [Ru(bpy)₃]²⁺ ning <strong>kuchli lyuminestsensiyasini</strong> kashf etdi.
                  Bu <strong>fotofizika</strong> sohasida inqilob qildi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📊</div>
              <div>
                <p className="text-yellow-400 font-bold">1970-80 — Solar cells</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Grätzel</strong> [Ru(bpy)₃]²⁺ ni <strong>dye-sensitized solar cells (DSSC)</strong> da ishlatdi.
                  Bu <strong>qayta tiklanadigan energiya</strong> sohasida muhim qadam bo'ldi.
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
                  [Ru(bpy)₃]²⁺ — <strong>solar cells, LED, sensorlar, biologik markerlar</strong>da keng qo'llaniladi.
                  <strong>CD spektroskopiyasi</strong>da absolyut konfiguratsiya aniqlash standarti.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 [Ru(bpy)₃]²⁺ ning ahamiyati:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Kuchli lyuminestsensiya</strong> — solar cells, LED</li>
            <li><strong>Eksiton coupling</strong> — absolyut konfiguratsiya</li>
            <li><strong>Uzun hayot vaqti</strong> (600 ns) — sensorlar uchun ideal</li>
            <li><strong>Barqaror</strong> — ko'p reaksiyalarda qo'llaniladi</li>
            <li><strong>CD standarti</strong> — bisignate Cotton effekti</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function RuBpy3CD() {
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
          <span className="text-amber-400">[Ru(bpy)₃]²⁺</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-amber-400">🔄 [Ru(bpy)₃]²⁺ — CD tahlili</h1>
          <p className="text-purple-400 text-sm">
            Ru²⁺ (d⁶ LS) • Δ/Λ enantiomerlar • Eksiton coupling • Kuchli lyuminestsensiya
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-amber-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-amber-400">[Ru(bpy)₃]²⁺</span>
            <div>
              <h2 className="text-xl font-bold text-white">CD tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Tris(2,2'-bipiridin)ruteniy(II)" — eksiton klassikasi</p>
            </div>
          </div>

          <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Ru(bpy)₃]²⁺ — <strong className="text-amber-400">eksiton coupling ning klassik namunasi</strong>.
              Ru²⁺ (d⁶ LS) <strong>¹A₁g ground state</strong>ga ega.
              Δ-izomer <strong>bisignate Cotton effekti</strong> (285 nm, Δε ≈ ±25) beradi — bu absolyut konfiguratsiyani
              <strong> 100% ishonchli</strong> aniqlashga imkon beradi. MLCT o'tish (452 nm) ham intensiv (Δε ≈ ±8).
              <strong> Kuchli lyuminestsensiya</strong> (Φ ≈ 0.04, τ ≈ 600 ns) — solar cells va sensorlar uchun ideal.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">Ru²⁺ (LS)</p>
              <p className="text-purple-300">d⁶, t₂g⁶</p>
              <p className="text-purple-400 mt-1">S = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">Δ/Λ</p>
              <p className="text-purple-300">enantiomerlar</p>
              <p className="text-purple-400 mt-1">xiral markaz</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">λ<sub>max</sub> = 452</p>
              <p className="text-purple-300">nm</p>
              <p className="text-purple-400 mt-1">MLCT o'tish</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">Δε ≈ ±25</p>
              <p className="text-purple-300">M⁻¹cm⁻¹</p>
              <p className="text-purple-400 mt-1">Eksiton CD</p>
            </div>
          </div>
        </div>

        {/* CD SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CDSpectrumSimulator />
        </div>

        {/* BPY LIGAND */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <BpyLigand />
        </div>

        {/* Δ vs Λ VIZUALIZATSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <DeltaLambdaVisualization />
        </div>

        {/* EKSSITON COUPLING */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ExcitonCoupling />
        </div>

        {/* LYUMINESSENTSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Lyuminessensiya />
        </div>

        {/* ELEKTRON KONFIGURATSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ElektronKonfiguratsiya />
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
        <div className="bg-gradient-to-r from-amber-600/10 to-purple-600/10 border border-amber-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Ru(bpy)₃]²⁺ — <strong className="text-amber-400">eksiton coupling ning klassik namunasi</strong></li>
            <li>Ru²⁺ (d⁶ LS, t₂g⁶) — <strong>diamagnit</strong>, S=0</li>
            <li>bpy — <strong>kuchli π-akseptor ligand</strong>, katta π-sistema</li>
            <li><strong>MLCT o'tish</strong> (452 nm) — ko'rinadigan sohada, intensiv</li>
            <li><strong>Eksiton coupling</strong> (285 nm) — bisignate Cotton effekti</li>
            <li>Δ-izomer → bisignate (+/−), Λ-izomer → bisignate (−/+)</li>
            <li>Δε ≈ <strong>±25</strong> — eng kuchli CD signallaridan biri</li>
            <li><strong>Kuchli lyuminestsensiya</strong> — Φ ≈ 0.04, τ ≈ 600 ns</li>
            <li>³MLCT holatidan <strong>qizil nurlanish</strong> (620 nm)</li>
            <li><strong>Solar cells, LED, sensorlar</strong>da keng qo'llaniladi</li>
            <li>CD spektroskopiyasida <strong>absolyut konfiguratsiya standarti</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/cd/birikmalar/fe-phen3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Fe(phen)₃]²⁺
          </Link>
          <Link href="/ilmiy/tahlil/cd/birikmalar/rh-en3" className="px-6 py-3 bg-amber-600/80 rounded-xl hover:bg-amber-500 text-white font-semibold">
            [Rh(en)₃]³⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}