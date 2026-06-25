"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. MÖSSBAUER SPEKTR SIMULYATORI
// ============================================================================
function MossbauerSpectrumSimulator() {
  const [delta, setDelta] = useState(0.8) // mm/s
  const [deltaQ, setDeltaQ] = useState(0) // mm/s
  const [H, setH] = useState(0) // Tesla
  const [linewidth, setLinewidth] = useState(0.3) // mm/s
  const [spectrumType, setSpectrumType] = useState("absorption") // absorption or transmission

  // Spektrogramma nuqtalari
  const spectrum = useMemo(() => {
    const points = []
    const vMin = -10
    const vMax = 10
    const steps = 400

    for (let i = 0; i <= steps; i++) {
      const v = vMin + (i / steps) * (vMax - vMin)
      let absorption = 0

      // Dublet pozitsiyalari
      const positions = deltaQ > 0.05 
        ? [delta - deltaQ / 2, delta + deltaQ / 2] 
        : [delta, delta]

      // Sekstet pozitsiyalari (soddalashtirilgan)
      const sextetPositions = H > 0.1
        ? [
            delta - 1.5 * H * 0.08 + deltaQ / 6,
            delta - 0.5 * H * 0.08 - deltaQ / 6,
            delta + 0.5 * H * 0.08 - deltaQ / 6,
            delta + 1.5 * H * 0.08 + deltaQ / 6,
            delta - 1.0 * H * 0.08 - deltaQ / 3,
            delta + 1.0 * H * 0.08 + deltaQ / 3
          ]
        : positions

      const intensities = H > 0.1 ? [3, 2, 1, 1, 2, 3] : [1, 1]

      // Lorentzian chiziqlar
      for (let j = 0; j < sextetPositions.length; j++) {
        const x0 = sextetPositions[j]
        const amp = intensities[j]
        const halfWidth = linewidth / 2
        const lorentzian = amp / (1 + Math.pow((v - x0) / halfWidth, 2))
        absorption += lorentzian
      }

      // Normalizatsiya
      absorption = Math.min(1, absorption / 4)

      points.push({
        v,
        y: spectrumType === "absorption" ? absorption : 100 - absorption * 85
      })
    }
    return points
  }, [delta, deltaQ, H, linewidth, spectrumType])

  const maxY = spectrumType === "absorption" 
    ? Math.max(...spectrum.map(p => p.y), 0.1)
    : 100

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 Mössbauer spektr simulyatori</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 Noyob rezonans effekti:</p>
          <p className="text-purple-200 text-xs">
            Mössbauer effekti — <strong>qaytishsiz gamma-nurlanish rezonans yutilishi</strong>.
            Doppler effekti orqali manba tezligi o'zgartiriladi (±10 mm/s), 
            namuna esa <strong>14.4 keV</strong> energiyada rezonans yutadi.
          </p>
        </div>

        {/* Boshqaruv elementlari */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">δ (izomer siljish):</span>
                <span className="text-teal-400 font-mono">{delta.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="-0.2" max="1.6" step="0.01" value={delta}
                onChange={(e) => setDelta(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">ΔE<sub>Q</sub> (kvadrupol):</span>
                <span className="text-teal-400 font-mono">{deltaQ.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="0" max="4" step="0.05" value={deltaQ}
                onChange={(e) => setDeltaQ(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">H (magnit maydon):</span>
                <span className="text-teal-400 font-mono">{H.toFixed(1)} T</span>
              </label>
              <input type="range" min="0" max="55" step="0.5" value={H}
                onChange={(e) => setH(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">Γ (chiziq kengligi):</span>
                <span className="text-teal-400 font-mono">{linewidth.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="0.15" max="0.8" step="0.01" value={linewidth}
                onChange={(e) => setLinewidth(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
          </div>
        </div>

        {/* Spektr ko'rinishi */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-teal-400 font-bold text-xs">
              {spectrumType === "absorption" ? "Yutilish spektri" : "Transmissiya spektri"}
            </h5>
            <button onClick={() => setSpectrumType(spectrumType === "absorption" ? "transmission" : "absorption")}
              className="text-xs px-3 py-1 bg-purple-800 hover:bg-purple-700 rounded transition-colors">
              {spectrumType === "absorption" ? "→ Transmissiya" : "→ Yutilish"}
            </button>
          </div>
          
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="100" x2="380" y2="100" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="40" y1="20" x2="40" y2="180" stroke="#4c1d95" strokeWidth="1" />
            <line x1="380" y1="20" x2="380" y2="180" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">v (mm/s)</text>
            <text x="40" y="195" fill="#a78bfa" fontSize="8">-10</text>
            <text x="380" y="195" fill="#a78bfa" fontSize="8" textAnchor="end">+10</text>
            <text x="20" y="100" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 100)">
              {spectrumType === "absorption" ? "A" : "T (%)"}
            </text>

            {/* Spektr chizig'i */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / spectrum.length) * 340
                const y = spectrumType === "absorption" 
                  ? 100 - (p.y / maxY) * 70
                  : 100 - ((p.y - 15) / 85) * 70
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#14b8a6" strokeWidth="2"
            />

            {/* Markaz (δ) */}
            <line x1={40 + ((delta + 10) / 20) * 340} y1="20" x2={40 + ((delta + 10) / 20) * 340} y2="180"
              stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((delta + 10) / 20) * 340} y="15" fill="#fbbf24" fontSize="8" textAnchor="middle">
              δ={delta.toFixed(2)}
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className={`rounded p-2 ${deltaQ < 0.1 ? 'bg-lime-600/30 border border-lime-500/50' : 'bg-purple-900/50'}`}>
            <p className="text-purple-400">Singlet</p>
            <p className="text-teal-400 font-bold">1 cho'qqi</p>
          </div>
          <div className={`rounded p-2 ${deltaQ >= 0.1 && H < 0.1 ? 'bg-lime-600/30 border border-lime-500/50' : 'bg-purple-900/50'}`}>
            <p className="text-purple-400">Dublet</p>
            <p className="text-teal-400 font-bold">2 cho'qqi</p>
          </div>
          <div className={`rounded p-2 ${H >= 0.1 ? 'bg-lime-600/30 border border-lime-500/50' : 'bg-purple-900/50'}`}>
            <p className="text-purple-400">Sekstet</p>
            <p className="text-teal-400 font-bold">6 cho'qqi (3:2:1:1:2:3)</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Kuzatishlar:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>δ o'ngga siljisa</strong> → yuqori s-elektron zichligi (past oksidlanish)</li>
            <li><strong>ΔE<sub>Q</sub> oshsa</strong> → past simmetriya, katta EFG</li>
            <li><strong>H oshsa</strong> → sekstet chiziqlari kengayadi</li>
            <li><strong>Γ kichik</strong> → yuqori rezolyutsiya, yaxshi kristallik</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. IZOMER SILJISH KALKULYATORI
// ============================================================================
function IsomerShiftCalc() {
  const [selectedState, setSelectedState] = useState("fe2-hs")

  const states = {
    "fe2-hs": { name: "Fe²⁺ HS", delta: "0.9 − 1.4", deltaQ: "2.0 − 3.5", config: "t₂g⁴ e<sub>g</sub>²", example: "[Fe(H₂O)₆]²⁺" },
    "fe3-hs": { name: "Fe³⁺ HS", delta: "0.3 − 0.6", deltaQ: "0.0 − 0.5", config: "t₂g³ e<sub>g</sub>²", example: "[Fe(H₂O)₆]³⁺" },
    "fe2-ls": { name: "Fe²⁺ LS", delta: "0.2 − 0.5", deltaQ: "0.0 − 1.0", config: "t₂g⁶", example: "K₄[Fe(CN)₆]" },
    "fe3-ls": { name: "Fe³⁺ LS", delta: "0.0 − 0.3", deltaQ: "0.0 − 0.8", config: "t₂g⁵", example: "K₃[Fe(CN)₆]" },
    "fe0": { name: "Fe⁰", delta: "−0.1 − 0.1", deltaQ: "0.0", config: "d⁸ (18e⁻)", example: "[Fe(CO)₅]" },
  }

  const s = states[selectedState]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 Izomer siljish (δ) — oksidlanish va spin holati</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(states).map(([key, val]) => (
            <button key={key} onClick={() => setSelectedState(key)}
              className={`px-4 py-3 rounded-xl text-left transition-all ${
                selectedState === key 
                  ? "bg-teal-600/30 border-2 border-teal-400" 
                  : "bg-purple-900/50 border border-transparent hover:bg-purple-800/50"
              }`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-teal-400 font-bold">{val.name}</span>
                <span className="text-emerald-400 font-mono text-sm">δ = {val.delta}</span>
              </div>
              <div className="text-purple-300 text-xs">{val.example}</div>
            </button>
          ))}
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-teal-400 font-bold text-xs mb-2">Tanlangan holat tahlili:</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">δ diapazoni</p>
              <p className="text-teal-400 font-mono font-bold">{s.delta} mm/s</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">ΔE<sub>Q</sub></p>
              <p className="text-yellow-400 font-mono font-bold">{s.deltaQ} mm/s</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">Konfiguratsiya</p>
              <p className="text-emerald-400" dangerouslySetInnerHTML={{__html: s.config}}></p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">Misol</p>
              <p className="text-purple-200">{s.example}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 δ nima uchun o'zgaradi?</p>
          <p className="text-purple-200">
            δ ∝ |ψ(0)|² — <strong>yadro atrofidagi s-elektron zichligi</strong>.
            <br/>• <strong>Fe²⁺ → Fe³⁺</strong> (oksidlanish) → elektron kamayadi → δ <strong>kamayadi</strong>
            <br/>• <strong>HS → LS</strong> (spin o'tish) → elektron zichligi oshadi → δ <strong>kamayadi</strong>
            <br/>• <strong>π-akseptor ligandlar</strong> (CN⁻, CO) → δ <strong>kamayadi</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. HARORAT VA SPIN O'TISH (SCO)
// ============================================================================
function TemperatureSCO() {
  const [T, setT] = useState(300)
  
  // Soddalashtirilgan SCO modeli
  const gammaHS = 1 / (1 + Math.exp(-0.15 * (T - 175)))
  const gammaLS = 1 - gammaHS
  const deltaAvg = gammaHS * 1.0 + gammaLS * 0.4
  const deltaQAvg = gammaHS * 3.0 + gammaLS * 0.2

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌡️ Haroratga bog'liqlik — Spin Crossover (SCO)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-lg p-4">
          <p className="text-teal-400 font-bold mb-2">💎 Noyob hodisa:</p>
          <p className="text-purple-200 text-xs">
            Ba'zi Fe²⁺ komplekslarida <strong>harorat o'zgarganda</strong> HS ↔ LS o'tish kuzatiladi.
            Mössbauer spektri <strong>ikkita komponent aralashmasi</strong> ko'rinishida bo'ladi.
            Bu materiallar <strong>sensorlar, xotira qurilmalari</strong> va <strong>nano-elektronika</strong>da qo'llaniladi.
          </p>
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
            <span>80 K (LS dominant)</span>
            <span>T<sub>1/2</sub> ≈ 175 K</span>
            <span>400 K (HS dominant)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400">γ<sub>HS</sub></p>
            <p className="text-emerald-400 font-bold font-mono">{(gammaHS * 100).toFixed(0)}%</p>
          </div>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-400">γ<sub>LS</sub></p>
            <p className="text-emerald-400 font-bold font-mono">{(gammaLS * 100).toFixed(0)}%</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">δ<sub>avg</sub></p>
            <p className="text-teal-400 font-bold font-mono">{deltaAvg.toFixed(2)} mm/s</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">ΔE<sub>Q,avg</sub></p>
            <p className="text-yellow-400 font-bold font-mono">{deltaQAvg.toFixed(1)} mm/s</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Mössbauer SCO ni qanday ko'rsatadi?</p>
          <p className="text-purple-200">
            T &lt; T<sub>1/2</sub> → <strong>LS dubleti</strong> (δ ≈ 0.4, ΔE<sub>Q</sub> ≈ 0.2)
            <br/>T &gt; T<sub>1/2</sub> → <strong>HS dubleti</strong> (δ ≈ 1.0, ΔE<sub>Q</sub> ≈ 3.0)
            <br/>O'tish mintaqasida <strong>ikkala dublet bir vaqtda</strong> ko'rinadi, intensivlik haroratga bog'liq.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. TARIXIY VA AMALIY KONTEKST
// ============================================================================
function HistoricalContext() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst va amaliy qo'llanilish</h3>

      <div className="bg-gradient-to-br from-teal-900/30 to-purple-900/30 rounded-xl p-5 border border-teal-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🏆</div>
              <div>
                <p className="text-yellow-400 font-bold">1958 — Rudolf Mössbauer</p>
                <p className="text-purple-200 text-xs mt-1">
                  Nemis fizigi <strong>Rudolf Mössbauer</strong> qattiq jismda <strong>qaytishsiz gamma-rezonans</strong> ni kashf etdi.
                  1961 yilda <strong>Nobel mukofoti</strong> bilan taqdirlangan (yoshligi: 32 yosh!).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🌍</div>
              <div>
                <p className="text-yellow-400 font-bold">Boshqa izotoplar</p>
                <p className="text-purple-200 text-xs mt-1">
                  ⁵⁷Fe (eng keng), lekin ¹¹⁹Sn, ¹⁵¹Eu, ¹²¹Sb, ⁵⁷Co, ¹⁹⁷Au ham o'rganiladi.
                  Har bir izotop <strong>o'ziga xos energiya va tezlik diapazoniga</strong> ega.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🧬</div>
              <div>
                <p className="text-yellow-400 font-bold">Biologiya va materialshunoslik</p>
                <p className="text-purple-200 text-xs mt-1">
                  Gemoglobin, ferredoksin, magnetit, pruss ko'k, nanokompozitlar, SCO materiallar.
                  Mössbauer <strong>faol markazning elektron holatini</strong> bevosita ko'rsatadi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun faqat qattiq jism?</p>
          <p className="text-purple-200">
            Gaz yoki suyuqlikda atomlar <strong>erkin harakatlanadi</strong> → recoil energiyasi yutiladi → rezonans buziladi.
            Qattiq jismda atom <strong>panjaraga bog'langan</strong> → massa deyarli cheksiz → recoil nolga yaqin → 
            <strong> noyob rezonans</strong> sodir bo'ladi (f &gt; 0.1).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function MossbauerSpektroskopiya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg">← Tahlil usullari</Link>
        <div>
          <h1 className="text-2xl font-bold text-teal-400">⚛️ Mössbauer spektroskopiya</h1>
          <p className="text-purple-400 text-sm">Izomer siljish • Kvadrupol bo'linishi • Magnit o'ta nozik tuzilish • Fe komplekslari</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* BIRIKMALAR KARTASI */}
        <Link 
          href="/ilmiy/tahlil/mossbauer/birikmalar"
          className="group block bg-gradient-to-r from-teal-900/40 to-purple-900/40 border border-teal-700/50 rounded-2xl p-6 hover:bg-teal-900/60 hover:border-teal-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">⚛️</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-teal-400 group-hover:text-teal-300 transition-colors">
                Birikmalarning Mössbauer tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Temir komplekslarining Mössbauer spektrlari tahlili. δ, ΔE<sub>Q</sub>, H parametrlari, 
                oksidlanish darajasi va spin holati har bir birikma uchun batafsil.
              </p>
            </div>
            <div className="text-3xl text-teal-400 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-teal-600/20 text-teal-400 border border-teal-600/30 px-3 py-1 rounded-full text-xs">6 ta Fe birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">δ (mm/s)</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">ΔE<sub>Q</sub> (mm/s)</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">H (Tesla)</span>
          </div>
        </Link>

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">📋 Mössbauer spektroskopiya haqida</h2>
          <div className="bg-teal-600/10 border border-teal-500/30 rounded-xl p-5 mb-4">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-teal-400">Mössbauer spektroskopiyasi</strong> — qattiq jismdagi yadrolarning 
              <strong className="text-teal-400"> qaytishsiz gamma-nurlanish rezonans yutilishi</strong>ga asoslangan noyob usul.
              Kimyoda asosan <strong className="text-teal-400">⁵⁷Fe</strong> (2.14% tabiiy) uchun qo'llaniladi.
              14.4 keV gamma-nurlanish, Doppler effekti (±10 mm/s) orqali rezonans sharti bajariladi.
              Oksidlanish darajasi, spin holati, simmetriya va magnit tartibni <strong>bir vaqtda</strong> aniqlaydi.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-purple-800/30 rounded p-3">
              <p className="text-teal-400 font-bold">14.4 keV</p>
              <p className="text-purple-300">rezonans energiyasi</p>
            </div>
            <div className="bg-purple-800/30 rounded p-3">
              <p className="text-teal-400 font-bold">±10 mm/s</p>
              <p className="text-purple-300">Doppler tezligi</p>
            </div>
            <div className="bg-purple-800/30 rounded p-3">
              <p className="text-teal-400 font-bold">f &gt; 0.1</p>
              <p className="text-purple-300">recoil-free fraksiya</p>
            </div>
          </div>
        </div>

        {/* SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <MossbauerSpectrumSimulator />
        </div>

        {/* IZOMER SILJISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <IsomerShiftCalc />
        </div>

        {/* HARORAT VA SCO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TemperatureSCO />
        </div>

        {/* TARIXIY */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <HistoricalContext />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-teal-600/10 to-purple-600/10 border border-teal-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Mössbauer — <strong className="text-teal-400">temir komplekslari uchun eng aniq usul</strong></li>
            <li>Izomer siljish (δ) → <strong className="text-teal-400">oksidlanish darajasi va spin holati</strong></li>
            <li>Kvadrupol bo'linishi (ΔE<sub>Q</sub>) → <strong className="text-teal-400">koordinatsion simmetriya</strong></li>
            <li>Magnit bo'linish (H) → <strong className="text-teal-400">ichki maydon, magnit tartib</strong></li>
            <li>Fe²⁺ vs Fe³⁺, HS vs LS → <strong>parametrlar orqali aniq farqlanadi</strong></li>
            <li>Spin crossover (SCO) → <strong>haroratga bog'liq ikki holat aralashmasi</strong></li>
            <li>Qattiq jismda ishlaydi → <strong>recoil-free rezonans</strong> sharti</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/epr" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← EPR spektroskopiya</Link>
          <Link href="/ilmiy/tahlil/fluoressensiya" className="px-6 py-3 bg-teal-600/80 rounded-xl hover:bg-teal-500 text-white font-semibold">Fluoressensiya →</Link>
        </div>

      </section>
    </main>
  )
}