"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. CD SPEKTR SIMULYATORI (interaktiv)
// ============================================================================
function CDSpectrumSimulator() {
  const [enantiomer, setEnantiomer] = useState("delta") // delta yoki lambda
  const [complexType, setComplexType] = useState("co-en3") // Co(en)3, Cr(acac)3, va boshqa
  const [ee, setEe] = useState(100) // enantiomer ortiqchaligi (%)

  // Komplekslar uchun xarakterli parametrlar
  const complexes = {
    "co-en3": { name: "[Co(en)₃]³⁺", lambda_max: 470, epsilon: 80, cotton_sign: 1 },
    "cr-acac3": { name: "[Cr(acac)₃]", lambda_max: 580, epsilon: 50, cotton_sign: 1 },
    "fe-phen3": { name: "[Fe(phen)₃]²⁺", lambda_max: 510, epsilon: 120, cotton_sign: 1 },
  }

  const c = complexes[complexType]
  const sign = enantiomer === "delta" ? c.cotton_sign : -c.cotton_sign
  const eeFactor = ee / 100

  // CD spektri simulyatsiyasi
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 300 + i * 1.25 // 300-800 nm
      const x = (lambda - c.lambda_max) / 50
      
      // Cotton effekti (Gaussian derivative)
      const cotton = sign * x * Math.exp(-0.5 * x * x) * c.epsilon * eeFactor * 0.01
      
      // Absorbsiya (Gaussian)
      const absorption = Math.exp(-0.5 * x * x) * c.epsilon * eeFactor
      
      points.push({ lambda, cotton, absorption })
    }
    return points
  }, [enantiomer, complexType, ee, c, sign])

  const maxCotton = Math.max(...spectrum.map(p => Math.abs(p.cotton)), 0.1)
  const maxAbs = Math.max(...spectrum.map(p => p.absorption), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 CD spektr simulyatori</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-rose-700/30 space-y-4">
        <div className="bg-rose-600/10 border border-rose-500/30 rounded-lg p-4">
          <p className="text-rose-400 font-bold mb-2">💎 Interaktiv simulyator:</p>
          <p className="text-purple-200 text-xs">
            Enantiomer, kompleks turi va enantiomer tozaligini o'zgartiring.
            CD spektri qanday o'zgarishini real vaqtda kuzating.
          </p>
        </div>

        {/* BOSHQARUV */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-yellow-400 font-bold mb-2 block">Enantiomer:</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setEnantiomer("delta")}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  enantiomer === "delta" 
                    ? "bg-blue-600/80 text-white shadow-lg" 
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                Δ (delta)
              </button>
              <button onClick={() => setEnantiomer("lambda")}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  enantiomer === "lambda" 
                    ? "bg-rose-600/80 text-white shadow-lg" 
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                Λ (lambda)
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-yellow-400 font-bold mb-2 block">Kompleks turi:</label>
            <select value={complexType} onChange={(e) => setComplexType(e.target.value)}
              className="w-full bg-purple-900 border border-purple-700 rounded px-2 py-2 text-xs text-white">
              {Object.entries(complexes).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">ee (%):</span>
              <span className="text-emerald-400 font-mono">{ee}%</span>
            </label>
            <input type="range" min="0" max="100" step="5" value={ee}
              onChange={(e) => setEe(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-rose-500" />
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-rose-400 font-bold text-xs mb-2">
            CD spektri va absorbsiya: {c.name} ({enantiomer === "delta" ? "Δ" : "Λ"})
          </h5>
          <svg viewBox="0 0 400 250" className="w-full h-60">
            {/* O'qlar */}
            <line x1="40" y1="125" x2="380" y2="125" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="40" y1="20" x2="40" y2="230" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="245" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="240" fill="#a78bfa" fontSize="8">300</text>
            <text x="380" y="240" fill="#a78bfa" fontSize="8" textAnchor="end">800</text>
            <text x="20" y="125" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 125)">
              Δε / ε
            </text>

            {/* Absorbsiya egri chizig'i */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 400) * 340
                const y = 230 - (p.absorption / maxAbs) * 100
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6"
            />

            {/* CD spektri */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 400) * 340
                const y = 125 - (p.cotton / maxCotton) * 100
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke={sign > 0 ? "#10b981" : "#ef4444"} strokeWidth="2"
            />

            {/* λ_max belgisi */}
            <line x1={40 + ((c.lambda_max - 300) / 500) * 340} y1="20" 
              x2={40 + ((c.lambda_max - 300) / 500) * 340} y2="230"
              stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((c.lambda_max - 300) / 500) * 340} y="15" fill="#fbbf24" fontSize="8" textAnchor="middle">
              λ_max = {c.lambda_max} nm
            </text>

            {/* Legend */}
            <text x="300" y="30" fill="#fbbf24" fontSize="8">— Absorbsiya (ε)</text>
            <text x="300" y="45" fill={sign > 0 ? "#10b981" : "#ef4444"} fontSize="8">
              — CD (Δε)
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className={`rounded-lg p-3 ${enantiomer === "delta" ? "bg-blue-900/30 border border-blue-500/50" : "bg-purple-900/50"}`}>
            <p className="text-purple-400">Enantiomer</p>
            <p className={`font-bold ${enantiomer === "delta" ? "text-blue-400" : "text-rose-400"}`}>
              {enantiomer === "delta" ? "Δ (delta)" : "Λ (lambda)"}
            </p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Cotton effekti</p>
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
          <p className="text-yellow-400 font-bold mb-1">💡 Kuzatishlar:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Δ ↔ Λ</strong> — CD spektri teskari bo'ladi (musbat ↔ manfiy)</li>
            <li><strong>ee = 100%</strong> — toza enantiomer, maksimal CD signal</li>
            <li><strong>ee = 0%</strong> — ratsemik aralashma, CD = 0</li>
            <li><strong>Cotton effekti</strong> — absorbsiya maksimumida CD ekstremumi</li>
          </ul>
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

      <div className="bg-purple-800/30 rounded-xl p-5 border border-rose-700/30 space-y-4">
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Aylantirish burchagi:</span>
            <span className="text-emerald-400 font-mono">{rotate}°</span>
          </label>
          <input type="range" min="0" max="360" step="5" value={rotate}
            onChange={(e) => setRotate(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-rose-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Δ */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
            <h4 className="text-blue-400 font-bold mb-2 text-center">Δ (delta) — P-helis</h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* Markaziy metall */}
              <circle cx="100" cy="100" r="15" fill="#3b82f6" />
              <text x="100" y="105" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">M</text>

              {/* 3 ta xelat halqasi (spiral) */}
              {Array.from({ length: 3 }).map((_, i) => {
                const angle = (i * 120 + rotate) * Math.PI / 180
                const x1 = 100 + 40 * Math.cos(angle)
                const y1 = 100 + 40 * Math.sin(angle)
                const x2 = 100 + 70 * Math.cos(angle + 0.3)
                const y2 = 100 + 70 * Math.sin(angle + 0.3)
                return (
                  <g key={i}>
                    <line x1="100" y1="100" x2={x1} y2={y1} stroke="#60a5fa" strokeWidth="2" />
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#60a5fa" strokeWidth="2" />
                    <circle cx={x1} cy={y1} r="6" fill="#60a5fa" />
                    <circle cx={x2} cy={y2} r="6" fill="#60a5fa" />
                  </g>
                )
              })}

              {/* Spiral yo'nalishi ko'rsatkichi */}
              <path d="M 100 60 Q 130 80 140 100 Q 130 120 100 140" 
                fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="150" y="100" fill="#fbbf24" fontSize="9">O'ng vint →</text>
            </svg>
            <p className="text-blue-400 text-xs text-center mt-2">
              C₃ o'qi bo'ylab o'ngga burilgan
            </p>
          </div>

          {/* Λ */}
          <div className="bg-rose-900/20 border border-rose-500/30 rounded-xl p-4">
            <h4 className="text-rose-400 font-bold mb-2 text-center">Λ (lambda) — M-helis</h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* Markaziy metall */}
              <circle cx="100" cy="100" r="15" fill="#f43f5e" />
              <text x="100" y="105" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">M</text>

              {/* 3 ta xelat halqasi (teskari spiral) */}
              {Array.from({ length: 3 }).map((_, i) => {
                const angle = (i * 120 - rotate) * Math.PI / 180
                const x1 = 100 + 40 * Math.cos(angle)
                const y1 = 100 + 40 * Math.sin(angle)
                const x2 = 100 + 70 * Math.cos(angle - 0.3)
                const y2 = 100 + 70 * Math.sin(angle - 0.3)
                return (
                  <g key={i}>
                    <line x1="100" y1="100" x2={x1} y2={y1} stroke="#fb7185" strokeWidth="2" />
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fb7185" strokeWidth="2" />
                    <circle cx={x1} cy={y1} r="6" fill="#fb7185" />
                    <circle cx={x2} cy={y2} r="6" fill="#fb7185" />
                  </g>
                )
              })}

              {/* Spiral yo'nalishi ko'rsatkichi */}
              <path d="M 100 60 Q 70 80 60 100 Q 70 120 100 140" 
                fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="30" y="100" fill="#fbbf24" fontSize="9">← Chap vint</text>
            </svg>
            <p className="text-rose-400 text-xs text-center mt-2">
              C₃ o'qi bo'ylab chapga burilgan
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Enantiomerlar:</p>
          <p className="text-purple-200">
            Δ va Λ — bir-birining <strong>ko'zgudagi aksi</strong> (enantiomerlar).
            Ular bir xil fizik-kimyoviy xossalarga ega, lekin <strong>qutblangan nur</strong> bilan 
            o'zaro ta'siri farqli. CD spektroskopiyasi aynan shu farqni o'lchaydi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. COTTON EFFEKTI TURLARI
// ============================================================================
function CottonEffectTypes() {
  const [type, setType] = useState("positive")

  const types = {
    positive: {
      name: "Musbat Cotton effekti",
      desc: "Δε > 0 — chap qutblangan nur kuchliroq yutiladi",
      color: "#10b981",
      sign: 1
    },
    negative: {
      name: "Manfiy Cotton effekti",
      desc: "Δε < 0 — o'ng qutblangan nur kuchliroq yutiladi",
      color: "#ef4444",
      sign: -1
    },
    bisignate: {
      name: "Bisignate Cotton effekti",
      desc: "Eksiton juftlashuvi — musbat + manfiy juftlik",
      color: "#a855f7",
      sign: 0
    }
  }

  const t = types[type]

  // Spektr simulyatsiyasi
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 300; i++) {
      const lambda = 300 + i * 2
      const x = (lambda - 500) / 50

      let cotton
      if (type === "bisignate") {
        // Eksiton juftlashuvi — ikkita Gaussian derivative
        cotton = x * Math.exp(-0.5 * Math.pow(x + 0.5, 2)) - x * Math.exp(-0.5 * Math.pow(x - 0.5, 2))
      } else {
        // Oddiy Cotton effekti
        cotton = t.sign * x * Math.exp(-0.5 * x * x)
      }

      points.push({ lambda, cotton })
    }
    return points
  }, [type, t])

  const maxCotton = Math.max(...spectrum.map(p => Math.abs(p.cotton)), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 Cotton effekti turlari</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-rose-700/30 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(types).map(([key, val]) => (
            <button key={key} onClick={() => setType(key)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                type === key 
                  ? "bg-rose-600/80 text-white shadow-lg" 
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              {val.name}
            </button>
          ))}
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="100" x2="380" y2="100" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="40" y1="20" x2="40" y2="180" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="20" y="100" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 100)">
              Δε
            </text>

            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 300) * 340
                const y = 100 - (p.cotton / maxCotton) * 70
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke={t.color} strokeWidth="2"
            />

            <text x="200" y="15" fill={t.color} fontSize="10" textAnchor="middle" fontWeight="bold">
              {t.name}
            </text>
          </svg>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-3">
          <p className="text-rose-400 font-bold text-xs mb-1">{t.name}:</p>
          <p className="text-purple-200 text-xs">{t.desc}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. BIOT QONUNI KALKULYATORI
// ============================================================================
function BiotCalculator() {
  const [theta, setTheta] = useState(10) // millidegrees
  const [c, setC] = useState(0.001) // mol/L
  const [l, setL] = useState(1) // cm

  // [θ] = 100 * θ / (c * l)
  const molarEllipticity = (100 * theta) / (c * l)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Biot qonuni kalkulyatori</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-rose-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-2">Biot qonuni:</p>
          <p className="text-rose-400 text-lg">[θ] = 100 · θ / (c · l)</p>
          <p className="text-purple-400 text-xs mt-2">[θ] — mol elliptiklik (deg·cm²/dmol)</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400">θ (mdeg):</span>
              <span className="text-emerald-400 font-mono">{theta}</span>
            </label>
            <input type="range" min="-100" max="100" step="1" value={theta}
              onChange={(e) => setTheta(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-rose-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400">c (M):</span>
              <span className="text-emerald-400 font-mono">{c.toExponential(1)}</span>
            </label>
            <input type="range" min="0.0001" max="0.01" step="0.0001" value={c}
              onChange={(e) => setC(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-rose-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400">l (cm):</span>
              <span className="text-emerald-400 font-mono">{l}</span>
            </label>
            <input type="range" min="0.1" max="10" step="0.1" value={l}
              onChange={(e) => setL(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-rose-500" />
          </div>
        </div>

        <div className="bg-rose-900/30 border border-rose-500/50 rounded-lg p-4 text-center">
          <p className="text-rose-400 text-xs mb-1">Mol elliptiklik [θ]:</p>
          <p className="text-emerald-400 font-bold font-mono text-2xl">
            {molarEllipticity.toExponential(2)}
          </p>
          <p className="text-purple-400 text-xs mt-1">deg·cm²/dmol</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. XELAT KONFORMATSIYA JADVALI (TUZATILGAN)
// ============================================================================
function ChelateConformationTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 Xelat halqasi konformatsiyasi — δ va λ</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-rose-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Metall</th>
                <th className="text-center py-3 px-2 text-yellow-400">Xelat</th>
                <th className="text-center py-3 px-2 text-yellow-400">Atama</th>
                <th className="text-center py-3 px-2 text-yellow-400">Barqarorlik</th>
                <th className="text-left py-3 px-2 text-yellow-400">CD signali</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Δ-[M(en)₃]", "λλλ", "lel", "✅ Eng barqaror", "Musbat Cotton"],
                ["Δ-[M(en)₃]", "δδδ", "ob", "❌ Kam barqaror", "Kuchsiz/teskari"],
                ["Λ-[M(en)₃]", "δδδ", "lel", "✅ Eng barqaror", "Manfiy Cotton"],
                ["Λ-[M(en)₃]", "λλλ", "ob", "❌ Kam barqaror", "Kuchsiz/teskari"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-rose-400">{r[0]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[1]}</td>
                  <td className="py-2 px-2 text-center font-bold text-yellow-400">{r[2]}</td>
                  <td className="py-2 px-2 text-center">{r[3]}</td>
                  <td className="py-2 px-2 text-[10px]">{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-purple-400 text-xs mt-3">
          * <strong>lel</strong> — metall Δ bilan xelat λ, yoki Λ bilan δ mos kelgan holat (eng barqaror).
          <br/>
          * <strong>ob</strong> (obverse) — teskari moslik (kam barqaror, sterik to'siq).
        </p>
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
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst</h3>

      <div className="bg-gradient-to-br from-rose-900/30 to-purple-900/30 rounded-xl p-5 border border-rose-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1812 — Jean-Baptiste Biot</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Optik aylanish</strong> hodisasini kashf etdi. Xiral moddalar qutblangan nur tekisligini 
                  aylantirishini ko'rsatdi. Bu CD spektroskopiyasining asosi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📊</div>
              <div>
                <p className="text-yellow-400 font-bold">1950-60 — CD spektroskopiyasi rivojlanishi</p>
                <p className="text-purple-200 text-xs mt-1">
                  Birinchi CD spektrometrlar yaratildi. <strong>Cotton effekti</strong> va 
                  <strong> eksiton juftlashuvi</strong> tushunchalari shakllandi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🧬</div>
              <div>
                <p className="text-yellow-400 font-bold">1970-80 — Biologik qo'llanilish</p>
                <p className="text-purple-200 text-xs mt-1">
                  CD <strong>oqsillar ikkilamchi strukturasi</strong> (α-spirl, β-qavat) o'rganishda 
                  asosiy usulga aylandi. Metalloproteinlar va DNK o'rganishda keng qo'llanila boshladi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 CD ning ahamiyati:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Xiral komplekslar</strong> — absolyut konfiguratsiya aniqlash</li>
            <li><strong>Enantiomer tozaligi</strong> — ee% aniqlash</li>
            <li><strong>Biologiya</strong> — oqsillar, DNK konformatsiyasi</li>
            <li><strong>Farmatsevtika</strong> — xiral dori vositalari</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function CDSpektroskopiya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg">← Tahlil usullari</Link>
        <div>
          <h1 className="text-2xl font-bold text-rose-400">🔄 CD spektroskopiya</h1>
          <p className="text-purple-400 text-sm">Circular Dichroism • Xirallik • Δ/Λ enantiomerlar • Cotton effekti</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* BIRIKMALAR KARTASI */}
        <Link 
          href="/ilmiy/tahlil/cd/birikmalar"
          className="group block bg-gradient-to-r from-rose-900/40 to-purple-900/40 border border-rose-700/50 rounded-2xl p-6 hover:bg-rose-900/60 hover:border-rose-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-rose-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🔄</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-rose-400 group-hover:text-rose-300 transition-colors">
                Birikmalarning CD spektroskopik tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Xiral komplekslarning CD spektrlari tahlili. Cotton effekti, Δ/Λ enantiomerlar, 
                optik faollik va absolyut konfiguratsiya har bir birikma uchun batafsil.
              </p>
            </div>
            <div className="text-3xl text-rose-400 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-rose-600/20 text-rose-400 border border-rose-600/30 px-3 py-1 rounded-full text-xs">12 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Cotton effekti</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Δ/Λ konfiguratsiya</span>
          </div>
        </Link>

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">📋 CD spektroskopiya haqida</h2>
          <div className="bg-rose-600/10 border border-rose-500/30 rounded-xl p-5 mb-4">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-rose-400">Circular Dichroism (CD)</strong> — xiral moddalarning 
              <strong> chap (L-CPL) va o'ng (R-CPL) aylanasimon qutblangan nurni</strong> turlicha yutishiga asoslangan 
              spektroskopik usul. ΔA = A(L) − A(R) yoki elliptiklik θ (millidegrees) o'lchanadi.
              Kompleks birikmalarda <strong className="text-rose-400">Δ va Λ</strong> enantiomerlarni farqlash,
              absolyut konfiguratsiyani aniqlash uchun eng ishonchli usul.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-purple-800/30 rounded p-3">
              <p className="text-rose-400 font-bold">ΔA = A(L) − A(R)</p>
              <p className="text-purple-300">CD signali</p>
            </div>
            <div className="bg-purple-800/30 rounded p-3">
              <p className="text-rose-400 font-bold">[θ] = 100θ/(c·l)</p>
              <p className="text-purple-300">Biot qonuni</p>
            </div>
            <div className="bg-purple-800/30 rounded p-3">
              <p className="text-rose-400 font-bold">Δ ↔ Λ</p>
              <p className="text-purple-300">Enantiomerlar</p>
            </div>
          </div>
        </div>

        {/* CD SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CDSpectrumSimulator />
        </div>

        {/* Δ vs Λ VIZUALIZATSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <DeltaLambdaVisualization />
        </div>

        {/* COTTON EFFEKTI TURLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CottonEffectTypes />
        </div>

        {/* BIOT KALKULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <BiotCalculator />
        </div>

        {/* XELAT KONFORMATSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ChelateConformationTable />
        </div>

        {/* TARIXIY */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TarixiyKontekst />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-rose-600/10 to-purple-600/10 border border-rose-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>CD — <strong className="text-rose-400">xiral komplekslarni o'rganishda yagona bevosita usul</strong></li>
            <li>Δ (P-helis) va Λ (M-helis) — Cotton effekti orqali farqlanadi</li>
            <li>Musbat Cotton (Δε &gt; 0) → Δ-konfiguratsiya (empirik qoida)</li>
            <li>Manfiy Cotton (Δε &lt; 0) → Λ-konfiguratsiya</li>
            <li>Xelat konformatsiyasi (δ/λ) — CD signaliga qo'shimcha hissa</li>
            <li>Bisignate Cotton — eksiton juftlashuvi (ko'p xromoforli)</li>
            <li>Enantiomer tozaligi (ee%) — CD intensivligi orqali aniqlanadi</li>
            <li>Biot qonuni: [θ] = 100θ/(c·l) — mol elliptiklik hisoblash</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/xps" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← XPS spektroskopiya</Link>
          <Link href="/ilmiy/tahlil/epr" className="px-6 py-3 bg-rose-600/80 rounded-xl hover:bg-rose-500 text-white font-semibold">EPR spektroskopiya →</Link>
        </div>

      </section>
    </main>
  )
}