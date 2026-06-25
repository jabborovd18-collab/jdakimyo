"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. EPR SPEKTR SIMULYATORI (K₃[Fe(CN)₆] uchun maxsus)
// ============================================================================
function EPRSpektrSimulyatori() {
  const [g1, setG1] = useState(2.76)
  const [g2, setG2] = useState(2.20)
  const [g3, setG3] = useState(2.00)
  const [linewidth, setLinewidth] = useState(50)
  const [temperature, setTemperature] = useState(298)

  const nuGHz = 9.5 // X-band
  const h = 6.626e-34
  const muB = 9.274e-24

  // Har bir g-faktor uchun rezonans maydoni
  const B1 = (h * nuGHz * 1e9) / (g1 * muB) * 1e4 // Gauss
  const B2 = (h * nuGHz * 1e9) / (g2 * muB) * 1e4
  const B3 = (h * nuGHz * 1e9) / (g3 * muB) * 1e4

  // Haroratga bog'liq intensivlik (Curie qonuni: I ∝ 1/T)
  const intensityFactor = 298 / temperature

  // Spektr nuqtalari
  const spectrum = useMemo(() => {
    const points = []
    const B_min = 1000
    const B_max = 5000
    
    for (let i = 0; i < 400; i++) {
      const B = B_min + (i / 400) * (B_max - B_min)
      
      // 3 ta Gaussian cho'qqi (rombik anizotropiya)
      const gauss1 = Math.exp(-0.5 * Math.pow((B - B1) / (linewidth / 2), 2))
      const gauss2 = Math.exp(-0.5 * Math.pow((B - B2) / (linewidth / 2), 2))
      const gauss3 = Math.exp(-0.5 * Math.pow((B - B3) / (linewidth / 2), 2))
      
      const signal = (gauss1 + gauss2 + gauss3) * intensityFactor
      points.push({ B, signal })
    }
    return points
  }, [B1, B2, B3, linewidth, intensityFactor])

  const maxSignal = Math.max(...spectrum.map(p => p.signal), 0.01)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📡 EPR spektr simulyatori — K₃[Fe(CN)₆]</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 Rombik anizotropiya:</p>
          <p className="text-purple-200 text-xs">
            K₃[Fe(CN)₆] da <strong>g₁ ≠ g₂ ≠ g₃</strong> — bu <strong>rombik simmetriya</strong> belgisi.
            Toq elektron t₂g orbitallarida joylashgan, spin-orbital coupling tufayli g-faktorlar
            erkin elektron qiymatidan (ge=2.0023) og'adi.
          </p>
        </div>

        {/* SLIDERLAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">g₁ (eng katta):</span>
                <span className="text-emerald-400 font-mono">{g1.toFixed(2)}</span>
              </label>
              <input type="range" min="2.0" max="3.5" step="0.01" value={g1}
                onChange={(e) => setG1(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-lime-500" />
              <p className="text-purple-400 text-[10px] mt-1">B₁ = {B1.toFixed(0)} G</p>
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">g₂ (o'rta):</span>
                <span className="text-emerald-400 font-mono">{g2.toFixed(2)}</span>
              </label>
              <input type="range" min="2.0" max="3.0" step="0.01" value={g2}
                onChange={(e) => setG2(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-lime-500" />
              <p className="text-purple-400 text-[10px] mt-1">B₂ = {B2.toFixed(0)} G</p>
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">g₃ (eng kichik):</span>
                <span className="text-emerald-400 font-mono">{g3.toFixed(2)}</span>
              </label>
              <input type="range" min="1.9" max="2.5" step="0.01" value={g3}
                onChange={(e) => setG3(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-lime-500" />
              <p className="text-purple-400 text-[10px] mt-1">B₃ = {B3.toFixed(0)} G</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">Chiziq kengligi (ΔB):</span>
                <span className="text-emerald-400 font-mono">{linewidth} G</span>
              </label>
              <input type="range" min="10" max="150" step="5" value={linewidth}
                onChange={(e) => setLinewidth(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-lime-500" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">Harorat (T):</span>
                <span className="text-emerald-400 font-mono">{temperature} K</span>
              </label>
              <input type="range" min="4" max="400" step="1" value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-lime-500" />
              <p className="text-purple-400 text-[10px] mt-1">Intensivlik ∝ 1/T (Curie qonuni)</p>
            </div>
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-lime-400 font-bold text-xs mb-2">EPR spektri (X-band, 9.5 GHz):</h5>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="100" x2="380" y2="100" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="40" y1="20" x2="40" y2="180" stroke="#4c1d95" strokeWidth="1" />
            <line x1="380" y1="20" x2="380" y2="180" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">B (Gauss)</text>
            <text x="40" y="195" fill="#a78bfa" fontSize="8">1000</text>
            <text x="380" y="195" fill="#a78bfa" fontSize="8" textAnchor="end">5000</text>
            <text x="20" y="100" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 100)">
              dI/dB
            </text>

            {/* Absorbsiya */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 400) * 340
                const y = 100 - (p.signal / maxSignal) * 70
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#84cc16" strokeWidth="1.5" opacity="0.4"
            />

            {/* Birinchi hosila */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 400) * 340
                const next = spectrum[i + 1] || p
                const derivative = (next.signal - p.signal) * 500
                const y = 100 - (derivative / maxSignal) * 70
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#84cc16" strokeWidth="2"
            />

            {/* g-faktor belgilari */}
            <line x1={40 + ((B1 - 1000) / 4000) * 340} y1="20" x2={40 + ((B1 - 1000) / 4000) * 340} y2="180"
              stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((B1 - 1000) / 4000) * 340} y="15" fill="#ef4444" fontSize="8" textAnchor="middle">
              g₁={g1.toFixed(2)}
            </text>

            <line x1={40 + ((B2 - 1000) / 4000) * 340} y1="25" x2={40 + ((B2 - 1000) / 4000) * 340} y2="180"
              stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((B2 - 1000) / 4000) * 340} y="20" fill="#f59e0b" fontSize="8" textAnchor="middle">
              g₂={g2.toFixed(2)}
            </text>

            <line x1={40 + ((B3 - 1000) / 4000) * 340} y1="30" x2={40 + ((B3 - 1000) / 4000) * 340} y2="180"
              stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((B3 - 1000) / 4000) * 340} y="25" fill="#3b82f6" fontSize="8" textAnchor="middle">
              g₃={g3.toFixed(2)}
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400">g₁</p>
            <p className="text-emerald-400 font-bold font-mono">{g1.toFixed(2)}</p>
            <p className="text-purple-400 text-[10px]">{B1.toFixed(0)} G</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-yellow-400">g₂</p>
            <p className="text-emerald-400 font-bold font-mono">{g2.toFixed(2)}</p>
            <p className="text-purple-400 text-[10px]">{B2.toFixed(0)} G</p>
          </div>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-400">g₃</p>
            <p className="text-emerald-400 font-bold font-mono">{g3.toFixed(2)}</p>
            <p className="text-purple-400 text-[10px]">{B3.toFixed(0)} G</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Kuzatishlar:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>g₁ &gt; g₂ &gt; g₃</strong> — rombik anizotropiya, past simmetriya</li>
            <li><strong>Harorat pastlashi</strong> → intensivlik oshadi (1/T qonuni)</li>
            <li><strong>Chiziq kengligi</strong> → cho'qqilar yomon ajraladi</li>
            <li>g-qiymatlar 2.0023 dan og'ishi → <strong>spin-orbital coupling</strong></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. SPIN-ORBITAL COUPLING TUShUNTIRIShI
// ============================================================================
function SpinOrbitalCoupling() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Spin-orbital coupling — g-faktor og'ishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-2">g-faktor formulasi:</p>
          <p className="text-lime-400 text-lg">g = g<sub>e</sub> + Δg</p>
          <p className="text-purple-400 text-xs mt-2">g<sub>e</sub> = 2.0023 (erkin elektron)</p>
          <p className="text-purple-400 text-xs">Δg — spin-orbital coupling hissasi</p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-lime-400 font-bold text-xs mb-3">K₃[Fe(CN)₆] uchun:</h5>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between bg-purple-900/50 rounded p-2">
              <span className="text-purple-300">g₁ = 2.76</span>
              <span className="text-emerald-400 font-mono">Δg₁ = +0.76</span>
            </div>
            <div className="flex justify-between bg-purple-900/50 rounded p-2">
              <span className="text-purple-300">g₂ = 2.20</span>
              <span className="text-emerald-400 font-mono">Δg₂ = +0.20</span>
            </div>
            <div className="flex justify-between bg-purple-900/50 rounded p-2">
              <span className="text-purple-300">g₃ = 2.00</span>
              <span className="text-emerald-400 font-mono">Δg₃ ≈ 0</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun g-qiymatlar har xil?</p>
          <p className="text-purple-200">
            Fe³⁺ (d⁵ LS) da toq elektron <strong>t₂g orbitallarida</strong> joylashgan.
            Spin-orbital coupling tufayli orbital moment qisman saqlanadi.
            <strong> t₂g⁵ konfiguratsiya</strong> degenerat emas (Yahn-Teller buzilishi),
            shuning uchun g-faktorlar <strong>anizotrop</strong> (g₁ ≠ g₂ ≠ g₃).
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-lime-400 font-bold text-xs mb-2">Orbital moment hissasi:</h5>
          <div className="font-mono text-xs space-y-1 text-purple-200">
            <p>μ<sub>eff</sub> = g · √[S(S+1)] · μ<sub>B</sub></p>
            <p>S = 1/2 → √[S(S+1)] = √0.75 ≈ 0.866</p>
            <p>g<sub>o'rtacha</sub> = (2.76 + 2.20 + 2.00) / 3 = <span className="text-emerald-400 font-bold">2.32</span></p>
            <p>μ<sub>eff</sub> = 2.32 × 0.866 = <span className="text-emerald-400 font-bold">2.01 μ<sub>B</sub></span></p>
            <p className="text-purple-400 mt-2">Eksperimental: <span className="text-yellow-400">~2.3 μ<sub>B</sub></span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. HARORATGA BOGLIQLIK
// ============================================================================
function HaroratBogliqlik() {
  const [T, setT] = useState(298)
  
  // Curie qonuni: χ = C/T, intensivlik ∝ 1/T
  const intensity = 298 / T
  const chi = 1 / T

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌡️ Haroratga bog'liqlik — Curie qonuni</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-2">Curie qonuni:</p>
          <p className="text-lime-400 text-xl">χ = C / T</p>
          <p className="text-purple-400 text-xs mt-2">EPR intensivligi ∝ 1/T</p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Harorat (T):</span>
            <span className="text-emerald-400 font-mono">{T} K</span>
          </label>
          <input type="range" min="4" max="400" step="1" value={T}
            onChange={(e) => setT(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-lime-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>4 K (suyuq He)</span>
            <span>77 K (suyuq N₂)</span>
            <span>298 K (xona)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-lime-900/30 border border-lime-500/30 rounded-lg p-3">
            <p className="text-lime-400">Intensivlik</p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{intensity.toFixed(2)}×</p>
            <p className="text-purple-400 text-[10px]">(298 K ga nisbatan)</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">χ (nisbiy)</p>
            <p className="text-yellow-400 font-bold font-mono text-lg">{(chi * 1000).toFixed(2)}</p>
            <p className="text-purple-400 text-[10px]">×10⁻³</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Amaliy maslahat:</p>
          <p className="text-purple-200">
            K₃[Fe(CN)₆] EPR spektrini <strong>past haroratda</strong> (4-77 K) o'lchash tavsiya etiladi —
            signal <strong>sezilarli kuchliroq</strong> bo'ladi. Xona haroratida (298 K) signal kuchsiz,
            lekin hali ko'rinadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. K₃ vs K₄ SOLIShTIRISH
// ============================================================================
function K3vsK4() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 K₃[Fe(CN)₆] vs K₄[Fe(CN)₆] — EPR solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30">
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
                ["Toq elektronlar", "1", "0"],
                ["Spin (S)", "1/2", "0"],
                ["Magnit holat", "Paramagnit", "Diamagnit"],
                ["EPR signal", "✓ Bor", "✗ Yo'q"],
                ["g-faktor", "2.76, 2.20, 2.00", "—"],
                ["Anizotropiya", "Rombik", "—"],
                ["μ_eff", "~2.3 μB", "0 μB"],
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
        <p className="text-purple-400 text-xs mt-3">
          * Bir xil ligand (CN⁻), bir xil geometriya (oktaedrik), lekin <strong>oksidlanish darajasi farqli</strong>.
          K₃[Fe(CN)₆] da bitta toq elektron bor → EPR signal beradi.
          K₄[Fe(CN)₆] da barcha elektronlar juftlashgan → EPR signal <strong>yo'q</strong>.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// 5. GIPERNOZIK TUZILISH
// ============================================================================
function GipernozikTuzilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 Gipernozik tuzilish — ⁵⁷Fe yadrosi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-lime-400 font-bold text-xs mb-2">⁵⁷Fe yadro xususiyatlari:</h5>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">Spin (I)</p>
              <p className="text-emerald-400 font-bold">1/2</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">Tabiiylik</p>
              <p className="text-emerald-400 font-bold">2.1%</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">Cho'qqilar soni</p>
              <p className="text-emerald-400 font-bold">2I+1 = 2</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">A konstantasi</p>
              <p className="text-emerald-400 font-bold">~10-20 G</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun gipernozik tuzilish kuchsiz?</p>
          <p className="text-purple-200">
            K₃[Fe(CN)₆] da <strong>⁵⁷Fe gipernozik tuzilish kuchsiz</strong> (A ≈ 10-20 G).
            Sababi: toq elektron <strong>t₂g orbitallarida</strong> joylashgan, yadro bilan to'g'ridan-to'g'ri
            o'zaro ta'sir kuchsiz (Fermi contact kichik). Bundan tashqari, ⁵⁷Fe tabiiyligi <strong>atigi 2.1%</strong> —
            signal kuchsiz. Shuning uchun K₃[Fe(CN)₆] EPR spektrida gipernozik tuzilish <strong>ko'pincha ko'rinmaydi</strong>.
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-lime-400 font-bold text-xs mb-2">Mössbauer vs EPR:</h5>
          <p className="text-purple-200 text-xs">
            Fe komplekslarini o'rganishda <strong>Mössbauer spektroskopiyasi</strong> EPR dan <strong>ko'proq ma'lumot</strong> beradi.
            Mössbauer da ⁵⁷Fe ning <strong>100%</strong> i ishtirok etadi, EPR da esa faqat 2.1% (⁵⁷Fe).
            Shuning uchun Fe komplekslari uchun <strong>Mössbauer afzalroq</strong>.
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
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — EPR va K₃[Fe(CN)₆]</h3>

      <div className="bg-gradient-to-br from-lime-900/30 to-purple-900/30 rounded-xl p-5 border border-lime-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📡</div>
              <div>
                <p className="text-yellow-400 font-bold">1944 — EPR kashf etilishi</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Y.K. Zavoisky</strong> (Qozon universiteti) birinchi marta EPR signalini qayd etdi.
                  Bu kashfiyot paramagnit komplekslarni o'rganishda <strong>inqilob</strong> qildi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1950-60 — K₃[Fe(CN)₆] EPR o'rganildi</p>
                <p className="text-purple-200 text-xs mt-1">
                  K₃[Fe(CN)₆] — <strong>klassik paramagnit kompleks</strong> sifatida keng o'rganildi.
                  Rombik anizotropiya (g₁=2.76, g₂=2.20, g₃=2.00) aniqlandi.
                  Bu <strong>spin-orbital coupling</strong> nazariyasini tasdiqladi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💎</div>
              <div>
                <p className="text-yellow-400 font-bold">1960-70 — Zamonaviy EPR</p>
                <p className="text-purple-200 text-xs mt-1">
                  Past harorat EPR (4-77 K), yuqori chastota (Q-band, W-band) rivojlandi.
                  K₃[Fe(CN)₆] — <strong>standart namuna</strong> sifatida ishlatila boshladi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 K₃[Fe(CN)₆] ning EPR dagi ahamiyati:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Rombik anizotropiya</strong> klassik namunasi</li>
            <li><strong>Spin-orbital coupling</strong> tushuntirish</li>
            <li><strong>t₂g⁵ konfiguratsiya</strong> o'rganish</li>
            <li><strong>Haroratga bog'liqlik</strong> (Curie qonuni) namoyishi</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function K3FeCN6EPR() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <nav className="flex items-center gap-2 text-sm flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300">Tahlil</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/epr" className="text-purple-400 hover:text-purple-300">EPR</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/epr/birikmalar" className="text-purple-400 hover:text-purple-300">Birikmalar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-red-400">K₃[Fe(CN)₆]</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-red-400">📡 K₃[Fe(CN)₆] — EPR tahlili</h1>
          <p className="text-purple-400 text-sm">
            Fe³⁺ (d⁵ LS) • S=1/2 • Paramagnit • Rombik anizotropiya • g₁=2.76, g₂=2.20, g₃=2.00
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-red-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-red-400">K₃[Fe(CN)₆]</span>
            <div>
              <h2 className="text-xl font-bold text-white">EPR tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Qizil qon tuzi" — rombik anizotropiya klassikasi</p>
            </div>
          </div>

          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              K₃[Fe(CN)₆] — <strong className="text-red-400">rombik anizotropiya</strong>ning klassik namunasi.
              Fe³⁺ (d⁵ LS) da bitta toq elektron t₂g orbitallarida joylashgan.
              Spin-orbital coupling tufayli <strong>g-faktorlar erkin elektron qiymatidan og'adi</strong>:
              g₁=2.76, g₂=2.20, g₃=2.00. Bu <strong>uchta turli g-qiymat</strong> past simmetriya
              (Yahn-Teller buzilishi) belgisi. EPR spektri <strong>past haroratda</strong> yaxshi ko'rinadi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">Fe³⁺ (LS)</p>
              <p className="text-purple-300">d⁵, t₂g⁵</p>
              <p className="text-purple-400 mt-1">S = 1/2</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">g₁=2.76</p>
              <p className="text-purple-300">g₂=2.20</p>
              <p className="text-purple-400 mt-1">g₃=2.00</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">Rombik</p>
              <p className="text-purple-300">anizotropiya</p>
              <p className="text-purple-400 mt-1">g₁≠g₂≠g₃</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">~2.3 μ<sub>B</sub></p>
              <p className="text-purple-300">μ<sub>eff</sub></p>
              <p className="text-purple-400 mt-1">298 K da</p>
            </div>
          </div>
        </div>

        {/* EPR SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EPRSpektrSimulyatori />
        </div>

        {/* SPIN-ORBITAL COUPLING */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SpinOrbitalCoupling />
        </div>

        {/* HARORAT BOGLIQLIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <HaroratBogliqlik />
        </div>

        {/* GIPERNOZIK TUZILISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <GipernozikTuzilish />
        </div>

        {/* K₃ vs K₄ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <K3vsK4 />
        </div>

        {/* TARIX */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TarixiyKontekst />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>K₃[Fe(CN)₆] — <strong className="text-red-400">paramagnit</strong> (Fe³⁺ d⁵ LS, S=1/2)</li>
            <li><strong className="text-red-400">Rombik anizotropiya</strong>: g₁=2.76, g₂=2.20, g₃=2.00</li>
            <li>g-faktorlar 2.0023 dan og'ishi → <strong>spin-orbital coupling</strong></li>
            <li>t₂g⁵ konfiguratsiya → <strong>Yahn-Teller buzilishi</strong> (past simmetriya)</li>
            <li>⁵⁷Fe gipernozik tuzilish <strong>kuchsiz</strong> (A ≈ 10-20 G, tabiiylik 2.1%)</li>
            <li>ZFS yo'q (S=1/2 uchun ZFS mavjud emas)</li>
            <li>EPR intensivligi <strong>haroratga teskari proporsional</strong> (1/T qonuni)</li>
            <li>Past haroratda (4-77 K) signal <strong>kuchliroq</strong></li>
            <li>K₄[Fe(CN)₆] — <strong>diamagnit</strong>, EPR signal yo'q</li>
            <li>μ<sub>eff</sub> ≈ 2.3 μ<sub>B</sub> — spin-only (1.73) dan yuqori (orbital hissa)</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/epr/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← EPR birikmalar
          </Link>
          <Link href="/ilmiy/tahlil/epr/birikmalar/cu-h2o6" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">
            [Cu(H₂O)₆]²⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}