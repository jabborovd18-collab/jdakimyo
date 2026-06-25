"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. MÖSSBAUER SPEKTR SIMULYATORI ([Fe(H₂O)₆]²⁺ — KATTA DUBLET)
// ============================================================================
function MossbauerSpectrum() {
  const [delta, setDelta] = useState(1.20)
  const [deltaQ, setDeltaQ] = useState(3.00)
  const [linewidth, setLinewidth] = useState(0.25)
  const [temperature, setTemperature] = useState(298)

  // Katta dublet — ikkita Lorentzian cho'qqi, orasi keng
  const spectrum = useMemo(() => {
    const points = []
    const vMin = -3
    const vMax = 5
    const steps = 500

    for (let i = 0; i <= steps; i++) {
      const v = vMin + (i / steps) * (vMax - vMin)
      
      // Katta dublet cho'qqilari (orasi ΔE_Q)
      const v1 = delta - deltaQ / 2
      const v2 = delta + deltaQ / 2
      const halfWidth = linewidth / 2
      
      const lorentz1 = 1 / (1 + Math.pow((v - v1) / halfWidth, 2))
      const lorentz2 = 1 / (1 + Math.pow((v - v2) / halfWidth, 2))
      
      // Harorat effekti (Lamb-Mössbauer faktor)
      const tempFactor = Math.min(1, 300 / temperature)
      const absorption = (lorentz1 + lorentz2) * 0.5 * tempFactor
      
      points.push({ v, y: absorption })
    }
    return points
  }, [delta, deltaQ, linewidth, temperature])

  const maxY = Math.max(...spectrum.map(p => p.y), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 Mössbauer spektr simulyatori — [Fe(H₂O)₆]²⁺</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-400 font-bold mb-2">💎 [Fe(H₂O)₆]²⁺ ning o'ziga xosligi:</p>
          <p className="text-purple-200 text-xs">
            Fe²⁺ (HS, t₂g⁴ e<sub>g</sub>²) — <strong>juda katta kvadrupol bo'linishi</strong> (ΔE<sub>Q</sub> ≈ 3.0 mm/s).
            Sababi: e<sub>g</sub> orbitalida bitta elektron → <strong>katta asimmetriya</strong> → katta EFG.
            Bu Fe²⁺ HS ning <strong>klassik namunasi</strong> — barcha darsliklarda keltiriladi.
          </p>
        </div>

        {/* SLIDERLAR */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">δ (izomer siljish):</span>
                <span className="text-teal-400 font-mono">{delta.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="0.5" max="2.0" step="0.01" value={delta}
                onChange={(e) => setDelta(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">ΔE<sub>Q</sub> (kvadrupol):</span>
                <span className="text-teal-400 font-mono">{deltaQ.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="0.5" max="4.0" step="0.05" value={deltaQ}
                onChange={(e) => setDeltaQ(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">Γ (chiziq kengligi):</span>
                <span className="text-teal-400 font-mono">{linewidth.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="0.15" max="0.6" step="0.01" value={linewidth}
                onChange={(e) => setLinewidth(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">Harorat (T):</span>
                <span className="text-teal-400 font-mono">{temperature} K</span>
              </label>
              <input type="range" min="80" max="400" step="5" value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
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
            <text x="380" y="195" fill="#a78bfa" fontSize="8" textAnchor="end">+5</text>
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

            {/* Cho'qqi belgilari */}
            <line x1={40 + ((delta - deltaQ/2 + 3) / 8) * 340} y1="30" x2={40 + ((delta - deltaQ/2 + 3) / 8) * 340} y2="170"
              stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((delta - deltaQ/2 + 3) / 8) * 340} y="25" fill="#fbbf24" fontSize="8" textAnchor="middle">
              {(delta - deltaQ/2).toFixed(2)}
            </text>

            <line x1={40 + ((delta + deltaQ/2 + 3) / 8) * 340} y1="30" x2={40 + ((delta + deltaQ/2 + 3) / 8) * 340} y2="170"
              stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((delta + deltaQ/2 + 3) / 8) * 340} y="25" fill="#fbbf24" fontSize="8" textAnchor="middle">
              {(delta + deltaQ/2).toFixed(2)}
            </text>

            {/* Markaz */}
            <line x1={40 + ((delta + 3) / 8) * 340} y1="35" x2={40 + ((delta + 3) / 8) * 340} y2="170"
              stroke="#ef4444" strokeWidth="0.5" strokeDasharray="1,1" />
            <text x={40 + ((delta + 3) / 8) * 340} y="30" fill="#ef4444" fontSize="8" textAnchor="middle">
              δ={delta.toFixed(2)}
            </text>

            {/* Katta dublet belgisi */}
            <text x="200" y="15" fill="#14b8a6" fontSize="10" textAnchor="middle" fontWeight="bold">
              KATTA DUBLET (ΔE_Q = {deltaQ.toFixed(2)} mm/s)
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
            <p className="text-white font-bold font-mono">{deltaQ.toFixed(2)} mm/s</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Spektr</p>
            <p className="text-teal-400 font-bold">Katta dublet</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Kuzatishlar:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>ΔE<sub>Q</sub> juda katta</strong> (~3 mm/s) — e<sub>g</sub> da elektron asimmetriyasi</li>
            <li><strong>δ yuqori</strong> (~1.2 mm/s) — Fe²⁺ past oksidlanish</li>
            <li><strong>Harorat pastlashi</strong> → intensivlik oshadi</li>
            <li><strong>K₄[Fe(CN)₆]</strong> (ΔE<sub>Q</sub>=0) dan <strong>10 marta katta</strong> farq!</li>
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
      <h3 className="text-white font-semibold">📐 δ va ΔE<sub>Q</sub> tahlili — nima uchun bunday katta?</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-teal-900/20 border border-teal-500/30 rounded-xl p-5">
            <h4 className="text-teal-400 font-bold mb-3">δ = 1.20 mm/s — nima anglatadi?</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>Fe²⁺</strong> — past oksidlanish darajasi</li>
              <li>✓ <strong>HS holat</strong> — t₂g⁴ e<sub>g</sub>², s-elektron zichligi past</li>
              <li>✓ <strong>Kuchsiz ligand</strong> (H₂O) — kovalentlik past</li>
              <li>✓ <strong>Ion bog'</strong> — Fe−O kuchsiz kovalent</li>
            </ul>
            <div className="mt-3 bg-purple-900/50 rounded p-2">
              <p className="text-purple-400 text-[10px]">Taqqoslash:</p>
              <p className="text-teal-400 text-xs font-mono">Fe²⁺ HS: δ ≈ 1.0-1.5 mm/s ← [Fe(H₂O)₆]²⁺</p>
              <p className="text-teal-400 text-xs font-mono">Fe²⁺ LS: δ ≈ 0.0-0.5 mm/s</p>
              <p className="text-teal-400 text-xs font-mono">Fe³⁺ HS: δ ≈ 0.3-0.6 mm/s</p>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-5">
            <h4 className="text-yellow-400 font-bold mb-3">ΔE<sub>Q</sub> = 3.00 mm/s — nima anglatadi?</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>Juda katta EFG</strong> — kuchli asimmetriya</li>
              <li>✓ <strong>t₂g⁴ e<sub>g</sub>²</strong> — e<sub>g</sub> da bitta elektron</li>
              <li>✓ <strong>Valentlik hissasi katta</strong> — e<sub>g</sub> asimmetriyasi</li>
              <li>✓ <strong>Oktaedrik geometriya</strong> — lekin elektron taqsimoti asimmetrik</li>
            </ul>
            <div className="mt-3 bg-purple-900/50 rounded p-2">
              <p className="text-purple-400 text-[10px]">Taqqoslash:</p>
              <p className="text-yellow-400 text-xs font-mono">Fe²⁺ HS: ΔE<sub>Q</sub> ≈ 2.0-3.5 mm/s ← [Fe(H₂O)₆]²⁺</p>
              <p className="text-yellow-400 text-xs font-mono">Fe²⁺ LS: ΔE<sub>Q</sub> ≈ 0.0-1.0 mm/s</p>
              <p className="text-yellow-400 text-xs font-mono">Fe³⁺ HS: ΔE<sub>Q</sub> ≈ 0.0-0.5 mm/s</p>
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
                <span className="text-yellow-400">↑</span>
                <span className="text-yellow-400">↑</span>
              </div>
              <span className="text-purple-400">4 e⁻</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-400">e<sub>g</sub> orbitallar:</span>
              <div className="flex gap-2">
                <span className="text-yellow-400">↑</span>
                <span className="text-purple-500">__</span>
              </div>
              <span className="text-red-400 font-bold">1 e⁻ (asimmetrik!)</span>
            </div>
            <p className="text-purple-400 text-[10px] mt-2">
              e<sub>g</sub> da bitta elektron → <strong>katta asimmetriya</strong> → katta EFG → katta ΔE<sub>Q</sub>
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun ΔE<sub>Q</sub> juda katta?</p>
          <p className="text-purple-200">
            <strong>t₂g⁴ e<sub>g</sub>²</strong> konfiguratsiyada e<sub>g</sub> orbitalida <strong>bitta elektron</strong> bor.
            e<sub>g</sub> orbitallari (d<sub>z²</sub>, d<sub>x²-y²</sub>) ligandlar tomon yo'nalgan →
            <strong> elektron zichligi kuchli asimmetrik</strong>.
            <br/>
            Bu <strong>valentlik hissasi</strong> deb ataladi va Fe²⁺ HS uchun xarakterli.
            Shuning uchun ΔE<sub>Q</sub> ≈ 3.0 mm/s — Fe²⁺ HS ning "barmoq izi".
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. Fe²⁺ HS vs LS SOLISHTIRISH
// ============================================================================
function HSvsLS() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Fe²⁺ HS vs LS — Mössbauer solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-green-400">[Fe(H₂O)₆]²⁺ (HS)</th>
                <th className="text-center py-3 px-2 text-yellow-400">K₄[Fe(CN)₆] (LS)</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Ligand", "H₂O (kuchsiz)", "CN⁻ (kuchli)"],
                ["Δ_o", "Kichik (< P)", "Katta (> P)"],
                ["Elektron konfiguratsiya", "t₂g⁴ eg²", "t₂g⁶"],
                ["Spin holati", "HS (S=2)", "LS (S=0)"],
                ["Toq elektronlar", "4", "0"],
                ["Magnit holat", "Paramagnit", "Diamagnit"],
                ["δ (mm/s)", "1.20", "−0.06"],
                ["ΔE_Q (mm/s)", "3.00", "0.00"],
                ["H (Tesla)", "0", "0"],
                ["Spektr turi", "Katta dublet", "Singlet"],
                ["Rang", "Och yashil", "Sariq"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-green-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-yellow-400">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-teal-600/10 border border-teal-500/30 rounded-lg p-3 text-xs">
          <p className="text-teal-400 font-bold mb-1">💡 Asosiy farq:</p>
          <p className="text-purple-200">
            <strong>[Fe(H₂O)₆]²⁺</strong> — Fe²⁺ HS (t₂g⁴ e<sub>g</sub>²) → katta asimmetriya → <strong>katta dublet</strong> (ΔE<sub>Q</sub> = 3.0).
            <br/>
            <strong>K₄[Fe(CN)₆]</strong> — Fe²⁺ LS (t₂g⁶) → sferik simmetriya → <strong>singlet</strong> (ΔE<sub>Q</sub> = 0.0).
            <br/>
            δ qiymatlari ham farqli: 1.20 vs −0.06 — Fe²⁺ HS da s-elektron zichligi past.
          </p>
        </div>

        <div className="mt-4 bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-green-400 font-bold text-xs mb-2">Spektr vizual solishtirish:</h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-900/20 border border-green-500/30 rounded p-3 text-center">
              <svg viewBox="0 0 200 100" className="w-full h-24">
                <line x1="20" y1="80" x2="180" y2="80" stroke="#4c1d95" strokeWidth="1" />
                <polyline
                  points="20,80 35,80 40,75 45,50 48,30 51,50 56,75 65,80 135,80 140,75 145,50 148,30 151,50 156,75 165,80 180,80"
                  fill="none" stroke="#22c55e" strokeWidth="2" />
                <text x="100" y="15" fill="#22c55e" fontSize="9" textAnchor="middle" fontWeight="bold">
                  [Fe(H₂O)₆]²⁺ - Katta dublet
                </text>
              </svg>
              <p className="text-green-400 text-xs mt-1">ΔE_Q = 3.0 mm/s</p>
            </div>
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
              <p className="text-yellow-400 text-xs mt-1">ΔE_Q = 0.0 mm/s</p>
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
            [Fe(H₂O)₆]²⁺ uchun past haroratda (80-100 K) spektr <strong>sezilarli kuchliroq</strong> bo'ladi.
            Paramagnit kompleks bo'lgani uchun past haroratda <strong>magnit tartiblanish</strong> sodir bo'lishi mumkin →
            sekstet ko'rinishi mumkin (lekin [Fe(H₂O)₆]²⁺ da T<sub>N</sub> juda past).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. TARIXIY KONTEKST
// ============================================================================
function TarixiyKontekst() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — [Fe(H₂O)₆]²⁺ va Mössbauer</h3>

      <div className="bg-gradient-to-br from-green-900/30 to-purple-900/30 rounded-xl p-5 border border-green-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">Qadim zamon — Temir vitriol</p>
                <p className="text-purple-200 text-xs mt-1">
                  FeSO₄·7H₂O ("temir vitriol") qadimdan ma'lum.
                  [Fe(H₂O)₆]²⁺ — suvli eritmalardagi eng oddiy Fe²⁺ kompleksi.
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
                  [Fe(H₂O)₆]²⁺ — <strong>Fe²⁺ HS ning klassik namunasi</strong>.
                  Katta dublet (ΔE<sub>Q</sub> ≈ 3.0 mm/s) barcha darsliklarda keltiriladi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1970-80 — Bioanorganik kimyo</p>
                <p className="text-purple-200 text-xs mt-1">
                  [Fe(H₂O)₆]²⁺ — <strong>biologik sistemalardagi Fe²⁺</strong> uchun model.
                  Gemoglobin, ferredoksin — barchasida Fe²⁺ HS mavjud.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 [Fe(H₂O)₆]²⁺ ning ahamiyati:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Klassik Fe²⁺ HS</strong> namunasi — Mössbauer, EPR, UV-Vis</li>
            <li><strong>Katta dublet</strong> — Fe²⁺ HS ning "barmoq izi"</li>
            <li><strong>Biologik model</strong> — gemoglobin, ferredoksin</li>
            <li><strong>Suv kimyosi</strong> — Fe²⁺ gidratlanishi</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function FeH2O62Mossbauer() {
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
          <span className="text-green-400">[Fe(H₂O)₆]²⁺</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-green-400">⚛️ [Fe(H₂O)₆]²⁺ — Mössbauer tahlili</h1>
          <p className="text-purple-400 text-sm">
            Fe²⁺ (HS, d⁶) • δ = 1.20 mm/s • ΔE<sub>Q</sub> = 3.00 mm/s • Katta dublet • Paramagnit
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-green-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-green-400">[Fe(H₂O)₆]²⁺</span>
            <div>
              <h2 className="text-xl font-bold text-white">Mössbauer tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Geksaakvatemir(II)" — Fe²⁺ HS klassikasi</p>
            </div>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Fe(H₂O)₆]²⁺ — <strong className="text-green-400">Fe²⁺ (HS, t₂g⁴ e<sub>g</sub>²)</strong> ning klassik namunasi.
              Kuchsiz maydon ligandlari (H₂O) tufayli <strong>yuqori spinli (HS)</strong> holat.
              Mössbauer spektri — <strong>katta dublet</strong> (δ = 1.20 mm/s, ΔE<sub>Q</sub> = 3.00 mm/s).
              δ yuqori — past oksidlanish. ΔE<sub>Q</sub> juda katta — e<sub>g</sub> da elektron asimmetriyasi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">Fe²⁺ (HS)</p>
              <p className="text-purple-300">d⁶, t₂g⁴ e<sub>g</sub>²</p>
              <p className="text-purple-400 mt-1">S = 2</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">δ = 1.20</p>
              <p className="text-purple-300">mm/s</p>
              <p className="text-purple-400 mt-1">izomer siljish</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">ΔE<sub>Q</sub> = 3.00</p>
              <p className="text-purple-300">mm/s</p>
              <p className="text-purple-400 mt-1">kvadrupol</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">Katta dublet</p>
              <p className="text-purple-300">2 cho'qqi</p>
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

        {/* Fe²⁺ HS vs LS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <HSvsLS />
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
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Fe(H₂O)₆]²⁺ — <strong className="text-green-400">Fe²⁺ HS</strong> (t₂g⁴ e<sub>g</sub>², S=2)</li>
            <li>δ = <strong>1.20 mm/s</strong> — past oksidlanish, kuchsiz kovalentlik</li>
            <li>ΔE<sub>Q</sub> = <strong>3.00 mm/s</strong> — juda katta, e<sub>g</sub> da elektron asimmetriyasi</li>
            <li>Spektr — <strong>katta dublet</strong> (2 cho'qqi, orasi keng)</li>
            <li>H = 0 — paramagnit, xona haroratida magnit tartib yo'q</li>
            <li>K₄[Fe(CN)₆] (Fe²⁺ LS) bilan solishtirganda — δ 15 marta, ΔE<sub>Q</sub> cheksiz marta farqli</li>
            <li>t₂g⁴ e<sub>g</sub>² → e<sub>g</sub> da bitta elektron → <strong>katta asimmetriya</strong></li>
            <li>Fe²⁺ HS ning <strong>"barmoq izi"</strong> — barcha darsliklarda keltiriladi</li>
            <li>Mössbauer — <strong>Fe²⁺ HS</strong> ni aniq tasdiqlaydi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar/k4-fe-cn6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← K₄[Fe(CN)₆]
          </Link>
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar/fe-h2o6-3" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">
            [Fe(H₂O)₆]³⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}