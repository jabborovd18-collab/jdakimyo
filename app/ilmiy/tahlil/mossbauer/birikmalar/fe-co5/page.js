"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. MÖSSBAUER SPEKTR SIMULYATORI ([Fe(CO)₅] — SINGLET)
// ============================================================================
function MossbauerSpectrum() {
  const [delta, setDelta] = useState(-0.09)
  const [linewidth, setLinewidth] = useState(0.25)
  const [temperature, setTemperature] = useState(298)

  // Singlet — bitta Lorentzian cho'qqi
  const spectrum = useMemo(() => {
    const points = []
    const vMin = -3
    const vMax = 3
    const steps = 400

    for (let i = 0; i <= steps; i++) {
      const v = vMin + (i / steps) * (vMax - vMin)
      
      // Singlet cho'qqisi (bitta Lorentzian)
      const halfWidth = linewidth / 2
      const lorentz = 1 / (1 + Math.pow((v - delta) / halfWidth, 2))
      
      // Harorat effekti (Lamb-Mössbauer faktor)
      const tempFactor = Math.min(1, 300 / temperature)
      const absorption = lorentz * tempFactor
      
      points.push({ v, y: absorption })
    }
    return points
  }, [delta, linewidth, temperature])

  const maxY = Math.max(...spectrum.map(p => p.y), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 Mössbauer spektr simulyatori — [Fe(CO)₅]</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-4">
          <p className="text-amber-400 font-bold mb-2">💎 [Fe(CO)₅] ning o'ziga xosligi:</p>
          <p className="text-purple-200 text-xs">
            Fe⁰ (d⁸, 18e⁻) — <strong>nol oksidlanish darajasi</strong>. CO kuchli π-akseptor ligandlar
            tufayli Fe <strong>kuchli π-back-bonding</strong> ga ega. δ = −0.09 mm/s — <strong>juda past</strong>,
            chunki s-elektron zichligi yuqori (Fe⁰ da elektronlar ko'p). ΔE<sub>Q</sub> = 0.00 mm/s —
            <strong> trigonal bipyramidal simmetriya</strong> (D₃h).
          </p>
        </div>

        {/* SLIDERLAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">δ (izomer siljish):</span>
                <span className="text-teal-400 font-mono">{delta.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="-0.3" max="0.3" step="0.01" value={delta}
                onChange={(e) => setDelta(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">Γ (chiziq kengligi):</span>
                <span className="text-teal-400 font-mono">{linewidth.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="0.15" max="0.6" step="0.01" value={linewidth}
                onChange={(e) => setLinewidth(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">Harorat (T):</span>
                <span className="text-teal-400 font-mono">{temperature} K</span>
              </label>
              <input type="range" min="80" max="400" step="5" value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
              <p className="text-amber-400 font-bold text-xs mb-1">⚠️ ΔE<sub>Q</sub> = 0.00</p>
              <p className="text-purple-200 text-[10px]">
                [Fe(CO)₅] da kvadrupol bo'linishi <strong>yo'q</strong> — trigonal bipyramidal simmetriya.
                Shuning uchun spektr <strong>singlet</strong> (bitta cho'qqi).
              </p>
            </div>
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-teal-400 font-bold text-xs mb-2">Mössbauer spektri (⁵⁷Fe, 14.4 keV):</h5>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="170" x2="380" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">v (mm/s)</text>
            <text x="40" y="195" fill="#a78bfa" fontSize="8">-3</text>
            <text x="380" y="195" fill="#a78bfa" fontSize="8" textAnchor="end">+3</text>
            <text x="20" y="95" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 95)">
              Yutilish
            </text>

            {/* Spektr chizig'i */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / spectrum.length) * 340
                const y = 170 - (p.y / maxY) * 140
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#14b8a6" strokeWidth="2"
            />

            {/* Markaz (δ) */}
            <line x1={40 + ((delta + 3) / 6) * 340} y1="30" x2={40 + ((delta + 3) / 6) * 340} y2="170"
              stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((delta + 3) / 6) * 340} y="25" fill="#fbbf24" fontSize="9" textAnchor="middle" fontWeight="bold">
              δ = {delta.toFixed(2)} mm/s
            </text>

            {/* Singlet belgisi */}
            <text x="200" y="15" fill="#14b8a6" fontSize="11" textAnchor="middle" fontWeight="bold">
              SINGLET (1 cho'qqi)
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-teal-900/30 border border-teal-500/30 rounded-lg p-3">
            <p className="text-teal-400">δ</p>
            <p className="text-white font-bold font-mono">{delta.toFixed(2)} mm/s</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-yellow-400">ΔE<sub>Q</sub></p>
            <p className="text-white font-bold font-mono">0.00 mm/s</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Spektr</p>
            <p className="text-teal-400 font-bold">Singlet</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Kuzatishlar:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Faqat 1 cho'qqi</strong> — ΔE<sub>Q</sub> = 0 (trigonal bipyramidal simmetriya)</li>
            <li><strong>δ juda past</strong> (−0.09) — Fe⁰ nol oksidlanish, kuchli π-back-bonding</li>
            <li><strong>Harorat pastlashi</strong> → intensivlik oshadi</li>
            <li><strong>δ siljishi</strong> → cho'qqi o'ngga yoki chapga siljiydi</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. δ va ΔE_Q TAHLILI
// ============================================================================
function DeltaAnalysis() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 δ va ΔE<sub>Q</sub> tahlili — nima uchun bunday?</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-teal-900/20 border border-teal-500/30 rounded-xl p-5">
            <h4 className="text-teal-400 font-bold mb-3">δ = −0.09 mm/s — nima anglatadi?</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>Fe⁰</strong> — nol oksidlanish darajasi</li>
              <li>✓ <strong>Kuchli π-back-bonding</strong> — CO ligandlar elektron qaytaradi</li>
              <li>✓ <strong>S-elektron zichligi yuqori</strong> — Fe⁰ da elektronlar ko'p</li>
              <li>✓ <strong>18 elektronli kompleks</strong> — barqaror</li>
            </ul>
            <div className="mt-3 bg-purple-900/50 rounded p-2">
              <p className="text-purple-400 text-[10px]">Taqqoslash:</p>
              <p className="text-teal-400 text-xs font-mono">Fe⁰: δ ≈ −0.1 − 0.1 mm/s ← [Fe(CO)₅]</p>
              <p className="text-teal-400 text-xs font-mono">Fe²⁺ LS: δ ≈ 0.0 − 0.5 mm/s</p>
              <p className="text-teal-400 text-xs font-mono">Fe³⁺ HS: δ ≈ 0.3 − 0.6 mm/s</p>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-5">
            <h4 className="text-yellow-400 font-bold mb-3">ΔE<sub>Q</sub> = 0.00 mm/s — nima anglatadi?</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>Nol EFG</strong> — trigonal bipyramidal simmetriya</li>
              <li>✓ <strong>D₃h simmetriya</strong> — yuqori simmetriya</li>
              <li>✓ <strong>Elektron taqsimoti simmetrik</strong></li>
              <li>✓ <strong>Singlet spektr</strong> — kvadrupol bo'linishi yo'q</li>
            </ul>
            <div className="mt-3 bg-purple-900/50 rounded p-2">
              <p className="text-purple-400 text-[10px]">Taqqoslash:</p>
              <p className="text-yellow-400 text-xs font-mono">Fe⁰ (simmetrik): ΔE<sub>Q</sub> = 0.0 mm/s ← [Fe(CO)₅]</p>
              <p className="text-yellow-400 text-xs font-mono">Fe²⁺ HS: ΔE<sub>Q</sub> ≈ 2.0 − 3.5 mm/s</p>
              <p className="text-yellow-400 text-xs font-mono">Fe³⁺ HS: ΔE<sub>Q</sub> ≈ 0.0 − 0.5 mm/s</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-teal-400 font-bold text-xs mb-2">π-Back-bonding mexanizmi:</h5>
          <div className="font-mono text-xs space-y-2">
            <div className="flex justify-between items-center bg-purple-900/50 rounded p-2">
              <span className="text-purple-300">σ-donation:</span>
              <span className="text-emerald-400">CO → Fe (elektron beradi)</span>
            </div>
            <div className="flex justify-between items-center bg-purple-900/50 rounded p-2">
              <span className="text-purple-300">π-back-donation:</span>
              <span className="text-amber-400">Fe → CO (elektron qaytaradi)</span>
            </div>
            <p className="text-purple-400 text-[10px] mt-2">
              π-back-bonding → Fe⁰ da s-elektron zichligi oshadi → δ past (−0.09 mm/s)
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun δ juda past?</p>
          <p className="text-purple-200">
            <strong>Fe⁰</strong> — nol oksidlanish darajasi, barcha elektronlar saqlangan.
            CO kuchli π-akseptor — Fe dan elektron oladi, lekin π-back-bonding orqali qaytaradi.
            Natijada Fe⁰ atrofida <strong>elektron zichligi yuqori</strong> → s-elektron zichligi yuqori →
            <strong> δ past</strong> (−0.09 mm/s).
            <br/>
            Bu Fe²⁺ (δ ≈ 1.2) va Fe³⁺ (δ ≈ 0.4) dan <strong>sezilarli farqli</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. Fe⁰ vs Fe²⁺ vs Fe³⁺ SOLISHTIRISH
// ============================================================================
function FeOxidlanishSolishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Fe⁰ vs Fe²⁺ vs Fe³⁺ — Mössbauer solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-amber-400">[Fe(CO)₅] (Fe⁰)</th>
                <th className="text-center py-3 px-2 text-green-400">[Fe(H₂O)₆]²⁺ (Fe²⁺)</th>
                <th className="text-center py-3 px-2 text-orange-400">[Fe(H₂O)₆]³⁺ (Fe³⁺)</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Oksidlanish", "0", "+2", "+3"],
                ["Elektron konfiguratsiya", "d⁸ (18e⁻)", "d⁶ (HS)", "d⁵ (HS)"],
                ["Geometriya", "Trigonal bipir.", "Oktaedrik", "Oktaedrik"],
                ["Spin holati", "S=0", "S=2", "S=5/2"],
                ["Magnit holat", "Diamagnit", "Paramagnit", "Paramagnit"],
                ["δ (mm/s)", "−0.09", "1.20", "0.40"],
                ["ΔE_Q (mm/s)", "0.00", "3.00", "0.20"],
                ["H (Tesla)", "0", "0", "0"],
                ["Spektr turi", "Singlet", "Katta dublet", "Kichik dublet"],
                ["Ligand", "CO (π-akseptor)", "H₂O (kuchsiz)", "H₂O (kuchsiz)"],
                ["Rang", "Sariq", "Och yashil", "Binafsha-sariq"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-amber-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-green-400">{r[2]}</td>
                  <td className="py-2 px-2 text-center text-orange-400">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-teal-600/10 border border-teal-500/30 rounded-lg p-3 text-xs">
          <p className="text-teal-400 font-bold mb-1">💡 Asosiy farqlar:</p>
          <p className="text-purple-200">
            <strong>δ qiymatlari</strong>: Fe⁰ (−0.09) &lt; Fe³⁺ (0.40) &lt; Fe²⁺ (1.20)
            <br/>
            Oksidlanish darajasi oshgani sari s-elektron zichligi kamayadi → δ oshadi.
            <br/>
            <strong>ΔE<sub>Q</sub> qiymatlari</strong>: Fe⁰ (0.00) &lt; Fe³⁺ (0.20) &lt;&lt; Fe²⁺ (3.00)
            <br/>
            Fe²⁺ HS da e<sub>g</sub> da bitta elektron → katta asimmetriya → katta ΔE<sub>Q</sub>.
          </p>
        </div>

        <div className="mt-4 bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-amber-400 font-bold text-xs mb-2">Spektr vizual solishtirish:</h5>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-amber-900/20 border border-amber-500/30 rounded p-2 text-center">
              <svg viewBox="0 0 150 80" className="w-full h-16">
                <line x1="10" y1="65" x2="140" y2="65" stroke="#4c1d95" strokeWidth="1" />
                <polyline
                  points="10,65 40,65 55,60 65,40 70,20 75,40 85,60 100,65 140,65"
                  fill="none" stroke="#f59e0b" strokeWidth="2" />
              </svg>
              <p className="text-amber-400 text-[10px] mt-1">Fe⁰ - Singlet</p>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded p-2 text-center">
              <svg viewBox="0 0 150 80" className="w-full h-16">
                <line x1="10" y1="65" x2="140" y2="65" stroke="#4c1d95" strokeWidth="1" />
                <polyline
                  points="10,65 25,65 30,60 35,40 38,20 41,40 46,60 55,65 95,65 100,60 105,40 108,20 111,40 116,60 125,65 140,65"
                  fill="none" stroke="#22c55e" strokeWidth="2" />
              </svg>
              <p className="text-green-400 text-[10px] mt-1">Fe²⁺ HS - Katta dublet</p>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded p-2 text-center">
              <svg viewBox="0 0 150 80" className="w-full h-16">
                <line x1="10" y1="65" x2="140" y2="65" stroke="#4c1d95" strokeWidth="1" />
                <polyline
                  points="10,65 50,65 55,60 60,50 63,35 66,50 71,60 80,65 89,60 94,50 97,35 100,50 105,60 115,65 140,65"
                  fill="none" stroke="#f97316" strokeWidth="2" />
              </svg>
              <p className="text-orange-400 text-[10px] mt-1">Fe³⁺ HS - Kichik dublet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. TRIGONAL BIPYRAMIDAL GEOMETRIYA
// ============================================================================
function TrigonalBipyramidal() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 Trigonal bipyramidal geometriya — D₃h simmetriya</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-amber-400 font-bold text-xs mb-3">[Fe(CO)₅] strukturasi:</h5>
          <svg viewBox="0 0 400 250" className="w-full h-56">
            {/* Markaziy Fe */}
            <circle cx="200" cy="125" r="22" fill="#f59e0b" />
            <text x="200" y="131" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">Fe⁰</text>

            {/* 2 ta aksial CO */}
            <line x1="200" y1="125" x2="200" y2="40" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="200" cy="40" r="14" fill="#3b82f6" />
            <text x="200" y="45" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">CO</text>

            <line x1="200" y1="125" x2="200" y2="210" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="200" cy="210" r="14" fill="#3b82f6" />
            <text x="200" y="215" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">CO</text>

            {/* 3 ta ekvatorial CO (uchburchak) */}
            <line x1="200" y1="125" x2="120" y2="125" stroke="#10b981" strokeWidth="2" />
            <circle cx="120" cy="125" r="14" fill="#10b981" />
            <text x="120" y="130" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">CO</text>

            <line x1="200" y1="125" x2="280" y2="125" stroke="#10b981" strokeWidth="2" />
            <circle cx="280" cy="125" r="14" fill="#10b981" />
            <text x="280" y="130" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">CO</text>

            <line x1="200" y1="125" x2="200" y2="165" stroke="#10b981" strokeWidth="2" />
            <circle cx="200" cy="165" r="14" fill="#10b981" />
            <text x="200" y="170" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">CO</text>

            {/* Labels */}
            <text x="230" y="35" fill="#3b82f6" fontSize="9">Aksial</text>
            <text x="290" y="120" fill="#10b981" fontSize="9">Ekvatorial</text>
            <text x="200" y="240" fill="#c4b5fd" fontSize="10" textAnchor="middle">
              D₃h simmetriya — 2 aksial + 3 ekvatorial
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-400 font-bold mb-1">Aksial CO (2 ta)</p>
            <p className="text-purple-200 text-[10px]">
              Fe−C = 1.83 Å<br/>
              Burchak: 180°<br/>
              Kuchliroq bog'
            </p>
          </div>
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3">
            <p className="text-emerald-400 font-bold mb-1">Ekvatorial CO (3 ta)</p>
            <p className="text-purple-200 text-[10px]">
              Fe−C = 1.80 Å<br/>
              Burchak: 120°<br/>
              Kuchliroq π-back-bonding
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun ΔE<sub>Q</sub> = 0?</p>
          <p className="text-purple-200">
            <strong>Trigonal bipyramidal</strong> geometriya (D₃h) — yuqori simmetriya.
            5 ta CO ligand <strong>simmetrik joylashgan</strong> → elektron zichligi simmetrik →
            EFG = 0 → ΔE<sub>Q</sub> = 0 → <strong>singlet spektr</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. HARORATGA BOGLIQLIK
// ============================================================================
function TemperatureEffect() {
  const [T, setT] = useState(298)
  
  // Lamb-Mössbauer faktor (soddalashtirilgan)
  const f = Math.exp(-0.001 * T)
  const intensity = f * 100

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌡️ Haroratga bog'liqlik — Lamb-Mössbauer faktor</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-2">Lamb-Mössbauer faktor:</p>
          <p className="text-teal-400 text-lg">f = exp(−k²⟨x²⟩)</p>
          <p className="text-purple-400 text-xs mt-2">k — gamma-nur to'lqin vektori, ⟨x²⟩ — atom tebranishi</p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Harorat (T):</span>
            <span className="text-teal-400 font-mono">{T} K</span>
          </label>
          <input type="range" min="80" max="400" step="5" value={T}
            onChange={(e) => setT(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>80 K (suyuq N₂)</span>
            <span>298 K (xona)</span>
            <span>400 K</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-teal-900/30 border border-teal-500/30 rounded-lg p-3">
            <p className="text-teal-400">f (recoil-free)</p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{f.toFixed(3)}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Intensivlik</p>
            <p className="text-yellow-400 font-bold font-mono text-lg">{intensity.toFixed(1)}%</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Amaliy maslahat:</p>
          <p className="text-purple-200">
            [Fe(CO)₅] — <strong>suyuq</strong> (xona haroratida). Mössbauer o'lchash uchun <strong>qattiq holatda</strong> bo'lishi kerak.
            Shuning uchun <strong>past haroratda</strong> (80-100 K) muzlatib o'lchanadi.
            Diamagnit kompleks — harorat spektr shakliga ta'sir qilmaydi, faqat intensivlikka.
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
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — [Fe(CO)₅] va Mössbauer</h3>

      <div className="bg-gradient-to-br from-amber-900/30 to-purple-900/30 rounded-xl p-5 border border-amber-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">1891 — Mond va Langer</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Ludwig Mond</strong> va <strong>Carl Langer</strong> [Fe(CO)₅] ni birinchi marta sintez qilgan.
                  Temir kukuni va CO gazidan olingan. <strong>Mond jarayoni</strong> — toza nikel olish usuli.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1930-50 — Hieber va organometallik kimyo</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Walter Hieber</strong> (Germaniya) — <strong>organometallik kimyoning otasi</strong>.
                  [Fe(CO)₅] va boshqa karbonillarni keng o'rgangan. π-back-bonding tushunchasi shakllangan.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚛️</div>
              <div>
                <p className="text-yellow-400 font-bold">1960-70 — Mössbauer tadqiqotlari</p>
                <p className="text-purple-200 text-xs mt-1">
                  [Fe(CO)₅] — <strong>Fe⁰ ning klassik namunasi</strong>.
                  δ = −0.09 mm/s — nol oksidlanish, kuchli π-back-bonding tasdig'i.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 [Fe(CO)₅] ning ahamiyati:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Birinchi metal karbonil</strong> — organometallik kimyo boshlanishi</li>
            <li><strong>18 elektron qoidasi</strong> — barqaror kompleks</li>
            <li><strong>π-back-bonding</strong> klassik namunasi</li>
            <li><strong>Fe⁰</strong> — nol oksidlanish darajasi</li>
            <li><strong>Sintez boshlang'ich modda</strong> — boshqa Fe komplekslar olish</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function FeCO5Mossbauer() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <nav className="flex items-center gap-2 text-sm flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300">Tahlil</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/mossbauer" className="text-purple-400 hover:text-purple-300">Mössbauer</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar" className="text-purple-400 hover:text-purple-300">Birikmalar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-amber-400">[Fe(CO)₅]</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-amber-400">⚛️ [Fe(CO)₅] — Mössbauer tahlili</h1>
          <p className="text-purple-400 text-sm">
            Fe⁰ (d⁸, 18e⁻) • δ = −0.09 mm/s • ΔE<sub>Q</sub> = 0.00 mm/s • Singlet • Diamagnit
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-amber-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-amber-400">[Fe(CO)₅]</span>
            <div>
              <h2 className="text-xl font-bold text-white">Mössbauer tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Pentakarboniltemir(0)" — Fe⁰ klassikasi</p>
            </div>
          </div>

          <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Fe(CO)₅] — <strong className="text-amber-400">Fe⁰ (d⁸, 18e⁻)</strong> ning klassik namunasi.
              <strong> Nol oksidlanish darajasi</strong> — barcha elektronlar saqlangan.
              CO kuchli π-akseptor ligandlar tufayli <strong>kuchli π-back-bonding</strong> mavjud.
              Mössbauer spektri — <strong>singlet</strong> (δ = −0.09 mm/s, ΔE<sub>Q</sub> = 0.00 mm/s).
              δ juda past — Fe⁰ da s-elektron zichligi yuqori. ΔE<sub>Q</sub> = 0 — trigonal bipyramidal simmetriya.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">Fe⁰ (d⁸)</p>
              <p className="text-purple-300">18 elektron</p>
              <p className="text-purple-400 mt-1">S = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">δ = −0.09</p>
              <p className="text-purple-300">mm/s</p>
              <p className="text-purple-400 mt-1">izomer siljish</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">ΔE<sub>Q</sub> = 0.00</p>
              <p className="text-purple-300">mm/s</p>
              <p className="text-purple-400 mt-1">kvadrupol</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">Singlet</p>
              <p className="text-purple-300">1 cho'qqi</p>
              <p className="text-purple-400 mt-1">spektr turi</p>
            </div>
          </div>
        </div>

        {/* SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <MossbauerSpectrum />
        </div>

        {/* δ va ΔE_Q TAHLILI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <DeltaAnalysis />
        </div>

        {/* Fe⁰ vs Fe²⁺ vs Fe³⁺ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <FeOxidlanishSolishtirish />
        </div>

        {/* TRIGONAL BIPYRAMIDAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TrigonalBipyramidal />
        </div>

        {/* HARORAT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TemperatureEffect />
        </div>

        {/* TARIX */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TarixiyKontekst />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-amber-600/10 to-purple-600/10 border border-amber-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Fe(CO)₅] — <strong className="text-amber-400">Fe⁰</strong> (d⁸, 18e⁻, S=0)</li>
            <li>δ = <strong>−0.09 mm/s</strong> — nol oksidlanish, kuchli π-back-bonding</li>
            <li>ΔE<sub>Q</sub> = <strong>0.00 mm/s</strong> — trigonal bipyramidal simmetriya</li>
            <li>Spektr — <strong>singlet</strong> (1 cho'qqi)</li>
            <li>H = 0 — diamagnit, magnit tartib yo'q</li>
            <li>Fe²⁺ (δ=1.20) va Fe³⁺ (δ=0.40) dan <strong>sezilarli farqli</strong></li>
            <li>CO — kuchli π-akseptor → π-back-bonding → s-elektron zichligi yuqori</li>
            <li>D₃h simmetriya — yuqori simmetriya → EFG = 0</li>
            <li><strong>18 elektron qoidasi</strong> bajariladi — barqaror kompleks</li>
            <li>Mössbauer — <strong>Fe⁰</strong> ni aniq tasdiqlaydi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar/fe-h2o6-3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Fe(H₂O)₆]³⁺
          </Link>
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar/fe3o4" className="px-6 py-3 bg-amber-600/80 rounded-xl hover:bg-amber-500 text-white font-semibold">
            Fe₃O₄ →
          </Link>
        </div>

      </section>
    </main>
  )
}