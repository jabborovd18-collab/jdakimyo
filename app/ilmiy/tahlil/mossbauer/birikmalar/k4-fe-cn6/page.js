"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. MÖSSBAUER SPEKTR SIMULYATORI (K₄[Fe(CN)₆] — SINGLET)
// ============================================================================
function MossbauerSpectrum() {
  const [delta, setDelta] = useState(-0.06)
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
      <h3 className="text-white font-semibold">📊 Mössbauer spektr simulyatori — K₄[Fe(CN)₆]</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 K₄[Fe(CN)₆] ning o'ziga xosligi:</p>
          <p className="text-purple-200 text-xs">
            Fe²⁺ (LS, t₂g⁶) — <strong>nol kvadrupol bo'linishi</strong> (ΔE<sub>Q</sub> = 0.00 mm/s).
            Sababi: t₂g⁶ konfiguratsiya <strong>to'liq to'lgan</strong> va <strong>sferik simmetrik</strong>.
            Elektr maydon gradienti (EFG) = 0 → spektr <strong>singlet</strong> (bitta cho'qqi).
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
              <input type="range" min="-0.2" max="0.2" step="0.01" value={delta}
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
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-yellow-400 font-bold text-xs mb-1">⚠️ ΔE<sub>Q</sub> = 0.00</p>
              <p className="text-purple-200 text-[10px]">
                K₄[Fe(CN)₆] da kvadrupol bo'linishi <strong>yo'q</strong> — sferik simmetriya.
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
            <li><strong>Faqat 1 cho'qqi</strong> — ΔE<sub>Q</sub> = 0 (sferik simmetriya)</li>
            <li><strong>Harorat pastlashi</strong> → intensivlik oshadi</li>
            <li><strong>δ siljishi</strong> → cho'qqi o'ngga yoki chapga siljiydi</li>
            <li><strong>Γ kichik</strong> → cho'qqi tor, yuqori rezolyutsiya</li>
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
      <h3 className="text-white font-semibold">📐 δ va ΔE<sub>Q</sub> tahlili — nima uchun singlet?</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-teal-900/20 border border-teal-500/30 rounded-xl p-5">
            <h4 className="text-teal-400 font-bold mb-3">δ = −0.06 mm/s — nima anglatadi?</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>Fe²⁺</strong> — past oksidlanish (Fe³⁺ dan farqli)</li>
              <li>✓ <strong>LS holat</strong> — t₂g⁶, s-elektron zichligi yuqori</li>
              <li>✓ <strong>Kuchli π-akseptor</strong> (CN⁻) → δ past</li>
              <li>✓ <strong>Kovalent bog'</strong> — Fe−C kuchli</li>
            </ul>
            <div className="mt-3 bg-purple-900/50 rounded p-2">
              <p className="text-purple-400 text-[10px]">Taqqoslash:</p>
              <p className="text-teal-400 text-xs font-mono">Fe²⁺ HS: δ ≈ 1.2 mm/s</p>
              <p className="text-teal-400 text-xs font-mono">Fe²⁺ LS: δ ≈ 0.0 mm/s ← K₄[Fe(CN)₆]</p>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-5">
            <h4 className="text-yellow-400 font-bold mb-3">ΔE<sub>Q</sub> = 0.00 mm/s — nima anglatadi?</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>Nol EFG</strong> — sferik simmetriya</li>
              <li>✓ <strong>t₂g⁶ to'liq to'lgan</strong> — asimmetriya yo'q</li>
              <li>✓ <strong>¹A₁g ground state</strong> — sferik</li>
              <li>✓ <strong>Oktaedrik simmetriya</strong> — ideal</li>
            </ul>
            <div className="mt-3 bg-purple-900/50 rounded p-2">
              <p className="text-purple-400 text-[10px]">Taqqoslash:</p>
              <p className="text-yellow-400 text-xs font-mono">Fe²⁺ HS: ΔE<sub>Q</sub> ≈ 3.0 mm/s</p>
              <p className="text-yellow-400 text-xs font-mono">Fe²⁺ LS: ΔE<sub>Q</sub> = 0.0 mm/s ← K₄[Fe(CN)₆]</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-teal-400 font-bold text-xs mb-2">Elektron konfiguratsiya va EFG:</h5>
          <div className="font-mono text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-purple-300">t₂g orbitallar:</span>
              <div className="flex gap-2">
                <span className="text-yellow-400">↑↓</span>
                <span className="text-yellow-400">↑↓</span>
                <span className="text-yellow-400">↑↓</span>
              </div>
              <span className="text-emerald-400 font-bold">6 e⁻ (to'liq)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-300">e<sub>g</sub> orbitallar:</span>
              <div className="flex gap-2">
                <span className="text-purple-500">__</span>
                <span className="text-purple-500">__</span>
              </div>
              <span className="text-purple-400">0 e⁻</span>
            </div>
            <p className="text-purple-400 text-[10px] mt-2">
              t₂g⁶ → barcha elektronlar juft → sferik simmetriya → EFG = 0 → ΔE<sub>Q</sub> = 0
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun ΔE<sub>Q</sub> = 0?</p>
          <p className="text-purple-200">
            <strong>t₂g⁶</strong> konfiguratsiyada barcha 6 ta elektron juftlashgan.
            Elektron zichligi <strong>sferik simmetrik</strong> — hech qanday asimmetriya yo'q.
            Elektr maydon gradienti (EFG) = 0 → kvadrupol bo'linishi = 0 → <strong>singlet</strong>.
            <br/>
            Bu <strong>¹A₁g ground state</strong> ning belgisi — oktaedrik kompleks uchun ideal holat.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. K₄ vs K₃ SOLISHTIRISH
// ============================================================================
function K4vsK3() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 K₄[Fe(CN)₆] vs K₃[Fe(CN)₆] — Mössbauer solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-yellow-400">K₄[Fe(CN)₆]</th>
                <th className="text-center py-3 px-2 text-red-400">K₃[Fe(CN)₆]</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Fe oksidlanish", "+2", "+3"],
                ["Elektron konfiguratsiya", "d⁶ (t₂g⁶)", "d⁵ (t₂g⁵)"],
                ["Spin holati", "LS (S=0)", "LS (S=1/2)"],
                ["Toq elektronlar", "0", "1"],
                ["Magnit holat", "Diamagnit", "Paramagnit"],
                ["δ (mm/s)", "−0.06", "−0.12"],
                ["ΔE_Q (mm/s)", "0.00", "0.38"],
                ["H (Tesla)", "0", "0"],
                ["Spektr turi", "Singlet (1 cho'qqi)", "Dublet (2 cho'qqi)"],
                ["Ground state", "¹A₁g (sferik)", "²T₂g"],
                ["Rang", "Sariq", "To'q qizil"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-yellow-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-red-400">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-teal-600/10 border border-teal-500/30 rounded-lg p-3 text-xs">
          <p className="text-teal-400 font-bold mb-1">💡 Asosiy farq:</p>
          <p className="text-purple-200">
            <strong>K₄[Fe(CN)₆]</strong> — Fe²⁺ (t₂g⁶) → sferik simmetriya → EFG = 0 → <strong>singlet</strong>.
            <br/>
            <strong>K₃[Fe(CN)₆]</strong> — Fe³⁺ (t₂g⁵) → bitta toq elektron → kichik EFG → <strong>dublet</strong>.
            <br/>
            δ qiymatlari deyarli bir xil (−0.06 vs −0.12) — ikkalasi ham LS, kuchli kovalent bog'.
            Farq atigi 0.06 mm/s — Fe²⁺ da s-elektron zichligi biroz yuqori.
          </p>
        </div>

        <div className="mt-4 bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-yellow-400 font-bold text-xs mb-2">Spektr vizual solishtirish:</h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-3 text-center">
              <svg viewBox="0 0 200 100" className="w-full h-24">
                <line x1="20" y1="80" x2="180" y2="80" stroke="#4c1d95" strokeWidth="1" />
                <polyline
                  points="20,80 50,80 70,75 85,40 95,20 105,40 120,75 140,80 180,80"
                  fill="none" stroke="#eab308" strokeWidth="2" />
                <text x="100" y="15" fill="#eab308" fontSize="9" textAnchor="middle" fontWeight="bold">
                  K₄[Fe(CN)₆] - Singlet
                </text>
              </svg>
              <p className="text-yellow-400 text-xs mt-1">1 cho'qqi</p>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 rounded p-3 text-center">
              <svg viewBox="0 0 200 100" className="w-full h-24">
                <line x1="20" y1="80" x2="180" y2="80" stroke="#4c1d95" strokeWidth="1" />
                <polyline
                  points="20,80 40,80 55,75 65,50 70,30 75,50 85,75 100,80 115,75 125,50 130,30 135,50 145,75 160,80 180,80"
                  fill="none" stroke="#ef4444" strokeWidth="2" />
                <text x="100" y="15" fill="#ef4444" fontSize="9" textAnchor="middle" fontWeight="bold">
                  K₃[Fe(CN)₆] - Dublet
                </text>
              </svg>
              <p className="text-red-400 text-xs mt-1">2 cho'qqi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. HARORATGA BOGLIQLIK
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
            K₄[Fe(CN)₆] uchun xona haroratida ham signal <strong>yetarli</strong> (f ≈ 0.74).
            Past haroratda (80 K) signal <strong>sezilarli kuchliroq</strong> bo'ladi (f ≈ 0.92).
            Diamagnit kompleks bo'lgani uchun magnit tartiblanish yo'q — harorat spektr shakliga ta'sir qilmaydi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. NIMA UCHUN SINGLET?
// ============================================================================
function NimaUchunSinglet() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔍 Nima uchun K₄[Fe(CN)₆] singlet, K₃[Fe(CN)₆] dublet?</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 Asosiy qoida:</p>
          <p className="text-purple-200 text-xs">
            Mössbauer spektri shakli <strong>elektron konfiguratsiyasining simmetriyasiga</strong> bog'liq.
            Sferik simmetriya → singlet. Asimmetriya → dublet yoki sekstet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-5">
            <h4 className="text-yellow-400 font-bold mb-3">K₄[Fe(CN)₆] — SINGLET</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ Fe²⁺ (d⁶) → <strong>t₂g⁶</strong></li>
              <li>✓ Barcha elektronlar <strong>juftlashgan</strong></li>
              <li>✓ Elektron zichligi <strong>sferik</strong></li>
              <li>✓ EFG = 0</li>
              <li>✓ ΔE<sub>Q</sub> = 0</li>
              <li>✓ <strong>Singlet</strong> (1 cho'qqi)</li>
            </ul>
            <div className="mt-3 bg-purple-900/50 rounded p-2 text-center">
              <p className="text-yellow-400 font-bold">¹A₁g ground state</p>
              <p className="text-purple-400 text-[10px]">Sferik simmetrik</p>
            </div>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-5">
            <h4 className="text-red-400 font-bold mb-3">K₃[Fe(CN)₆] — DUBLET</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ Fe³⁺ (d⁵) → <strong>t₂g⁵</strong></li>
              <li>✓ <strong>Bitta toq elektron</strong></li>
              <li>✓ Elektron zichligi <strong>asimmetrik</strong></li>
              <li>✓ EFG ≠ 0 (kichik)</li>
              <li>✓ ΔE<sub>Q</sub> = 0.38 mm/s</li>
              <li>✓ <strong>Dublet</strong> (2 cho'qqi)</li>
            </ul>
            <div className="mt-3 bg-purple-900/50 rounded p-2 text-center">
              <p className="text-red-400 font-bold">²T₂g ground state</p>
              <p className="text-purple-400 text-[10px]">Kichik asimmetriya</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-teal-400 font-bold text-xs mb-2">Umumiy qoida:</h5>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between bg-purple-900/50 rounded p-2">
              <span className="text-purple-300">d⁰, d⁶ LS, d¹⁰:</span>
              <span className="text-emerald-400 font-bold">Singlet (sferik)</span>
            </div>
            <div className="flex justify-between bg-purple-900/50 rounded p-2">
              <span className="text-purple-300">d¹, d⁵ LS, d⁷ LS:</span>
              <span className="text-yellow-400 font-bold">Dublet (kichik EFG)</span>
            </div>
            <div className="flex justify-between bg-purple-900/50 rounded p-2">
              <span className="text-purple-300">d⁴ HS, d⁶ HS:</span>
              <span className="text-orange-400 font-bold">Dublet (katta EFG)</span>
            </div>
            <div className="flex justify-between bg-purple-900/50 rounded p-2">
              <span className="text-purple-300">Magnit tartiblangan:</span>
              <span className="text-red-400 font-bold">Sekstet (H ≠ 0)</span>
            </div>
          </div>
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
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — K₄[Fe(CN)₆] va Mössbauer</h3>

      <div className="bg-gradient-to-br from-yellow-900/30 to-purple-900/30 rounded-xl p-5 border border-yellow-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">1704 — Birinchi sintez</p>
                <p className="text-purple-200 text-xs mt-1">
                  K₄[Fe(CN)₆] <strong>Prussian Blue</strong> dan olingan.
                  "Sariq qon tuzi" deb nomlangan — K₃[Fe(CN)₆] dan farqli o'laroq.
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
                  K₄[Fe(CN)₆] — <strong>singlet spektrning klassik namunasi</strong>.
                  Fe²⁺ LS ning sferik simmetriyasi aniq ko'rsatilgan.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1970-80 — Koordinatsion kimyo</p>
                <p className="text-purple-200 text-xs mt-1">
                  K₄[Fe(CN)₆] — <strong>diamagnit kompleksning standarti</strong>.
                  NMR, UV-Vis, Mössbauer — barcha usullar bilan o'rganilgan.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 K₄[Fe(CN)₆] ning ahamiyati:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Klassik LS Fe²⁺</strong> namunasi — Mössbauer singlet</li>
            <li><strong>Elektrokimyoviy standart</strong> — [Fe(CN)₆]³⁻/⁴⁻ jufti</li>
            <li><strong>Diamagnit standart</strong> — NMR, magnit tadqiqotlar</li>
            <li><strong>Sferik simmetriya</strong> — ¹A₁g ground state</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function K4FeCN6Mossbauer() {
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
          <span className="text-yellow-400">K₄[Fe(CN)₆]</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">⚛️ K₄[Fe(CN)₆] — Mössbauer tahlili</h1>
          <p className="text-purple-400 text-sm">
            Fe²⁺ (LS, d⁶) • δ = −0.06 mm/s • ΔE<sub>Q</sub> = 0.00 mm/s • Singlet • Diamagnit
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-yellow-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-yellow-400">K₄[Fe(CN)₆]</span>
            <div>
              <h2 className="text-xl font-bold text-white">Mössbauer tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Sariq qon tuzi" — Fe²⁺ LS klassikasi</p>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              K₄[Fe(CN)₆] — <strong className="text-yellow-400">Fe²⁺ (LS, t₂g⁶)</strong> ning klassik namunasi.
              Kuchli maydon ligandlari (CN⁻) tufayli <strong>quyi spinli (LS)</strong> holat.
              Mössbauer spektri — <strong>singlet</strong> (δ = −0.06 mm/s, ΔE<sub>Q</sub> = 0.00 mm/s).
              δ past — yuqori kovalentlik. ΔE<sub>Q</sub> = 0 — <strong>sferik simmetriya</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-yellow-400 font-bold text-lg">Fe²⁺ (LS)</p>
              <p className="text-purple-300">d⁶, t₂g⁶</p>
              <p className="text-purple-400 mt-1">S = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-yellow-400 font-bold text-lg">δ = −0.06</p>
              <p className="text-purple-300">mm/s</p>
              <p className="text-purple-400 mt-1">izomer siljish</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-yellow-400 font-bold text-lg">ΔE<sub>Q</sub> = 0.00</p>
              <p className="text-purple-300">mm/s</p>
              <p className="text-purple-400 mt-1">kvadrupol</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-yellow-400 font-bold text-lg">Singlet</p>
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

        {/* K₄ vs K₃ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <K4vsK3 />
        </div>

        {/* NIMA UCHUN SINGLET */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <NimaUchunSinglet />
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
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>K₄[Fe(CN)₆] — <strong className="text-yellow-400">Fe²⁺ LS</strong> (t₂g⁶, S=0)</li>
            <li>δ = <strong>−0.06 mm/s</strong> — yuqori kovalentlik, kuchli π-akseptor</li>
            <li>ΔE<sub>Q</sub> = <strong>0.00 mm/s</strong> — sferik simmetriya, EFG = 0</li>
            <li>Spektr — <strong>singlet</strong> (1 cho'qqi)</li>
            <li>H = 0 — diamagnit, magnit tartib yo'q</li>
            <li>K₃[Fe(CN)₆] (Fe³⁺ LS) bilan solishtirganda — δ deyarli bir xil, ΔE<sub>Q</sub> farqli</li>
            <li>t₂g⁶ → barcha elektronlar juft → <strong>sferik simmetriya</strong></li>
            <li>¹A₁g ground state — oktaedrik kompleks uchun <strong>ideal holat</strong></li>
            <li>Mössbauer — <strong>Fe²⁺ LS</strong> ni aniq tasdiqlaydi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar/k3-fe-cn6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← K₃[Fe(CN)₆]
          </Link>
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar/fe-h2o6-2" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">
            [Fe(H₂O)₆]²⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}