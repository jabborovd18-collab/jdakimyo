"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. MÖSSBAUER SPEKTR SIMULYATORI (K₃[Fe(CN)₆] uchun)
// ============================================================================
function MossbauerSpectrum() {
  const [delta, setDelta] = useState(-0.12)
  const [deltaQ, setDeltaQ] = useState(0.38)
  const [linewidth, setLinewidth] = useState(0.25)
  const [temperature, setTemperature] = useState(298)

  // Dublet — ikkita Lorentzian cho'qqi
  const spectrum = useMemo(() => {
    const points = []
    const vMin = -3
    const vMax = 3
    const steps = 400

    for (let i = 0; i <= steps; i++) {
      const v = vMin + (i / steps) * (vMax - vMin)
      
      // Dublet cho'qqilari
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
      <h3 className="text-white font-semibold">📊 Mössbauer spektr simulyatori — K₃[Fe(CN)₆]</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-lg p-4">
          <p className="text-teal-400 font-bold mb-2">💎 K₃[Fe(CN)₆] ning o'ziga xosligi:</p>
          <p className="text-purple-200 text-xs">
            Fe³⁺ (LS, t₂g⁵) — <strong>kichik kvadrupol bo'linishi</strong> (ΔE<sub>Q</sub> = 0.38 mm/s).
            Sababi: t₂g⁵ konfiguratsiya deyarli <strong>sferik simmetrik</strong> (bitta toq elektron t₂g da).
            Izomer siljish <strong>δ = −0.12 mm/s</strong> — Fe³⁺ LS uchun xarakterli.
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
              <input type="range" min="-0.3" max="0.3" step="0.01" value={delta}
                onChange={(e) => setDelta(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">ΔE<sub>Q</sub> (kvadrupol):</span>
                <span className="text-teal-400 font-mono">{deltaQ.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="0" max="1.5" step="0.01" value={deltaQ}
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

            {/* Cho'qqi belgilari */}
            <line x1={40 + ((delta - deltaQ/2 + 3) / 6) * 340} y1="30" x2={40 + ((delta - deltaQ/2 + 3) / 6) * 340} y2="170"
              stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((delta - deltaQ/2 + 3) / 6) * 340} y="25" fill="#fbbf24" fontSize="8" textAnchor="middle">
              {(delta - deltaQ/2).toFixed(2)}
            </text>

            <line x1={40 + ((delta + deltaQ/2 + 3) / 6) * 340} y1="30" x2={40 + ((delta + deltaQ/2 + 3) / 6) * 340} y2="170"
              stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((delta + deltaQ/2 + 3) / 6) * 340} y="25" fill="#fbbf24" fontSize="8" textAnchor="middle">
              {(delta + deltaQ/2).toFixed(2)}
            </text>

            {/* Markaz */}
            <line x1={40 + ((delta + 3) / 6) * 340} y1="35" x2={40 + ((delta + 3) / 6) * 340} y2="170"
              stroke="#ef4444" strokeWidth="0.5" strokeDasharray="1,1" />
            <text x={40 + ((delta + 3) / 6) * 340} y="30" fill="#ef4444" fontSize="8" textAnchor="middle">
              δ={delta.toFixed(2)}
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
            <p className="text-teal-400 font-bold">Dublet</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Kuzatishlar:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Harorat pastlashi</strong> → intensivlik oshadi (Lamb-Mössbauer faktor)</li>
            <li><strong>ΔE<sub>Q</sub> oshsa</strong> → ikki cho'qqi orasi kengayadi</li>
            <li><strong>δ siljishi</strong> → ikkala cho'qqi birga siljiydi</li>
            <li><strong>Γ kichik</strong> → yuqori rezolyutsiya, aniq cho'qqilar</li>
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
            <h4 className="text-teal-400 font-bold mb-3">δ = −0.12 mm/s — nima anglatadi?</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>Fe³⁺</strong> — yuqori oksidlanish darajasi</li>
              <li>✓ <strong>LS holat</strong> — t₂g⁵, s-elektron zichligi yuqori</li>
              <li>✓ <strong>Kuchli π-akseptor</strong> (CN⁻) — s-elektronlar metalldan tortiladi</li>
              <li>✓ <strong>Kovalent bog'</strong> — Fe−C kuchli kovalent</li>
            </ul>
            <div className="mt-3 bg-purple-900/50 rounded p-2">
              <p className="text-purple-400 text-[10px]">Taqqoslash:</p>
              <p className="text-teal-400 text-xs font-mono">Fe³⁺ HS: δ ≈ 0.4 mm/s</p>
              <p className="text-teal-400 text-xs font-mono">Fe³⁺ LS: δ ≈ 0.0 mm/s ← K₃[Fe(CN)₆]</p>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-5">
            <h4 className="text-yellow-400 font-bold mb-3">ΔE<sub>Q</sub> = 0.38 mm/s — nima anglatadi?</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>Kichik ΔE<sub>Q</sub></strong> — deyarli sferik simmetriya</li>
              <li>✓ <strong>t₂g⁵ konfiguratsiya</strong> — bitta toq elektron</li>
              <li>✓ <strong>Valentlik hissasi kichik</strong> — asimmetriya kam</li>
              <li>✓ <strong>Oktaedrik simmetriya</strong> — EFG kichik</li>
            </ul>
            <div className="mt-3 bg-purple-900/50 rounded p-2">
              <p className="text-purple-400 text-[10px]">Taqqoslash:</p>
              <p className="text-yellow-400 text-xs font-mono">Fe²⁺ HS: ΔE<sub>Q</sub> ≈ 3.0 mm/s</p>
              <p className="text-yellow-400 text-xs font-mono">Fe³⁺ LS: ΔE<sub>Q</sub> ≈ 0.4 mm/s ← K₃[Fe(CN)₆]</p>
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
                <span className="text-yellow-400">↑</span>
              </div>
              <span className="text-purple-400">5 e⁻</span>
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
              t₂g⁵ → bitta toq elektron → kichik EFG → kichik ΔE<sub>Q</sub>
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun ΔE<sub>Q</sub> kichik?</p>
          <p className="text-purple-200">
            <strong>t₂g⁵</strong> konfiguratsiyada bitta toq elektron bor, lekin u <strong>t₂g orbitallarida</strong> joylashgan.
            t₂g orbitallari ligandlar orasida joylashgan → <strong>elektron zichligi deyarli sferik</strong>.
            Shuning uchun elektr maydon gradienti (EFG) kichik → ΔE<sub>Q</sub> kichik.
            <br/>
            <strong>Fe²⁺ HS</strong> (t₂g⁴ e<sub>g</sub>²) da esa e<sub>g</sub> da elektron bor → katta asimmetriya → katta ΔE<sub>Q</sub>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. K₃ vs K₄ SOLISHTIRISH
// ============================================================================
function K3vsK4() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 K₃[Fe(CN)₆] vs K₄[Fe(CN)₆] — Mössbauer solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-red-400">K₃[Fe(CN)₆]</th>
                <th className="text-center py-3 px-2 text-yellow-400">K₄[Fe(CN)₆]</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Fe oksidlanish", "+3", "+2"],
                ["Elektron konfiguratsiya", "d⁵ (t₂g⁵)", "d⁶ (t₂g⁶)"],
                ["Spin holati", "LS (S=1/2)", "LS (S=0)"],
                ["Toq elektronlar", "1", "0"],
                ["Magnit holat", "Paramagnit", "Diamagnit"],
                ["δ (mm/s)", "−0.12", "−0.06"],
                ["ΔE_Q (mm/s)", "0.38", "0.00"],
                ["H (Tesla)", "0", "0"],
                ["Spektr turi", "Dublet", "Singlet"],
                ["Rang", "To'q qizil", "Sariq"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-red-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-yellow-400">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-teal-600/10 border border-teal-500/30 rounded-lg p-3 text-xs">
          <p className="text-teal-400 font-bold mb-1">💡 Farq nima uchun?</p>
          <p className="text-purple-200">
            <strong>K₃[Fe(CN)₆]</strong> — Fe³⁺ (t₂g⁵) → bitta toq elektron → kichik EFG → <strong>dublet</strong>.
            <br/>
            <strong>K₄[Fe(CN)₆]</strong> — Fe²⁺ (t₂g⁶) → barcha elektronlar juft → sferik simmetriya → EFG = 0 → <strong>singlet</strong>.
            <br/>
            δ qiymatlari deyarli bir xil (−0.12 vs −0.06) — ikkalasi ham LS, kuchli kovalent bog'.
          </p>
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
            <strong>Past haroratda</strong> (80-100 K) Mössbauer spektri <strong>sezilarli kuchliroq</strong> bo'ladi.
            Sababi: atom tebranishlari kamayadi → recoil-free fraksiya (f) oshadi → signal kuchli.
            K₃[Fe(CN)₆] uchun xona haroratida ham signal yetarli (f ≈ 0.7).
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
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — K₃[Fe(CN)₆] va Mössbauer</h3>

      <div className="bg-gradient-to-br from-teal-900/30 to-purple-900/30 rounded-xl p-5 border border-teal-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">1822 — Leopold Gmelin</p>
                <p className="text-purple-200 text-xs mt-1">
                  K₃[Fe(CN)₆] birinchi marta sintez qilingan. "Qizil qon tuzi" deb nomlangan —
                  hayvon qonidan olingan temir bilan bog'liq.
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
                  K₃[Fe(CN)₆] va K₄[Fe(CN)₆] — <strong>Mössbauer spektroskopiyasining klassik namunalari</strong>.
                  Fe³⁺ LS va Fe²⁺ LS ning spektrlari aniq farqlangan.
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
                  K₃[Fe(CN)₆] — <strong>koordinatsion kimyoning "ishchi oti"</strong>.
                  LS Fe³⁺ ning elektron strukturasi, spin-orbital coupling, kovalent bog'lanish o'rganilgan.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 K₃[Fe(CN)₆] ning ahamiyati:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Klassik LS Fe³⁺</strong> namunasi — Mössbauer, EPR, UV-Vis</li>
            <li><strong>Elektrokimyoviy standart</strong> — [Fe(CN)₆]³⁻/⁴⁻ jufti</li>
            <li><strong>Kuchli π-akseptor</strong> ligand (CN⁻) ta'sirini o'rganish</li>
            <li><strong>Kovalent bog'lanish</strong> darajasini baholash</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function K3FeCN6Mossbauer() {
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
          <span className="text-red-400">K₃[Fe(CN)₆]</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-red-400">⚛️ K₃[Fe(CN)₆] — Mössbauer tahlili</h1>
          <p className="text-purple-400 text-sm">
            Fe³⁺ (LS, d⁵) • δ = −0.12 mm/s • ΔE<sub>Q</sub> = 0.38 mm/s • Dublet • Paramagnit
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-red-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-red-400">K₃[Fe(CN)₆]</span>
            <div>
              <h2 className="text-xl font-bold text-white">Mössbauer tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Qizil qon tuzi" — Fe³⁺ LS klassikasi</p>
            </div>
          </div>

          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              K₃[Fe(CN)₆] — <strong className="text-red-400">Fe³⁺ (LS, t₂g⁵)</strong> ning klassik namunasi.
              Kuchli maydon ligandlari (CN⁻) tufayli <strong>quyi spinli (LS)</strong> holat.
              Mössbauer spektri — <strong>dublet</strong> (δ = −0.12 mm/s, ΔE<sub>Q</sub> = 0.38 mm/s).
              δ past — yuqori oksidlanish va kuchli kovalent bog'. ΔE<sub>Q</sub> kichik — deyarli sferik simmetriya.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">Fe³⁺ (LS)</p>
              <p className="text-purple-300">d⁵, t₂g⁵</p>
              <p className="text-purple-400 mt-1">S = 1/2</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">δ = −0.12</p>
              <p className="text-purple-300">mm/s</p>
              <p className="text-purple-400 mt-1">izomer siljish</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">ΔE<sub>Q</sub> = 0.38</p>
              <p className="text-purple-300">mm/s</p>
              <p className="text-purple-400 mt-1">kvadrupol</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">Dublet</p>
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

        {/* K₃ vs K₄ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <K3vsK4 />
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
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>K₃[Fe(CN)₆] — <strong className="text-red-400">Fe³⁺ LS</strong> (t₂g⁵, S=1/2)</li>
            <li>δ = <strong>−0.12 mm/s</strong> — yuqori oksidlanish, kuchli kovalent bog'</li>
            <li>ΔE<sub>Q</sub> = <strong>0.38 mm/s</strong> — kichik, deyarli sferik simmetriya</li>
            <li>Spektr — <strong>dublet</strong> (2 cho'qqi)</li>
            <li>H = 0 — paramagnit, xona haroratida magnit tartib yo'q</li>
            <li>K₄[Fe(CN)₆] (Fe²⁺ LS) bilan solishtirganda — δ deyarli bir xil, ΔE<sub>Q</sub> farqli</li>
            <li>Past haroratda (80 K) signal <strong>kuchliroq</strong> (Lamb-Mössbauer faktor)</li>
            <li>Mössbauer — <strong>Fe³⁺ LS</strong> ni aniq tasdiqlaydi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← Mössbauer birikmalar
          </Link>
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar/k4-fe-cn6" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">
            K₄[Fe(CN)₆] →
          </Link>
        </div>

      </section>
    </main>
  )
}