"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. CD SPEKTR SIMULYATORI ([Co(ox)₃]³⁻ uchun)
// ============================================================================
function CDSpectrumSimulator() {
  const [enantiomer, setEnantiomer] = useState("delta")
  const [ee, setEe] = useState(100)
  const [showSecondBand, setShowSecondBand] = useState(true)

  // [Co(ox)₃]³⁻ xarakterli parametrlar
  // ¹A₁g → ¹T₁g: ~560 nm (ko'rinadigan, yashil yutilish → qizil rang)
  // ¹A₁g → ¹T₂g: ~380 nm (UV)
  const bands = [
    { lambda_max: 560, epsilon: 60, delta_epsilon_max: 1.5, assign: "¹A₁g → ¹T₁g" },
    { lambda_max: 380, epsilon: 3000, delta_epsilon_max: -6.0, assign: "¹A₁g → ¹T₂g" },
  ]

  const sign = enantiomer === "delta" ? 1 : -1
  const eeFactor = ee / 100

  // CD spektri simulyatsiyasi
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 250 + i * 1.5 // 250-850 nm
      let cotton = 0
      let absorption = 0

      bands.forEach((band, idx) => {
        if (!showSecondBand && idx === 1) return
        
        const x = (lambda - band.lambda_max) / 40
        
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
      <h3 className="text-white font-semibold">📊 CD spektr simulyatori — [Co(ox)₃]³⁻</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-indigo-700/30 space-y-4">
        <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-lg p-4">
          <p className="text-indigo-400 font-bold mb-2">💎 Anion tris-xelat:</p>
          <p className="text-purple-200 text-xs">
            [Co(ox)₃]³⁻ — <strong>anion tris-xelat kompleks</strong>. Okzalato (ox²⁻) ligand
            <strong> ikkita kislorod</strong> orqali Co³⁺ ga bog'lanadi (O,O-xelat).
            Δ-izomer birinchi d-d o'tishda (¹A₁g → ¹T₁g, ~560 nm) <strong>musbat Cotton effekti</strong> beradi.
            λ<sub>max</sub> [Co(en)₃]³⁺ (470 nm) dan <strong>uzunroq</strong> — kuchsizroq maydon.
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
                    ? "bg-indigo-600/80 text-white shadow-lg" 
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
                className="w-full h-2 bg-purple-900 rounded accent-indigo-500" />
            </div>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input type="checkbox" checked={showSecondBand}
                onChange={(e) => setShowSecondBand(e.target.checked)}
                className="accent-indigo-500" />
              <span className="text-purple-300">Ikkinchi o'tishni ko'rsatish (¹T₂g, 380 nm)</span>
            </label>
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-indigo-400 font-bold text-xs mb-2">
            CD spektri va absorbsiya: {enantiomer === "delta" ? "Δ" : "Λ"}-[Co(ox)₃]³⁻
          </h5>
          <svg viewBox="0 0 400 280" className="w-full h-64">
            {/* O'qlar */}
            <line x1="40" y1="140" x2="380" y2="140" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="40" y1="20" x2="40" y2="260" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="275" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="270" fill="#a78bfa" fontSize="8">250</text>
            <text x="380" y="270" fill="#a78bfa" fontSize="8" textAnchor="end">850</text>
            <text x="20" y="140" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 140)">
              Δε / ε
            </text>

            {/* λ_max belgilari */}
            {bands.map((band, idx) => {
              if (!showSecondBand && idx === 1) return null
              const x = 40 + ((band.lambda_max - 250) / 600) * 340
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
              fill="none" stroke={sign > 0 ? "#6366f1" : "#f43f5e"} strokeWidth="2"
            />

            {/* Legend */}
            <text x="280" y="30" fill="#fbbf24" fontSize="8">— Absorbsiya (ε)</text>
            <text x="280" y="45" fill={sign > 0 ? "#6366f1" : "#f43f5e"} fontSize="8">
              — CD (Δε)
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className={`rounded-lg p-3 ${enantiomer === "delta" ? "bg-indigo-900/30 border border-indigo-500/50" : "bg-purple-900/50"}`}>
            <p className="text-purple-400">Enantiomer</p>
            <p className={`font-bold ${enantiomer === "delta" ? "text-indigo-400" : "text-rose-400"}`}>
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
          <p className="text-yellow-400 font-bold mb-1">💡 [Co(en)₃]³⁺ bilan farq:</p>
          <p className="text-purple-200">
            <strong>[Co(ox)₃]³⁻</strong> — λ<sub>max</sub> = 560 nm (uzunroq), chunki okzalato
            <strong> kuchsizroq maydon</strong> yaratadi (en ga nisbatan).
            <br/>
            <strong>[Co(en)₃]³⁺</strong> — λ<sub>max</sub> = 470 nm (qisqaroq), kuchliroq maydon.
            <br/>
            Lekin ikkalasi ham <strong>empirik qoidaga bo'ysunadi</strong>: Δ → musbat Cotton effekti.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. OKZALATO LIGAND STRUKTURASI
// ============================================================================
function OxalatoLigand() {
  const [rotate, setRotate] = useState(0)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 Okzalato (ox²⁻) ligand strukturasi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-indigo-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-indigo-400 font-bold mb-3">Okzalato ioni (C₂O₄²⁻):</h4>
            <svg viewBox="0 0 200 150" className="w-full h-36">
              {/* C₂O₄²⁻ strukturasi */}
              <line x1="70" y1="75" x2="130" y2="75" stroke="#a78bfa" strokeWidth="2" />
              <text x="100" y="70" fill="#c4b5fd" fontSize="8" textAnchor="middle">C−C</text>

              {/* 4 ta O atomlari */}
              <line x1="70" y1="75" x2="40" y2="50" stroke="#ef4444" strokeWidth="2" />
              <circle cx="40" cy="50" r="10" fill="#ef4444" />
              <text x="40" y="54" fill="white" fontSize="8" textAnchor="middle">O</text>

              <line x1="70" y1="75" x2="40" y2="100" stroke="#ef4444" strokeWidth="2" />
              <circle cx="40" cy="100" r="10" fill="#ef4444" />
              <text x="40" y="104" fill="white" fontSize="8" textAnchor="middle">O</text>

              <line x1="130" y1="75" x2="160" y2="50" stroke="#ef4444" strokeWidth="2" />
              <circle cx="160" cy="50" r="10" fill="#ef4444" />
              <text x="160" y="54" fill="white" fontSize="8" textAnchor="middle">O</text>

              <line x1="130" y1="75" x2="160" y2="100" stroke="#ef4444" strokeWidth="2" />
              <circle cx="160" cy="100" r="10" fill="#ef4444" />
              <text x="160" y="104" fill="white" fontSize="8" textAnchor="middle">O</text>

              {/* C atomlari */}
              <circle cx="70" cy="75" r="10" fill="#6b7280" />
              <text x="70" y="79" fill="white" fontSize="8" textAnchor="middle">C</text>
              <circle cx="130" cy="75" r="10" fill="#6b7280" />
              <text x="130" y="79" fill="white" fontSize="8" textAnchor="middle">C</text>

              <text x="100" y="130" fill="#a78bfa" fontSize="9" textAnchor="middle">
                C₂O₄²⁻ (okzalato)
              </text>
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-indigo-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Zaryad:</span>
                <span className="text-indigo-400 font-bold">2−</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Xelat atomlari:</span>
                <span className="text-red-400 font-bold">2 × O (O,O-xelat)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Xelat halqasi:</span>
                <span className="text-emerald-400">5 a'zoli</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Maydon kuchi:</span>
                <span className="text-yellow-400">Kuchsiz (en dan kuchsiz)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">π-akseptor:</span>
                <span className="text-purple-200">Kuchsiz π-donor</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Okzalato vs Etilendiamin:</p>
          <p className="text-purple-200">
            <strong>en (etilendiamin)</strong> — N,N-xelat, neytral ligand, kuchli maydon.
            <br/>
            <strong>ox²⁻ (okzalato)</strong> — O,O-xelat, anion ligand, kuchsiz maydon.
            <br/>
            Ikkalasi ham <strong>5 a'zoli xelat halqasi</strong> hosil qiladi, lekin donor atomlar farqli (N vs O).
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

      <div className="bg-purple-800/30 rounded-xl p-5 border border-indigo-700/30 space-y-4">
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Aylantirish burchagi:</span>
            <span className="text-emerald-400 font-mono">{rotate}°</span>
          </label>
          <input type="range" min="0" max="360" step="5" value={rotate}
            onChange={(e) => setRotate(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-indigo-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Δ */}
          <div className="bg-indigo-900/20 border-2 border-indigo-500/30 rounded-xl p-4">
            <h4 className="text-indigo-400 font-bold mb-2 text-center">Δ (delta) — P-helis</h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* C₃ o'qi */}
              <line x1="100" y1="20" x2="100" y2="180" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />
              <text x="110" y="15" fill="#fbbf24" fontSize="8">C₃</text>

              {/* Markaziy Co */}
              <circle cx="100" cy="100" r="15" fill="#6366f1" />
              <text x="100" y="105" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Co</text>

              {/* 3 ta ox ligand (spiral) */}
              {Array.from({ length: 3 }).map((_, i) => {
                const angle = (i * 120 + rotate) * Math.PI / 180
                const x1 = 100 + 40 * Math.cos(angle)
                const y1 = 100 + 40 * Math.sin(angle)
                const x2 = 100 + 70 * Math.cos(angle + 0.4)
                const y2 = 100 + 70 * Math.sin(angle + 0.4)
                return (
                  <g key={i}>
                    <line x1="100" y1="100" x2={x1} y2={y1} stroke="#818cf8" strokeWidth="2" />
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#818cf8" strokeWidth="2" />
                    <circle cx={x1} cy={y1} r="5" fill="#ef4444" />
                    <circle cx={x2} cy={y2} r="5" fill="#ef4444" />
                    <text x={(x1+x2)/2} y={(y1+y2)/2 - 5} fill="#c7d2fe" fontSize="7" textAnchor="middle">ox</text>
                  </g>
                )
              })}

              {/* Spiral yo'nalishi */}
              <path d="M 100 50 Q 140 75 145 100 Q 140 125 100 150" 
                fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="155" y="100" fill="#fbbf24" fontSize="8">O'ng vint →</text>
            </svg>
            <p className="text-indigo-400 text-xs text-center mt-2">
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

              {/* Markaziy Co */}
              <circle cx="100" cy="100" r="15" fill="#f43f5e" />
              <text x="100" y="105" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Co</text>

              {/* 3 ta ox ligand (teskari spiral) */}
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
                    <circle cx={x1} cy={y1} r="5" fill="#ef4444" />
                    <circle cx={x2} cy={y2} r="5" fill="#ef4444" />
                    <text x={(x1+x2)/2} y={(y1+y2)/2 - 5} fill="#fda4af" fontSize="7" textAnchor="middle">ox</text>
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
          <p className="text-yellow-400 font-bold mb-1">💡 Anion kompleks:</p>
          <p className="text-purple-200">
            [Co(ox)₃]³⁻ — <strong>uchta manfiy zaryad</strong>ga ega.
            Bu uni <strong>kationlar bilan</strong> (masalan, K⁺, [Co(NH₃)₆]³⁺) tuzlar hosil qilishga imkon beradi.
            Masalan: K₃[Co(ox)₃] · 3H₂O — xiral, qizil rangli kristall.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. [Co(en)₃]³⁺ vs [Co(ox)₃]³⁻ SOLISHTIRISH
// ============================================================================
function Solishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 [Co(en)₃]³⁺ vs [Co(ox)₃]³⁻ — solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-indigo-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-blue-400">[Co(en)₃]³⁺</th>
                <th className="text-center py-3 px-2 text-indigo-400">[Co(ox)₃]³⁻</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Ligand", "en (neytral)", "ox²⁻ (anion)"],
                ["Donor atomlar", "N, N", "O, O"],
                ["Kompleks zaryadi", "+3", "−3"],
                ["Maydon kuchi", "Kuchli", "Kuchsiz"],
                ["λ_max (¹T₁g)", "470 nm", "560 nm"],
                ["λ_max (¹T₂g)", "340 nm", "380 nm"],
                ["Δε (¹T₁g)", "±2.0", "±1.5"],
                ["Rang", "Sariq", "Qizil"],
                ["Xelat halqasi", "5 a'zoli (N-C-C-N)", "5 a'zoli (O-C-C-O)"],
                ["Empirik qoida", "Δ → +", "Δ → +"],
                ["Tarqalishi", "Keng o'rganilgan", "Klassik misol"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-blue-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-indigo-400">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-indigo-600/10 border border-indigo-500/30 rounded-lg p-3 text-xs">
          <p className="text-indigo-400 font-bold mb-1">💡 Asosiy farqlar:</p>
          <p className="text-purple-200">
            <strong>λ<sub>max</sub></strong> farqi — okzalato kuchsizroq maydon yaratadi → d-d o'tishlar
            <strong> uzunroq to'lqin uzunligida</strong> (560 vs 470 nm).
            <br/>
            <strong>Zaryad</strong> farqi — [Co(en)₃]³⁺ kation, [Co(ox)₃]³⁻ anion.
            <br/>
            Lekin <strong>empirik qoida bir xil</strong>: Δ → musbat Cotton effekti.
          </p>
        </div>

        <div className="mt-4 bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-indigo-400 font-bold text-xs mb-2">Spektr vizual solishtirish:</h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3 text-center">
              <svg viewBox="0 0 200 100" className="w-full h-24">
                <line x1="20" y1="80" x2="180" y2="80" stroke="#4c1d95" strokeWidth="1" />
                <polyline
                  points="20,80 50,80 60,75 70,60 75,45 78,30 81,45 86,60 95,75 105,80 115,75 120,60 125,45 130,60 135,75 145,80 180,80"
                  fill="none" stroke="#3b82f6" strokeWidth="2" />
                <text x="100" y="15" fill="#3b82f6" fontSize="9" textAnchor="middle" fontWeight="bold">
                  [Co(en)₃]³⁺ - Δ
                </text>
                <text x="78" y="25" fill="#fbbf24" fontSize="7" textAnchor="middle">470 nm</text>
              </svg>
              <p className="text-blue-400 text-xs mt-1">λ_max = 470 nm</p>
            </div>
            <div className="bg-indigo-900/20 border border-indigo-500/30 rounded p-3 text-center">
              <svg viewBox="0 0 200 100" className="w-full h-24">
                <line x1="20" y1="80" x2="180" y2="80" stroke="#4c1d95" strokeWidth="1" />
                <polyline
                  points="20,80 70,80 80,75 90,60 95,45 98,30 101,45 106,60 115,75 125,80 135,75 140,60 145,45 150,60 155,75 165,80 180,80"
                  fill="none" stroke="#6366f1" strokeWidth="2" />
                <text x="100" y="15" fill="#6366f1" fontSize="9" textAnchor="middle" fontWeight="bold">
                  [Co(ox)₃]³⁻ - Δ
                </text>
                <text x="98" y="25" fill="#fbbf24" fontSize="7" textAnchor="middle">560 nm</text>
              </svg>
              <p className="text-indigo-400 text-xs mt-1">λ_max = 560 nm</p>
            </div>
          </div>
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
      <h3 className="text-white font-semibold">🔬 Elektron konfiguratsiya va d-d o'tishlar</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-indigo-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-indigo-400 font-bold mb-3">Kristall maydon diagrammasi:</h4>
            <div className="font-mono text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-purple-700/30 pb-2">
                <span className="text-red-400 w-24">e<sub>g</sub>*</span>
                <div className="flex gap-2">
                  <span className="text-purple-500">__</span>
                  <span className="text-purple-500">__</span>
                </div>
                <span className="text-purple-500">bo'sh</span>
              </div>

              <div className="text-center text-indigo-400 text-[10px] py-1">
                Δ<sub>o</sub> = 18,400 cm⁻¹
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

              <div className="bg-indigo-900/30 border border-indigo-500/30 rounded p-2 text-center mt-3">
                <p className="text-[10px] text-purple-300">Konfiguratsiya:</p>
                <p className="text-indigo-400 font-bold">t₂g⁶ e<sub>g</sub>⁰</p>
                <p className="text-[10px] text-purple-400 mt-1">¹A₁g ground state</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-indigo-400 font-bold mb-3">d-d o'tishlar:</h4>
            <div className="space-y-2 text-xs">
              <div className="bg-purple-900/50 rounded p-2">
                <div className="flex justify-between">
                  <span className="text-indigo-400 font-bold">¹A₁g → ¹T₁g</span>
                  <span className="text-emerald-400 font-mono">~560 nm</span>
                </div>
                <p className="text-purple-400 text-[10px] mt-1">Birinchi o'tish — CD da asosiy signal</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <div className="flex justify-between">
                  <span className="text-indigo-400 font-bold">¹A₁g → ¹T₂g</span>
                  <span className="text-emerald-400 font-mono">~380 nm</span>
                </div>
                <p className="text-purple-400 text-[10px] mt-1">Ikkinchi o'tish — UV sohada</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <div className="flex justify-between">
                  <span className="text-indigo-400 font-bold">¹A₁g → ¹A₂g</span>
                  <span className="text-emerald-400 font-mono">~280 nm</span>
                </div>
                <p className="text-purple-400 text-[10px] mt-1">Uchinchi o'tish — kuchsiz</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun λ<sub>max</sub> farqli?</p>
          <p className="text-purple-200">
            <strong>Okzalato</strong> — kuchsiz maydon ligandi (O donor, π-donor xususiyati).
            <br/>
            <strong>Etilendiamin</strong> — kuchli maydon ligandi (N donor, σ-donor kuchli).
            <br/>
            Kuchsiz maydon → kichik Δ<sub>o</sub> → <strong>uzunroq to'lqin uzunligida</strong> yutilish (560 nm vs 470 nm).
            Bu <strong>spektrokimyoviy qator</strong>ga mos keladi: ox²⁻ &lt; en.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. TARIXIY KONTEKST
// ============================================================================
function TarixiyKontekst() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — okzalato komplekslar</h3>

      <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-5 border border-indigo-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">1853 — Okzalato kislota kashf etilishi</p>
                <p className="text-purple-200 text-xs mt-1">
                  Okzalato kislota (H₂C₂O₄) tabiatda keng tarqalgan (shavelak, rabarbar).
                  Koordinatsion kimyoda <strong>klassik bidentat ligand</strong> sifatida ishlatiladi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1900-10 — Verner davri</p>
                <p className="text-purple-200 text-xs mt-1">
                  Alfred Verner [Co(ox)₃]³⁻ ni sintez qildi va uning <strong>optik faolligini</strong> ko'rsatdi.
                  Bu uning koordinatsion nazariyasining <strong>yanada bir dalili</strong> bo'ldi.
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
                  [Co(ox)₃]³⁻ CD spektroskopiyasida <strong>standart namunalardan biri</strong>ga aylandi.
                  Empirik qoida (Δ → musbat) bu kompleks uchun ham tasdiqlandi.
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
                  [Co(ox)₃]³⁻ — <strong>ferroxalate</strong> komplekslari biologiada muhim.
                  Ba'zi bakteriyalar temirni okzalato orqali tashiydi.
                  Materialshunoslikda <strong>molekulyar magnitlar</strong> sifatida o'rganiladi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 [Co(ox)₃]³⁻ ning ahamiyati:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Anion tris-xelat</strong>ning klassik namunasi</li>
            <li><strong>O,O-xelat</strong> — N,N-xelatdan farqli</li>
            <li><strong>Kuchsiz maydon</strong> — spektrokimyoviy qatorda past</li>
            <li><strong>Biologik ahamiyat</strong> — ferroxalate komplekslar</li>
            <li><strong>CD standarti</strong> — empirik qoida tasdig'i</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function CoOx3CD() {
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
          <span className="text-indigo-400">[Co(ox)₃]³⁻</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-indigo-400">🔄 [Co(ox)₃]³⁻ — CD tahlili</h1>
          <p className="text-purple-400 text-sm">
            Co³⁺ (d⁶ LS) • Δ/Λ enantiomerlar • Okzalato ligand • Anion kompleks
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-indigo-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-indigo-400">[Co(ox)₃]³⁻</span>
            <div>
              <h2 className="text-xl font-bold text-white">CD tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Tris(oksalato)kobaltat(III)" — anion tris-xelat</p>
            </div>
          </div>

          <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Co(ox)₃]³⁻ — <strong className="text-indigo-400">anion tris-xelat kompleks</strong>.
              Okzalato (ox²⁻) ligandlar <strong>ikkita kislorod</strong> orqali Co³⁺ ga bog'lanadi.
              Δ-izomer birinchi d-d o'tishda (¹A₁g → ¹T₁g, ~560 nm) <strong>musbat Cotton effekti</strong> beradi.
              λ<sub>max</sub> [Co(en)₃]³⁺ dan <strong>uzunroq</strong> — kuchsizroq maydon.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-indigo-400 font-bold text-lg">Co³⁺ (LS)</p>
              <p className="text-purple-300">d⁶, t₂g⁶</p>
              <p className="text-purple-400 mt-1">S = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-indigo-400 font-bold text-lg">Δ/Λ</p>
              <p className="text-purple-300">enantiomerlar</p>
              <p className="text-purple-400 mt-1">xiral markaz</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-indigo-400 font-bold text-lg">λ<sub>max</sub> = 560</p>
              <p className="text-purple-300">nm</p>
              <p className="text-purple-400 mt-1">¹T₁g o'tish</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-indigo-400 font-bold text-lg">Δε ≈ ±1.5</p>
              <p className="text-purple-300">M⁻¹cm⁻¹</p>
              <p className="text-purple-400 mt-1">Cotton effekti</p>
            </div>
          </div>
        </div>

        {/* CD SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CDSpectrumSimulator />
        </div>

        {/* OKZALATO LIGAND */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <OxalatoLigand />
        </div>

        {/* Δ vs Λ VIZUALIZATSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <DeltaLambdaVisualization />
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
        <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Co(ox)₃]³⁻ — <strong className="text-indigo-400">anion tris-xelat kompleks</strong></li>
            <li>Co³⁺ (d⁶ LS, t₂g⁶) — <strong>diamagnit</strong>, S=0</li>
            <li>Okzalato (ox²⁻) — <strong>O,O-xelat</strong>, kuchsiz maydon ligandi</li>
            <li><strong>Δ va Λ</strong> enantiomerlar — ko'zgudagi aksi</li>
            <li>Δ-izomer → birinchi d-d o'tishda <strong>musbat</strong> Cotton effekti</li>
            <li>Λ-izomer → birinchi d-d o'tishda <strong>manfiy</strong> Cotton effekti</li>
            <li>λ<sub>max</sub> ≈ 560 nm (¹A₁g → ¹T₁g) — [Co(en)₃]³⁺ dan uzunroq</li>
            <li>Δε ≈ ±1.5 M⁻¹cm⁻¹ — [Co(en)₃]³⁺ dan kichikroq</li>
            <li>Empirik qoida bir xil: Δ → musbat Cotton effekti</li>
            <li>Biologik ahamiyati — ferroxalate komplekslar</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/cd/birikmalar/co-en3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Co(en)₃]³⁺
          </Link>
          <Link href="/ilmiy/tahlil/cd/birikmalar/cr-acac3" className="px-6 py-3 bg-indigo-600/80 rounded-xl hover:bg-indigo-500 text-white font-semibold">
            [Cr(acac)₃] →
          </Link>
        </div>

      </section>
    </main>
  )
}