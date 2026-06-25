"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. CD SPEKTR SIMULYATORI ([Cr(acac)₃] uchun)
// ============================================================================
function CDSpectrumSimulator() {
  const [enantiomer, setEnantiomer] = useState("delta")
  const [ee, setEe] = useState(100)
  const [showSecondBand, setShowSecondBand] = useState(true)

  // [Cr(acac)₃] xarakterli parametrlar
  // ⁴A₂g → ⁴T₂g: ~580 nm (ko'rinadigan, yashil yutilish → qizil rang)
  // ⁴A₂g → ⁴T₁g(F): ~410 nm (ko'k-binafsha)
  // ⁴A₂g → ⁴T₁g(P): ~285 nm (UV)
  const bands = [
    { lambda_max: 580, epsilon: 90, delta_epsilon_max: 0.8, assign: "⁴A₂g → ⁴T₂g" },
    { lambda_max: 410, epsilon: 70, delta_epsilon_max: -1.2, assign: "⁴A₂g → ⁴T₁g(F)" },
    { lambda_max: 285, epsilon: 8000, delta_epsilon_max: 4.0, assign: "⁴A₂g → ⁴T₁g(P)" },
  ]

  const sign = enantiomer === "delta" ? 1 : -1
  const eeFactor = ee / 100

  // CD spektri simulyatsiyasi
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 220 + i * 1.6 // 220-860 nm
      let cotton = 0
      let absorption = 0

      bands.forEach((band, idx) => {
        if (!showSecondBand && idx >= 1) return
        
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
  }, [enantiomer, ee, sign, eeFactor, showSecondBand])

  const maxCotton = Math.max(...spectrum.map(p => Math.abs(p.cotton)), 0.1)
  const maxAbs = Math.max(...spectrum.map(p => p.absorption), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 CD spektr simulyatori — [Cr(acac)₃]</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 font-bold mb-2">💎 Paramagnit kompleks — o'ziga xos holat:</p>
          <p className="text-purple-200 text-xs">
            [Cr(acac)₃] — <strong>paramagnit</strong> (d³, S=3/2, 3 ta toq elektron).
            Paramagnit moddalar odatda NMR da keng signallar beradi, lekin
            <strong> CD spektroskopiyasiga ta'siri minimal</strong>.
            Shuning uchun [Cr(acac)₃] xiral muhitda <strong>aniq CD signallari</strong> beradi.
            Bu uni <strong>paramagnit CD tadqiqotlari uchun ideal namuna</strong>ga aylantiradi.
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
                    ? "bg-emerald-600/80 text-white shadow-lg" 
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
                className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
            </div>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input type="checkbox" checked={showSecondBand}
                onChange={(e) => setShowSecondBand(e.target.checked)}
                className="accent-emerald-500" />
              <span className="text-purple-300">Ko'proq o'tishlarni ko'rsatish (⁴T₁g, ⁴T₁g(P))</span>
            </label>
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-2">
            CD spektri va absorbsiya: Δ/Λ-[Cr(acac)₃]
          </h5>
          <svg viewBox="0 0 400 280" className="w-full h-64">
            {/* O'qlar */}
            <line x1="40" y1="140" x2="380" y2="140" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="40" y1="20" x2="40" y2="260" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="275" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="270" fill="#a78bfa" fontSize="8">220</text>
            <text x="380" y="270" fill="#a78bfa" fontSize="8" textAnchor="end">860</text>
            <text x="20" y="140" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 140)">
              Δε / ε
            </text>

            {/* λ_max belgilari */}
            {bands.map((band, idx) => {
              if (!showSecondBand && idx >= 1) return null
              const x = 40 + ((band.lambda_max - 220) / 640) * 340
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
              fill="none" stroke={sign > 0 ? "#10b981" : "#f43f5e"} strokeWidth="2"
            />

            {/* Legend */}
            <text x="280" y="30" fill="#fbbf24" fontSize="8">— Absorbsiya (ε)</text>
            <text x="280" y="45" fill={sign > 0 ? "#10b981" : "#f43f5e"} fontSize="8">
              — CD (Δε)
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className={`rounded-lg p-3 ${enantiomer === "delta" ? "bg-emerald-900/30 border border-emerald-500/50" : "bg-purple-900/50"}`}>
            <p className="text-purple-400">Enantiomer</p>
            <p className={`font-bold ${enantiomer === "delta" ? "text-emerald-400" : "text-rose-400"}`}>
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
          <p className="text-yellow-400 font-bold mb-1">💡 Paramagnit CD ning o'ziga xosligi:</p>
          <p className="text-purple-200">
            Paramagnit markaz (Cr³⁺, S=3/2) <strong>magnit anizotropiya</strong>ga ega.
            Bu <strong>MCD (Magnetic CD)</strong> tajribalarida qo'shimcha ma'lumot beradi.
            Tashqi magnit maydon qo'llanilsa, CD spektri o'zgaradi — bu elektron strukturani
            chuqurroq o'rganishga imkon beradi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. ACAC LIGAND STRUKTURASI
// ============================================================================
function AcacLigand() {
  const [showResonance, setShowResonance] = useState(false)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 Atsetilasetonato (acac⁻) ligand strukturasi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-emerald-400 font-bold mb-3">acac⁻ ioni (C₅H₇O₂⁻):</h4>
            <svg viewBox="0 0 200 180" className="w-full h-44">
              {/* Asosiy zanjir */}
              <line x1="30" y1="90" x2="70" y2="90" stroke="#a78bfa" strokeWidth="2" />
              <line x1="70" y1="90" x2="110" y2="90" stroke="#a78bfa" strokeWidth="2" />
              <line x1="110" y1="90" x2="150" y2="90" stroke="#a78bfa" strokeWidth="2" />
              <line x1="150" y1="90" x2="180" y2="90" stroke="#a78bfa" strokeWidth="2" />

              {/* C atomlari */}
              <circle cx="30" cy="90" r="8" fill="#6b7280" />
              <text x="30" y="93" fill="white" fontSize="7" textAnchor="middle">C</text>
              
              <circle cx="70" cy="90" r="8" fill="#6b7280" />
              <text x="70" y="93" fill="white" fontSize="7" textAnchor="middle">C</text>
              
              <circle cx="110" cy="90" r="8" fill="#6b7280" />
              <text x="110" y="93" fill="white" fontSize="7" textAnchor="middle">C</text>
              
              <circle cx="150" cy="90" r="8" fill="#6b7280" />
              <text x="150" y="93" fill="white" fontSize="7" textAnchor="middle">C</text>
              
              <circle cx="180" cy="90" r="8" fill="#6b7280" />
              <text x="180" y="93" fill="white" fontSize="7" textAnchor="middle">C</text>

              {/* O atomlari */}
              <line x1="70" y1="90" x2="70" y2="50" stroke="#ef4444" strokeWidth="2" />
              <circle cx="70" cy="50" r="8" fill="#ef4444" />
              <text x="70" y="53" fill="white" fontSize="7" textAnchor="middle">O</text>
              
              <line x1="150" y1="90" x2="150" y2="50" stroke="#ef4444" strokeWidth="2" />
              <circle cx="150" cy="50" r="8" fill="#ef4444" />
              <text x="150" y="53" fill="white" fontSize="7" textAnchor="middle">O</text>

              {/* CH₃ guruhlar */}
              <text x="20" y="75" fill="#a78bfa" fontSize="7">CH₃</text>
              <text x="185" y="75" fill="#a78bfa" fontSize="7">CH₃</text>

              {/* Xelat belgisi */}
              <path d="M 70 50 Q 110 30 150 50" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="110" y="25" fill="#10b981" fontSize="8" textAnchor="middle">O,O-xelat</text>

              <text x="100" y="140" fill="#a78bfa" fontSize="9" textAnchor="middle">
                C₅H₇O₂⁻ (acac⁻)
              </text>
              <text x="100" y="155" fill="#10b981" fontSize="8" textAnchor="middle">
                6 a'zoli xelat halqasi
              </text>
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-emerald-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Zaryad:</span>
                <span className="text-emerald-400 font-bold">1−</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Donor atomlar:</span>
                <span className="text-red-400 font-bold">2 × O (O,O-xelat)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Xelat halqasi:</span>
                <span className="text-emerald-400">6 a'zoli (Cr-O-C-C-C-O)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Maydon kuchi:</span>
                <span className="text-yellow-400">O'rtacha</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">π-xususiyati:</span>
                <span className="text-purple-200">π-donor (kuchsiz)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Rezonans:</span>
                <span className="text-purple-200">Ha (enolat)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun 6 a'zoli halqa?</p>
          <p className="text-purple-200">
            acac⁻ ligand <strong>5 ta uglerod</strong> zanjiriga ega.
            Cr³⁺ ikkita O atomi orqali bog'lanadi → <strong>6 a'zoli xelat halqasi</strong> hosil bo'ladi:
            Cr−O−C−C−C−O.
            <br/>
            Bu <strong>5 a'zoli halqalardan</strong> (en, ox) <strong>barqarorroq</strong> — sterik to'qnashuv kamroq.
            Shuning uchun [Cr(acac)₃] <strong>organik erituvchilarda yaxshi eriydi</strong>.
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

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Aylantirish burchagi:</span>
            <span className="text-emerald-400 font-mono">{rotate}°</span>
          </label>
          <input type="range" min="0" max="360" step="5" value={rotate}
            onChange={(e) => setRotate(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Δ */}
          <div className="bg-emerald-900/20 border-2 border-emerald-500/30 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold mb-2 text-center">Δ (delta) — P-helis</h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* C₃ o'qi */}
              <line x1="100" y1="20" x2="100" y2="180" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />
              <text x="110" y="15" fill="#fbbf24" fontSize="8">C₃</text>

              {/* Markaziy Cr */}
              <circle cx="100" cy="100" r="15" fill="#10b981" />
              <text x="100" y="105" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Cr</text>

              {/* 3 ta acac ligand (spiral) */}
              {Array.from({ length: 3 }).map((_, i) => {
                const angle = (i * 120 + rotate) * Math.PI / 180
                const x1 = 100 + 40 * Math.cos(angle)
                const y1 = 100 + 40 * Math.sin(angle)
                const x2 = 100 + 75 * Math.cos(angle + 0.4)
                const y2 = 100 + 75 * Math.sin(angle + 0.4)
                return (
                  <g key={i}>
                    <line x1="100" y1="100" x2={x1} y2={y1} stroke="#34d399" strokeWidth="2" />
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#34d399" strokeWidth="2" />
                    <circle cx={x1} cy={y1} r="5" fill="#ef4444" />
                    <circle cx={x2} cy={y2} r="5" fill="#ef4444" />
                    <text x={(x1+x2)/2} y={(y1+y2)/2 - 5} fill="#6ee7b7" fontSize="7" textAnchor="middle">acac</text>
                  </g>
                )
              })}

              {/* Spiral yo'nalishi */}
              <path d="M 100 50 Q 140 75 145 100 Q 140 125 100 150" 
                fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="155" y="100" fill="#fbbf24" fontSize="8">O'ng vint →</text>
            </svg>
            <p className="text-emerald-400 text-xs text-center mt-2">
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

              {/* Markaziy Cr */}
              <circle cx="100" cy="100" r="15" fill="#f43f5e" />
              <text x="100" y="105" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Cr</text>

              {/* 3 ta acac ligand (teskari spiral) */}
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
                    <circle cx={x1} cy={y1} r="5" fill="#ef4444" />
                    <circle cx={x2} cy={y2} r="5" fill="#ef4444" />
                    <text x={(x1+x2)/2} y={(y1+y2)/2 - 5} fill="#fda4af" fontSize="7" textAnchor="middle">acac</text>
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
          <p className="text-yellow-400 font-bold mb-1">💎 Neytral kompleks:</p>
          <p className="text-purple-200">
            [Cr(acac)₃] — <strong>uchta acac⁻</strong> va <strong>Cr³⁺</strong> → umumiy zaryad <strong>0</strong>.
            Neytral bo'lgani uchun <strong>organik erituvchilarda</strong> (benzol, xloroform, etanol)
            yaxshi eriydi. Bu uni <strong>organik kimyoda qo'llash</strong>ga imkon beradi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. ELEKTRON KONFIGURATSIYA VA d³ O'TISHLAR
// ============================================================================
function ElektronKonfiguratsiya() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 d³ elektron konfiguratsiya va o'tishlar</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-emerald-400 font-bold mb-3">Kristall maydon diagrammasi:</h4>
            <div className="font-mono text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-purple-700/30 pb-2">
                <span className="text-red-400 w-24">e<sub>g</sub>*</span>
                <div className="flex gap-2">
                  <span className="text-purple-500">__</span>
                  <span className="text-purple-500">__</span>
                </div>
                <span className="text-purple-500">bo'sh</span>
              </div>

              <div className="text-center text-emerald-400 text-[10px] py-1">
                Δ<sub>o</sub> = 17,200 cm⁻¹
              </div>

              <div className="flex justify-between items-center border-t border-purple-700/30 pt-2">
                <span className="text-emerald-400 w-24">t₂g</span>
                <div className="flex gap-2">
                  <span className="text-yellow-400">↑</span>
                  <span className="text-yellow-400">↑</span>
                  <span className="text-yellow-400">↑</span>
                </div>
                <span className="text-emerald-400">3 e⁻</span>
              </div>

              <div className="bg-emerald-900/30 border border-emerald-500/30 rounded p-2 text-center mt-3">
                <p className="text-[10px] text-purple-300">Konfiguratsiya:</p>
                <p className="text-emerald-400 font-bold">t₂g³ e<sub>g</sub>⁰</p>
                <p className="text-[10px] text-purple-400 mt-1">⁴A₂g ground state</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-emerald-400 font-bold mb-3">d-d o'tishlar (d³ uchun):</h4>
            <div className="space-y-2 text-xs">
              <div className="bg-purple-900/50 rounded p-2">
                <div className="flex justify-between">
                  <span className="text-emerald-400 font-bold">⁴A₂g → ⁴T₂g</span>
                  <span className="text-emerald-400 font-mono">~580 nm</span>
                </div>
                <p className="text-purple-400 text-[10px] mt-1">Birinchi o'tish — CD da asosiy signal</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <div className="flex justify-between">
                  <span className="text-emerald-400 font-bold">⁴A₂g → ⁴T₁g(F)</span>
                  <span className="text-emerald-400 font-mono">~410 nm</span>
                </div>
                <p className="text-purple-400 text-[10px] mt-1">Ikkinchi o'tish</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <div className="flex justify-between">
                  <span className="text-emerald-400 font-bold">⁴A₂g → ⁴T₁g(P)</span>
                  <span className="text-emerald-400 font-mono">~285 nm</span>
                </div>
                <p className="text-purple-400 text-[10px] mt-1">Uchinchi o'tish — UV sohada</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun d³ uchun 3 ta spin-ruxsat etilgan o'tish?</p>
          <p className="text-purple-200">
            d³ konfiguratsiyada <strong>⁴A₂g ground state</strong> (quartet, S=3/2).
            Barcha qo'zg'algan holatlar ham <strong>quartet</strong> bo'lishi mumkin (⁴T₂g, ⁴T₁g(F), ⁴T₁g(P)).
            Spin bir xil (S=3/2) → <strong>spin-ruxsat etilgan</strong> → intensivroq o'tishlar.
            Bu d³ ni <strong>eng ko'p ma'lumot beradigan konfiguratsiya</strong>ga aylantiradi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. PARAMAGNIT CD (MCD)
// ============================================================================
function ParamagneticCD() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧲 Paramagnit CD va MCD — o'ziga xos imkoniyatlar</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 font-bold mb-2">💎 Paramagnit komplekslarning o'ziga xosligi:</p>
          <p className="text-purple-200 text-xs">
            [Cr(acac)₃] <strong>paramagnit</strong> (S=3/2) bo'lsa ham, CD spektri <strong>aniq va intensiv</strong>.
            Sababi: paramagnit markaz <strong>CD signaliga to'sqinlik qilmaydi</strong>.
            Bundan tashqari, <strong>MCD (Magnetic CD)</strong> qo'shimcha imkoniyatlar beradi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-emerald-400 font-bold mb-3">CD (oddiy):</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ Tashqi magnit maydon <strong>yo'q</strong></li>
              <li>✓ Xiral moddalar uchun</li>
              <li>✓ Δ va Λ enantiomerlarni farqlaydi</li>
              <li>✓ Absolyut konfiguratsiya aniqlaydi</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-emerald-400 font-bold mb-3">MCD (magnit maydon bilan):</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>Kuchli magnit maydon</strong> qo'llaniladi (1-7 T)</li>
              <li>✓ <strong>Paramagnit markazlar</strong> uchun maxsus</li>
              <li>✓ <strong>A, B, C terminlar</strong> farqlanadi</li>
              <li>✓ Elektron strukturani chuqur o'rganish</li>
            </ul>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-2">MCD termin turlari:</h5>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-purple-900/50 rounded p-2 text-center">
              <p className="text-emerald-400 font-bold">A-term</p>
              <p className="text-purple-300 text-[10px] mt-1">
                Degenerat holatlar<br/>
                Bisignate shakl
              </p>
            </div>
            <div className="bg-purple-900/50 rounded p-2 text-center">
              <p className="text-emerald-400 font-bold">B-term</p>
              <p className="text-purple-300 text-[10px] mt-1">
                Nordegenerat<br/>
                Cotton shakli
              </p>
            </div>
            <div className="bg-purple-900/50 rounded p-2 text-center">
              <p className="text-emerald-400 font-bold">C-term</p>
              <p className="text-purple-300 text-[10px] mt-1">
                Yaqin energiyali<br/>
                Haroratga bog'liq
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 [Cr(acac)₃] MCD da:</p>
          <p className="text-purple-200">
            d³ konfiguratsiya (⁴A₂g) <strong>A-term MCD</strong> beradi, chunki qo'zg'algan holatlar
            (⁴T₂g, ⁴T₁g) <strong>uch karra degenerat</strong>. Bu MCD spektrida <strong>bisignate</strong> 
            (musbat + manfiy) shakl ko'rinishida namoyon bo'ladi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. SOLISHTIRISH - TRIS-XELATLAR
// ============================================================================
function Solishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Tris-xelat komplekslar solishtirilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-blue-400">[Co(en)₃]³⁺</th>
                <th className="text-center py-3 px-2 text-indigo-400">[Co(ox)₃]³⁻</th>
                <th className="text-center py-3 px-2 text-emerald-400">[Cr(acac)₃]</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Metal", "Co³⁺", "Co³⁺", "Cr³⁺"],
                ["dⁿ", "d⁶", "d⁶", "d³"],
                ["Spin", "S=0 (LS)", "S=0 (LS)", "S=3/2 (HS)"],
                ["Magnit", "Diamagnit", "Diamagnit", "Paramagnit"],
                ["Zaryad", "+3", "−3", "0"],
                ["Ligand", "en (N,N)", "ox²⁻ (O,O)", "acac⁻ (O,O)"],
                ["Xelat halqasi", "5 a'zoli", "5 a'zoli", "6 a'zoli"],
                ["λ_max", "470 nm", "560 nm", "580 nm"],
                ["Δε", "±2.0", "±1.5", "±0.8"],
                ["Rang", "Sariq", "Qizil", "Qizil-binafsha"],
                ["Ground state", "¹A₁g", "¹A₁g", "⁴A₂g"],
                ["Eruvchanlik", "Suvda", "Suvda", "Organikda"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-blue-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-indigo-400">{r[2]}</td>
                  <td className="py-2 px-2 text-center text-emerald-400">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-3 text-xs">
          <p className="text-emerald-400 font-bold mb-1">💡 Asosiy farqlar:</p>
          <p className="text-purple-200">
            <strong>[Cr(acac)₃]</strong> — yagona <strong>paramagnit</strong> kompleks.
            Shuning uchun u <strong>MCD tadqiqotlari</strong> uchun ideal.
            <br/>
            <strong>6 a'zoli xelat halqasi</strong> — boshqalardan farqli (5 a'zoli).
            <br/>
            <strong>Neytral kompleks</strong> — organik erituvchilarda eriydi.
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
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — [Cr(acac)₃]</h3>

      <div className="bg-gradient-to-br from-emerald-900/30 to-purple-900/30 rounded-xl p-5 border border-emerald-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">1887 — acac sintezi</p>
                <p className="text-purple-200 text-xs mt-1">
                  Atsetilaseton (Hacac) birinchi marta sintez qilingan.
                  <strong> β-diketon</strong> sinfiga kiradi — eng oddiy va eng keng tarqalgan.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1910-30 — Metalloxelat kimyosi</p>
                <p className="text-purple-200 text-xs mt-1">
                  [Cr(acac)₃], [Fe(acac)₃], [Al(acac)₃] kabi <strong>metalloxelatlar</strong> sintez qilindi.
                  Ular <strong>organik erituvchilarda eruvchanligi</strong> bilan ajralib turadi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📊</div>
              <div>
                <p className="text-yellow-400 font-bold">1960-70 — MCD spektroskopiyasi</p>
                <p className="text-purple-200 text-xs mt-1">
                  [Cr(acac)₃] <strong>MCD tadqiqotlarida standart namuna</strong>ga aylandi.
                  d³ konfiguratsiya A-term MCD beradi — bu elektron strukturani o'rganishda muhim.
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
                  [Cr(acac)₃] — <strong>katalizator</strong> sifatida keng qo'llaniladi.
                  Organik sintezda <strong>Cr katalizator</strong> sifatida, materialshunoslikda
                  <strong> yupqa qatlam</strong> olishda (CVD, ALD) ishlatiladi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 [Cr(acac)₃] ning ahamiyati:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Neytral tris-xelat</strong> — organik erituvchilarda eriydi</li>
            <li><strong>Paramagnit</strong> — MCD tadqiqotlari uchun ideal</li>
            <li><strong>d³ konfiguratsiya</strong> — 3 ta spin-ruxsat etilgan o'tish</li>
            <li><strong>6 a'zoli xelat halqasi</strong> — barqaror struktura</li>
            <li><strong>Katalizator</strong> — organik sintez, CVD, ALD</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function CrAca3CD() {
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
          <span className="text-emerald-400">[Cr(acac)₃]</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-emerald-400">🔄 [Cr(acac)₃] — CD tahlili</h1>
          <p className="text-purple-400 text-sm">
            Cr³⁺ (d³, S=3/2) • Δ/Λ enantiomerlar • Paramagnit • MCD • Neytral kompleks
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-emerald-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-emerald-400">[Cr(acac)₃]</span>
            <div>
              <h2 className="text-xl font-bold text-white">CD tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Tris(atsetilasetonato)xrom(III)" — paramagnit tris-xelat</p>
            </div>
          </div>

          <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Cr(acac)₃] — <strong className="text-emerald-400">paramagnit neytral tris-xelat kompleks</strong>.
              Cr³⁺ (d³, S=3/2) <strong>⁴A₂g ground state</strong>ga ega.
              Δ-izomer birinchi d-d o'tishda (⁴A₂g → ⁴T₂g, ~580 nm) <strong>musbat Cotton effekti</strong> beradi.
              Paramagnit bo'lgani uchun <strong>MCD (Magnetic CD)</strong> tadqiqotlari uchun ideal namuna.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">Cr³⁺ (d³)</p>
              <p className="text-purple-300">t₂g³</p>
              <p className="text-purple-400 mt-1">S = 3/2</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">Δ/Λ</p>
              <p className="text-purple-300">enantiomerlar</p>
              <p className="text-purple-400 mt-1">xiral markaz</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">λ<sub>max</sub> = 580</p>
              <p className="text-purple-300">nm</p>
              <p className="text-purple-400 mt-1">⁴T₂g o'tish</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">Δε ≈ ±0.8</p>
              <p className="text-purple-300">M⁻¹cm⁻¹</p>
              <p className="text-purple-400 mt-1">Cotton effekti</p>
            </div>
          </div>
        </div>

        {/* CD SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CDSpectrumSimulator />
        </div>

        {/* ACAC LIGAND */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AcacLigand />
        </div>

        {/* Δ vs Λ VIZUALIZATSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <DeltaLambdaVisualization />
        </div>

        {/* ELEKTRON KONFIGURATSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ElektronKonfiguratsiya />
        </div>

        {/* PARAMAGNIT CD */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ParamagneticCD />
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
        <div className="bg-gradient-to-r from-emerald-600/10 to-purple-600/10 border border-emerald-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Cr(acac)₃] — <strong className="text-emerald-400">paramagnit neytral kompleks</strong></li>
            <li>Cr³⁺ (d³, t₂g³) — <strong>S=3/2</strong>, 3 ta toq elektron</li>
            <li><strong>⁴A₂g ground state</strong> — 3 ta spin-ruxsat etilgan o'tish</li>
            <li>acac⁻ ligand — <strong>O,O-xelat</strong>, 6 a'zoli xelat halqasi</li>
            <li><strong>Δ va Λ</strong> enantiomerlar — ko'zgudagi aksi</li>
            <li>Δ-izomer → birinchi d-d o'tishda <strong>musbat</strong> Cotton effekti</li>
            <li>Λ-izomer → birinchi d-d o'tishda <strong>manfiy</strong> Cotton effekti</li>
            <li>λ<sub>max</sub> ≈ 580 nm (⁴A₂g → ⁴T₂g)</li>
            <li><strong>MCD tadqiqotlari</strong> uchun ideal namuna (A-term)</li>
            <li>Neytral kompleks — <strong>organik erituvchilarda eriydi</strong></li>
            <li>Amaliy: <strong>katalizator</strong>, CVD/ALD, materialshunoslik</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/cd/birikmalar/co-ox3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Co(ox)₃]³⁻
          </Link>
          <Link href="/ilmiy/tahlil/cd/birikmalar/fe-phen3" className="px-6 py-3 bg-emerald-600/80 rounded-xl hover:bg-emerald-500 text-white font-semibold">
            [Fe(phen)₃]²⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}