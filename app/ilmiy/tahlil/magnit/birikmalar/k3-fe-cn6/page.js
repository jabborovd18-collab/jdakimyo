"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. SPIN-ONLY KALKULYATORI
// ============================================================================
function SpinOnlyCalc() {
  const [n, setN] = useState(1) // toq elektronlar soni (K3FeCN6 uchun 1)

  const mu_so = Math.sqrt(n * (n + 2))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Spin-only magnit momenti</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-2">Formula:</p>
          <p className="text-yellow-400 text-xl">
            μ<sub>so</sub> = √[n(n+2)] μ<sub>B</sub>
          </p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-2">
            <span className="text-yellow-400 font-bold">Toq elektronlar soni (n):</span>
            <span className="text-emerald-400 font-mono text-lg">{n}</span>
          </label>
          <input
            type="range"
            min="1"
            max="7"
            step="1"
            value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Hisoblash</p>
            <p className="text-purple-200 font-mono">√({n}·{n + 2})</p>
          </div>
          <div className="bg-orange-900/40 border border-orange-500/40 rounded-lg p-3">
            <p className="text-orange-400">Natija</p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{mu_so.toFixed(3)} μ<sub>B</sub></p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-2">📋 n bo'yicha qiymatlar:</p>
          <div className="grid grid-cols-7 gap-1 text-center font-mono">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className={`rounded p-1 ${i === n ? 'bg-orange-600/50 text-white' : 'bg-purple-800/30 text-purple-300'}`}>
                <div className="text-[10px]">n={i}</div>
                <div className="font-bold">{Math.sqrt(i * (i + 2)).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-3 text-xs">
          <p className="text-red-400 font-bold mb-1">⚠️ K₃[Fe(CN)₆] uchun ogohlantirish:</p>
          <p className="text-purple-200">
            K₃[Fe(CN)₆] da n=1 (t₂g⁵, S=1/2), spin-only μ<sub>so</sub> = <strong>1.73 μ<sub>B</sub></strong>.
            Ammo eksperimental <strong>μ<sub>eff</sub> ≈ 2.3 μ<sub>B</sub></strong> — sababi spin-orbital coupling
            (λ ≠ 0) va past simmetriya. Orbital momentning hissasi hisobga olinishi kerak!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. CURIE-WEISS FIT (interaktiv)
// ============================================================================
function CurieWeissFit() {
  const [C, setC] = useState(0.75)
  const [theta, setTheta] = useState(-5)

  // χ vs T va 1/χ vs T ma'lumotlari
  const { chiData, invChiData } = useMemo(() => {
    const chi = []
    const inv = []
    for (let T = 10; T <= 300; T += 5) {
      const chiVal = C / (T - theta)
      chi.push({ T, chi: chiVal })
      inv.push({ T, inv: 1 / chiVal })
    }
    return { chiData: chi, invChiData: inv }
  }, [C, theta])

  const mu_eff = Math.sqrt(8 * C) // μ_eff = √(8C) formulasi (Curie doimiysidan)

  const maxChi = Math.max(...chiData.map(p => p.chi))
  const maxInv = Math.max(...invChiData.map(p => p.inv))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📈 Curie-Weiss qonuni — interaktiv fit</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-1">Qonun:</p>
          <p className="text-yellow-400 text-lg">χ = C / (T − θ)</p>
          <p className="text-purple-400 text-xs mt-2">μ<sub>eff</sub> = √(8C) = {mu_eff.toFixed(2)} μ<sub>B</sub></p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">C (Curie doimiysi):</span>
              <span className="text-emerald-400 font-mono">{C.toFixed(2)} emu·K/mol</span>
            </label>
            <input type="range" min="0.1" max="3" step="0.05" value={C}
              onChange={(e) => setC(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-orange-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">θ (Weiss doimiysi):</span>
              <span className={`font-mono font-bold ${theta > 0 ? 'text-red-400' : theta < 0 ? 'text-blue-400' : 'text-purple-400'}`}>
                {theta.toFixed(1)} K
              </span>
            </label>
            <input type="range" min="-100" max="100" step="1" value={theta}
              onChange={(e) => setTheta(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-orange-500" />
            <div className="flex justify-between text-[10px] mt-1">
              <span className="text-blue-400">Antiferro (−)</span>
              <span className="text-purple-400">Ideal (0)</span>
              <span className="text-red-400">Ferro (+)</span>
            </div>
          </div>
        </div>

        {/* GRAFIKLAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* χ vs T */}
          <div className="bg-purple-950/50 rounded-lg p-3">
            <h5 className="text-orange-400 font-bold text-xs mb-2">χ vs T</h5>
            <svg viewBox="0 0 300 180" className="w-full h-36 bg-purple-950 rounded">
              <line x1="35" y1="150" x2="290" y2="150" stroke="#4c1d95" strokeWidth="1" />
              <line x1="35" y1="10" x2="35" y2="150" stroke="#4c1d95" strokeWidth="1" />
              <text x="160" y="175" fill="#c4b5fd" fontSize="9" textAnchor="middle">T (K)</text>
              <text x="10" y="80" fill="#c4b5fd" fontSize="8" transform="rotate(-90, 10, 80)">χ (emu/mol)</text>
              <text x="35" y="165" fill="#a78bfa" fontSize="8">0</text>
              <text x="290" y="165" fill="#a78bfa" fontSize="8" textAnchor="end">300</text>
              <polyline
                points={chiData.map(p => {
                  const x = 35 + (p.T / 300) * 255
                  const y = 150 - (p.chi / maxChi) * 130
                  return `${x},${y}`
                }).join(' ')}
                fill="none" stroke="#f97316" strokeWidth="2" />
            </svg>
          </div>

          {/* 1/χ vs T */}
          <div className="bg-purple-950/50 rounded-lg p-3">
            <h5 className="text-emerald-400 font-bold text-xs mb-2">1/χ vs T (chiziqli)</h5>
            <svg viewBox="0 0 300 180" className="w-full h-36 bg-purple-950 rounded">
              <line x1="35" y1="150" x2="290" y2="150" stroke="#4c1d95" strokeWidth="1" />
              <line x1="35" y1="10" x2="35" y2="150" stroke="#4c1d95" strokeWidth="1" />
              <text x="160" y="175" fill="#c4b5fd" fontSize="9" textAnchor="middle">T (K)</text>
              <text x="10" y="80" fill="#c4b5fd" fontSize="8" transform="rotate(-90, 10, 80)">1/χ</text>

              {/* θ ni ko'rsatish */}
              {theta >= 0 && theta <= 300 && (
                <circle cx={35 + (theta / 300) * 255} cy="150" r="3" fill="#f97316" />
              )}
              {theta >= 0 && theta <= 300 && (
                <line x1={35 + (theta / 300) * 255} y1="150" x2={35 + (theta / 300) * 255} y2="10" stroke="#f97316" strokeWidth="0.5" strokeDasharray="2,2" />
              )}

              <polyline
                points={invChiData.map(p => {
                  const x = 35 + (p.T / 300) * 255
                  const y = 150 - (p.inv / maxInv) * 130
                  return `${x},${y}`
                }).join(' ')}
                fill="none" stroke="#10b981" strokeWidth="2" />
            </svg>
            <p className="text-center text-[10px] text-purple-400 mt-1">
              x-o'qi bilan kesishish → <span className="text-orange-400 font-bold">T = θ</span>
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 K₃[Fe(CN)₆] uchun:</p>
          <p className="text-purple-200">
            θ ≈ <strong>−5 K</strong> (kuchsiz antiferromagnit o'zaro ta'sir — spinlar qo'shni molekulalar
            orqali antiparallel joylashishga moyil). μ<sub>eff</sub> ≈ 2.3 μ<sub>B</sub> (spin-only qiymatdan yuqori).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. BRILLIOUN FUNKSIYASI (M vs B/T)
// ============================================================================
function BrillouinSimulator() {
  const [J, setJ] = useState(0.5) // K3FeCN6 uchun J = 1/2
  const [B, setB] = useState(1) // Tesla
  const [T, setT] = useState(300) // Kelvin
  const g = 2.0 // Lande faktori (taxminan)

  const mu_B = 9.274e-24
  const k_B = 1.381e-23

  // Brillouin funksiyasi: B_J(x) = (2J+1)/(2J) coth((2J+1)x/(2J)) - (1/(2J)) coth(x/(2J))
  const coth = (x) => {
    if (Math.abs(x) < 1e-10) return 1 / x
    const e2x = Math.exp(2 * x)
    return (e2x + 1) / (e2x - 1)
  }

  const x = (g * mu_B * B) / (k_B * T)
  const B_J = ((2 * J + 1) / (2 * J)) * coth(((2 * J + 1) / (2 * J)) * x) - (1 / (2 * J)) * coth(x / (2 * J))
  const M_Msat = Math.max(0, Math.min(1, isNaN(B_J) ? 0 : B_J))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌊 Brillouin funksiyasi — M(B/T)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-1">Magnitlanish (paramagnetizm uchun):</p>
          <p className="text-yellow-400">M/M<sub>sat</sub> = B<sub>J</sub>(x)</p>
          <p className="text-purple-400 text-xs mt-1">x = gμ<sub>B</sub>B / k<sub>B</sub>T</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">J (to'liq moment):</span>
              <span className="text-emerald-400 font-mono">{J}</span>
            </label>
            <select value={J} onChange={(e) => setJ(parseFloat(e.target.value))}
              className="w-full bg-purple-900 border border-purple-700 rounded px-2 py-1 text-xs text-white">
              <option value="0.5">1/2 (LS Fe³⁺)</option>
              <option value="1">1</option>
              <option value="1.5">3/2</option>
              <option value="2">2</option>
              <option value="2.5">5/2 (HS Fe³⁺)</option>
              <option value="3">3</option>
            </select>
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">B (maydon):</span>
              <span className="text-emerald-400 font-mono">{B.toFixed(1)} T</span>
            </label>
            <input type="range" min="0" max="10" step="0.1" value={B}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-orange-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">T (harorat):</span>
              <span className="text-emerald-400 font-mono">{T} K</span>
            </label>
            <input type="range" min="1" max="500" step="1" value={T}
              onChange={(e) => setT(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-orange-500" />
          </div>
        </div>

        {/* M/Msat gauge */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-purple-400">Magnitlanish darajasi</span>
            <span className="text-orange-400 font-bold font-mono">{(M_Msat * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full h-4 bg-purple-900 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-600 to-red-500 transition-all duration-300"
              style={{ width: `${M_Msat * 100}%` }}></div>
          </div>
          <p className="text-[10px] text-purple-400 mt-2 text-center">
            x = {(x * 1000).toFixed(2)} × 10⁻³ → B<sub>J</sub>(x) = {M_Msat.toFixed(4)}
          </p>
        </div>

        {/* Brillouin egri chizig'i */}
        <div className="bg-purple-950/50 rounded-lg p-3">
          <h5 className="text-orange-400 font-bold text-xs mb-2">M/M<sub>sat</sub> vs B/T</h5>
          <svg viewBox="0 0 300 180" className="w-full h-36 bg-purple-950 rounded">
            <line x1="30" y1="150" x2="290" y2="150" stroke="#4c1d95" strokeWidth="1" />
            <line x1="30" y1="10" x2="30" y2="150" stroke="#4c1d95" strokeWidth="1" />
            <line x1="30" y1="10" x2="290" y2="10" stroke="#4c1d95" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x="160" y="175" fill="#c4b5fd" fontSize="9" textAnchor="middle">B/T (T/K)</text>
            <text x="8" y="80" fill="#c4b5fd" fontSize="8" transform="rotate(-90, 8, 80)">M/Msat</text>
            <text x="30" y="165" fill="#a78bfa" fontSize="8">0</text>
            <text x="290" y="165" fill="#a78bfa" fontSize="8" textAnchor="end">2</text>
            <text x="25" y="15" fill="#a78bfa" fontSize="8" textAnchor="end">1</text>

            <polyline
              points={Array.from({ length: 100 }, (_, i) => {
                const bOverT = (i / 100) * 2
                const xVal = (g * mu_B * bOverT) / k_B
                let yVal
                if (xVal < 1e-10) yVal = 0
                else {
                  yVal = ((2 * J + 1) / (2 * J)) * coth(((2 * J + 1) / (2 * J)) * xVal) - (1 / (2 * J)) * coth(xVal / (2 * J))
                }
                yVal = Math.max(0, Math.min(1, isNaN(yVal) ? 0 : yVal))
                const px = 30 + bOverT * 130
                const py = 150 - yVal * 140
                return `${px},${py}`
              }).join(' ')}
              fill="none" stroke="#f97316" strokeWidth="2" />

            {/* Joziba nuqtasi */}
            <circle cx={30 + (B / T) * 130} cy={150 - M_Msat * 140} r="4" fill="#ef4444" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. EVANS USULI KALKULYATORI (NMR orqali μ_eff)
// ============================================================================
function EvansCalc() {
  const [df, setDf] = useState(215) // Hz
  const [f0, setF0] = useState(400) // MHz (spektrometr chastotasi)
  const [c, setC] = useState(0.05) // mol/L
  const [T, setT] = useState(298) // K

  // μ_eff = 0.061 × √((Δf × T) / (c × f₀))
  const mu_eff = 0.061 * Math.sqrt((df * T) / (c * f0))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧪 Evans usuli — NMR orqali μ<sub>eff</sub></h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 text-center">
          <p className="text-purple-400 text-xs mb-1">Evans formulasi:</p>
          <p className="text-yellow-400 font-mono text-sm">
            μ<sub>eff</sub> = 0.061 × √[(Δf × T) / (c × f₀)]
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400">Δf (Hz):</span>
              <span className="text-emerald-400 font-mono">{df}</span>
            </label>
            <input type="range" min="0" max="1000" step="5" value={df}
              onChange={(e) => setDf(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-orange-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400">f₀ (MHz):</span>
              <span className="text-emerald-400 font-mono">{f0}</span>
            </label>
            <input type="range" min="60" max="800" step="20" value={f0}
              onChange={(e) => setF0(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-orange-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400">c (mol/L):</span>
              <span className="text-emerald-400 font-mono">{c.toFixed(3)}</span>
            </label>
            <input type="range" min="0.001" max="0.5" step="0.001" value={c}
              onChange={(e) => setC(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-orange-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400">T (K):</span>
              <span className="text-emerald-400 font-mono">{T}</span>
            </label>
            <input type="range" min="200" max="350" step="1" value={T}
              onChange={(e) => setT(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-orange-500" />
          </div>
        </div>

        <div className="bg-orange-900/40 border border-orange-500/40 rounded-lg p-4 text-center">
          <p className="text-orange-400 text-xs mb-1">Hisoblangan μ<sub>eff</sub>:</p>
          <p className="text-emerald-400 font-bold font-mono text-3xl">{mu_eff.toFixed(2)} μ<sub>B</sub></p>
          <p className="text-purple-400 text-xs mt-2">
            K₃[Fe(CN)₆] uchun kutilayotgan qiymat: <span className="text-yellow-400">~2.3 μ<sub>B</sub></span>
          </p>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Usulning afzalligi:</p>
          <p className="text-purple-200">
            SQUID magnitometri kerak emas — oddiy <strong>NMR spektrometr</strong> bilan μ<sub>eff</sub> ni aniqlash mumkin.
            Paramagnit modda eritmadagi TMS signalini siljitadi.
            Δf = ν<sub>paramagnit</sub> − ν<sub>diamagnit</sub>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. EPR SPEKTR SIMULYATORI (K3FeCN6 uchun)
// ============================================================================
function EPRSpectrum() {
  const [g1, setG1] = useState(2.76)
  const [g2, setG2] = useState(2.20)
  const [g3, setG3] = useState(2.00)
  const [linewidth, setLinewidth] = useState(50)

  const nu = 9.5 // GHz, X-band

  // B = hν/(gμ_B) — har bir g uchun rezonans maydon
  const h = 6.626e-34
  const mu_B = 9.274e-24
  const B_field = (g) => (h * nu * 1e9) / (g * mu_B) / 1e-4 // Gauss da

  const B1 = B_field(g1)
  const B2 = B_field(g2)
  const B3 = B_field(g3)

  // Gaussian cho'qqi
  const gauss = (x, center, w) => Math.exp(-0.5 * Math.pow((x - center) / w, 2))

  // Spektr nuqtalari (derivative EPR signali)
  const specData = Array.from({ length: 200 }, (_, i) => {
    const B = 1000 + (i * 4000 / 200)
    const peak1 = gauss(B, B1, linewidth)
    const peak2 = gauss(B, B2, linewidth)
    const peak3 = gauss(B, B3, linewidth)
    const total = peak1 + peak2 + peak3
    return { B, signal: total }
  })

  const maxSignal = Math.max(...specData.map(p => p.signal))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📡 EPR spektr simulyatori (X-band, 9.5 GHz)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-3 text-center font-mono text-xs">
          <p className="text-yellow-400">hν = gμ<sub>B</sub>B → B = hν/(gμ<sub>B</sub>)</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <label className="text-yellow-400 font-bold block mb-1">g₁</label>
            <input type="range" min="1.5" max="4" step="0.01" value={g1}
              onChange={(e) => setG1(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-orange-500" />
            <p className="text-emerald-400 font-mono font-bold">{g1.toFixed(2)}</p>
            <p className="text-purple-400 text-[10px]">B = {B1.toFixed(0)} G</p>
          </div>
          <div>
            <label className="text-yellow-400 font-bold block mb-1">g₂</label>
            <input type="range" min="1.5" max="4" step="0.01" value={g2}
              onChange={(e) => setG2(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-orange-500" />
            <p className="text-emerald-400 font-mono font-bold">{g2.toFixed(2)}</p>
            <p className="text-purple-400 text-[10px]">B = {B2.toFixed(0)} G</p>
          </div>
          <div>
            <label className="text-yellow-400 font-bold block mb-1">g₃</label>
            <input type="range" min="1.5" max="4" step="0.01" value={g3}
              onChange={(e) => setG3(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-orange-500" />
            <p className="text-emerald-400 font-mono font-bold">{g3.toFixed(2)}</p>
            <p className="text-purple-400 text-[10px]">B = {B3.toFixed(0)} G</p>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Linewidth (ΔB):</span>
            <span className="text-emerald-400 font-mono">{linewidth} G</span>
          </label>
          <input type="range" min="10" max="200" step="5" value={linewidth}
            onChange={(e) => setLinewidth(parseFloat(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-orange-500" />
        </div>

        <div className="bg-purple-950/50 rounded-lg p-3">
          <svg viewBox="0 0 400 180" className="w-full h-40 bg-purple-950 rounded">
            <line x1="30" y1="140" x2="390" y2="140" stroke="#4c1d95" strokeWidth="1" />
            <line x1="30" y1="10" x2="30" y2="140" stroke="#4c1d95" strokeWidth="1" />
            <text x="210" y="170" fill="#c4b5fd" fontSize="9" textAnchor="middle">B (Gauss)</text>
            <text x="30" y="155" fill="#a78bfa" fontSize="8">1000</text>
            <text x="390" y="155" fill="#a78bfa" fontSize="8" textAnchor="end">5000</text>

            {/* Peaks */}
            {[B1, B2, B3].map((B, i) => {
              const x = 30 + ((B - 1000) / 4000) * 360
              if (x >= 30 && x <= 390) {
                return (
                  <line key={i} x1={x} y1="10" x2={x} y2="140" stroke="#7c3aed" strokeWidth="0.5" strokeDasharray="2,2" />
                )
              }
              return null
            })}

            <polyline
              points={specData.map((p, i) => {
                const x = 30 + (i / 200) * 360
                const y = 140 - (p.signal / maxSignal) * 120
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#f97316" strokeWidth="2" />
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 K₃[Fe(CN)₆] EPR xulosasi:</p>
          <p className="text-purple-200">
            <strong>g₁ ≠ g₂ ≠ g₃</strong> — <span className="text-orange-400">rombik simmetriya</span>.
            Bu t₂g orbitallarining degeneratsiyasi Yahn-Teller effekti tufayli buzilganini ko'rsatadi.
            g-qiymatlarning 2.00 dan farqi — kuchli <strong>spin-orbital o'zaro ta'sir</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. SOLISHTIRISH JADVALI (K3FeCN6 vs boshqalar)
// ============================================================================
function SolishtirishJadvali() {
  const birikmalar = [
    {
      nomi: "K₃[Fe(CN)₆]",
      holat: "Fe³⁺ (LS, t₂g⁵)",
      S: "1/2",
      n: 1,
      mu_so: "1.73",
      mu_eff: "2.3",
      theta: "−5",
      xulosa: "Spin-orbital hissa"
    },
    {
      nomi: "K₄[Fe(CN)₆]",
      holat: "Fe²⁺ (LS, t₂g⁶)",
      S: "0",
      n: 0,
      mu_so: "0",
      mu_eff: "0",
      theta: "—",
      xulosa: "Diamagnit"
    },
    {
      nomi: "[Fe(H₂O)₆]³⁺",
      holat: "Fe³⁺ (HS, t₂g³eg²)",
      S: "5/2",
      n: 5,
      mu_so: "5.92",
      mu_eff: "5.9",
      theta: "—",
      xulosa: "Ideal spin-only (⁶A₁g)"
    },
    {
      nomi: "[FeF₆]³⁻",
      holat: "Fe³⁺ (HS, t₂g³eg²)",
      S: "5/2",
      n: 5,
      mu_so: "5.92",
      mu_eff: "5.9",
      theta: "kuchsiz −",
      xulosa: "Past maydon ligandi"
    },
    {
      nomi: "[Fe(acac)₃]",
      holat: "Fe³⁺ (HS)",
      S: "5/2",
      n: 5,
      mu_so: "5.92",
      mu_eff: "5.95",
      theta: "—",
      xulosa: "Klassik HS"
    }
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📋 Fe³⁺ komplekslarining magnit xususiyatlari</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-2 px-2 text-yellow-400">Birikma</th>
                <th className="text-left py-2 px-2 text-yellow-400">Holat</th>
                <th className="text-center py-2 px-2 text-yellow-400">S</th>
                <th className="text-center py-2 px-2 text-yellow-400">n</th>
                <th className="text-center py-2 px-2 text-yellow-400">μ<sub>so</sub></th>
                <th className="text-center py-2 px-2 text-yellow-400">μ<sub>eff</sub></th>
                <th className="text-center py-2 px-2 text-yellow-400">θ (K)</th>
                <th className="text-left py-2 px-2 text-yellow-400">Xulosa</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {birikmalar.map((b, i) => (
                <tr key={i} className={`border-b border-purple-800/30 ${b.nomi === "K₃[Fe(CN)₆]" ? "bg-orange-600/10" : ""}`}>
                  <td className="py-2 px-2 font-bold text-emerald-400">{b.nomi}</td>
                  <td className="py-2 px-2">{b.holat}</td>
                  <td className="py-2 px-2 text-center font-mono">{b.S}</td>
                  <td className="py-2 px-2 text-center">{b.n}</td>
                  <td className="py-2 px-2 text-center font-mono">{b.mu_so}</td>
                  <td className="py-2 px-2 text-center font-mono text-orange-400 font-bold">{b.mu_eff}</td>
                  <td className="py-2 px-2 text-center font-mono">{b.theta}</td>
                  <td className="py-2 px-2 text-[10px]">{b.xulosa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-purple-400 text-xs mt-3">
          * Barcha μ qiymatlari μ<sub>B</sub> da. K₃[Fe(CN)₆] diqqatga sazovor — μ<sub>eff</sub> &gt; μ<sub>so</sub>,
          ya'ni orbital momentning hissasi bor.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function K3FeCN6Magnit() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <nav className="flex items-center gap-2 text-sm flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300">Tahlil</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/magnit" className="text-purple-400 hover:text-purple-300">Magnit</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/exafs/birikmalar" className="text-purple-400 hover:text-purple-300">Birikmalar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-orange-400">K₃[Fe(CN)₆]</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🧲 K₃[Fe(CN)₆] — Magnit tahlili</h1>
          <p className="text-purple-400 text-sm">
            Fe³⁺ (LS, d⁵, t₂g⁵) • S=1/2 • Paramagnit • μ<sub>eff</sub> ≈ 2.3 μ<sub>B</sub> • Rombik EPR
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-orange-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-orange-400">K₃[Fe(CN)₆]</span>
            <div>
              <h2 className="text-xl font-bold text-white">Magnit tahlili — to'liq profil</h2>
              <p className="text-purple-400">Qizil qon tuzining magnit xususiyatlari va spektroskopiyasi</p>
            </div>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              K₃[Fe(CN)₆] <strong className="text-orange-400">past spinli (LS) Fe³⁺</strong> kompleksidir.
              Kuchli maydon ligandlari (CN⁻) tufayli <strong>t₂g⁵ konfiguratsiya</strong>ga ega, ya'ni
              <strong> S = 1/2</strong> (bitta toq elektron). Spin-only nazariyasi bo'yicha
              μ<sub>so</sub> = 1.73 μ<sub>B</sub> bo'lishi kerak, ammo <strong>eksperimental μ<sub>eff</sub> ≈ 2.3 μ<sub>B</sub></strong>.
              Bu farq <strong className="text-orange-400">spin-orbital coupling</strong> va
              <strong> Yahn-Teller effekti</strong> tufayli yuzaga keladi — orbital momentning ham hissasi bor.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">S = 1/2</p>
              <p className="text-purple-300">LS, t₂g⁵</p>
              <p className="text-purple-400 mt-1">Paramagnit</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">μ = 2.3 μ<sub>B</sub></p>
              <p className="text-purple-300">298 K da</p>
              <p className="text-purple-400 mt-1">&gt; spin-only</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">θ ≈ −5 K</p>
              <p className="text-purple-300">Curie-Weiss</p>
              <p className="text-purple-400 mt-1">Kuchsiz antiferro</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">g: 2.76, 2.20, 2.00</p>
              <p className="text-purple-300">EPR</p>
              <p className="text-purple-400 mt-1">Rombik simmetriya</p>
            </div>
          </div>
        </div>

        {/* NAZARIY ASOS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">📚 Magnit xususiyatlarning nazariy asoslari</h2>

          <div className="space-y-4 text-sm text-purple-200">
            <div className="bg-purple-950/50 rounded-lg p-4">
              <h4 className="text-orange-400 font-bold mb-2">1. Magnit momentning tarkibi</h4>
              <p className="mb-2">Umumiy magnit moment ikki qismdan iborat:</p>
              <div className="bg-purple-900/40 rounded p-3 font-mono text-xs">
                <p>μ<sub>eff</sub> = g · √[S(S+1)] · μ<sub>B</sub> &nbsp;&nbsp;(spin hissa)</p>
                <p className="text-purple-400 mt-1">+ L·S coupling (orbital hissa)</p>
              </div>
              <p className="mt-2">
                <strong>K₃[Fe(CN)₆]</strong> uchun orbital degeneratsiya (t₂g⁵) mavjud — shuning uchun
                orbital moment to'liq so'nmasdan, μ<sub>eff</sub> ni oshiradi.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-lg p-4">
              <h4 className="text-orange-400 font-bold mb-2">2. Curie va Curie-Weiss qonunlari</h4>
              <p>
                <strong>Ideal paramagnet:</strong> χ = C/T &nbsp;(Curie)<br/>
                <strong>Real tizimlar:</strong> χ = C/(T − θ) &nbsp;(Curie-Weiss)<br/>
                θ &gt; 0 → ferromagnit o'zaro ta'sir<br/>
                θ &lt; 0 → antiferromagnit o'zaro ta'sir<br/>
                <strong>K₃[Fe(CN)₆]: θ ≈ −5 K</strong> — qo'shni molekulalar orqali kuchsiz AF o'zaro ta'sir.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-lg p-4">
              <h4 className="text-orange-400 font-bold mb-2">3. Kotani nazariyasi (t₂g⁵ uchun)</h4>
              <p className="mb-2">
                Kotani (1956) t₂gⁿ konfiguratsiyalar uchun μ<sub>eff</sub>(T) ni aniq hisobladi.
                t₂g⁵ uchun (LS Fe³⁺):
              </p>
              <div className="bg-purple-900/40 rounded p-3 font-mono text-xs">
                <p>μ<sub>eff</sub>(T) = f(kT/λ)</p>
                <p className="text-purple-400">T → ∞: μ<sub>eff</sub> → 1.73 μ<sub>B</sub></p>
                <p className="text-purple-400">T → 0: μ<sub>eff</sub> → 2.1 μ<sub>B</sub> (A'₁/₂ ground state)</p>
              </div>
              <p className="mt-2">
                298 K da kutilayotgan qiymat: <strong>~2.3 μ<sub>B</sub></strong> — eksperimental bilan mos keladi.
              </p>
            </div>
          </div>
        </div>

        {/* INTERAKTIV KOMPONENTLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SpinOnlyCalc />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CurieWeissFit />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <BrillouinSimulator />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EvansCalc />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EPRSpectrum />
        </div>

        {/* SOLISHTIRISH JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SolishtirishJadvali />
        </div>

        {/* EKSPERIMENTAL USULLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">🔬 Eksperimental usullar</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-700/30">
              <h4 className="text-orange-400 font-bold mb-2">⚖️ Gouy usuli</h4>
              <p className="text-xs text-purple-200 mb-2">
                Namunani tortish kuchi maydonidagi o'zgarish orqali o'lchash.
                Δm = χ · (H² − H₀²) · A / (2g)
              </p>
              <ul className="text-xs text-purple-300 space-y-1">
                <li>✓ Arzon, klassik</li>
                <li>✗ Ko'p namuna kerak (~100 mg)</li>
                <li>✗ Sezgirligi past</li>
              </ul>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-700/30">
              <h4 className="text-orange-400 font-bold mb-2">🎯 Faraday usuli</h4>
              <p className="text-xs text-purple-200 mb-2">
                Gradientli maydonda namunaning kuchi o'lchanadi.
                F = χ · m · H · (dH/dz)
              </p>
              <ul className="text-xs text-purple-300 space-y-1">
                <li>✓ Kamroq namuna (1-10 mg)</li>
                <li>✓ Yuqori aniqlik</li>
                <li>✗ Murakkab apparat</li>
              </ul>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-700/30">
              <h4 className="text-orange-400 font-bold mb-2">🌡️ SQUID magnitometr</h4>
              <p className="text-xs text-purple-200 mb-2">
                Superconducting Quantum Interference Device — eng zamonaviy va sezgir.
                10⁻⁸ emu gacha sezgirlik, 1.8-400 K haroratda.
              </p>
              <ul className="text-xs text-purple-300 space-y-1">
                <li>✓ Eng sezgir</li>
                <li>✓ χ(T), M(H), ZFC/FC</li>
                <li>✗ Juda qimmat</li>
              </ul>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-700/30">
              <h4 className="text-orange-400 font-bold mb-2">🧲 Evans usuli (NMR)</h4>
              <p className="text-xs text-purple-200 mb-2">
                NMR spektrometr orqali. Eritma ichidagi TMS signalining siljishi o'lchanadi.
                μ<sub>eff</sub> = 0.061·√(Δf·T / c·f₀)
              </p>
              <ul className="text-xs text-purple-300 space-y-1">
                <li>✓ Oddiy NMR yetarli</li>
                <li>✓ Tez va oson</li>
                <li>✗ Faqat eritmalarda</li>
              </ul>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>K₃[Fe(CN)₆] — <strong className="text-orange-400">paramagnit</strong>, past spinli (LS, t₂g⁵, S=1/2)</li>
            <li>Spin-only μ<sub>so</sub> = <strong>1.73 μ<sub>B</sub></strong>, eksperimental μ<sub>eff</sub> ≈ <strong>2.3 μ<sub>B</sub></strong></li>
            <li>Farq <strong>spin-orbital coupling</strong> (λ ≠ 0) va <strong>Kotani effekti</strong> tufayli</li>
            <li>Curie-Weiss θ ≈ <strong>−5 K</strong> — kuchsiz antiferromagnit o'zaro ta'sir</li>
            <li>EPR: <strong>rombik simmetriya</strong> (g₁=2.76, g₂=2.20, g₃=2.00) — Yahn-Teller buzilishi</li>
            <li>Evans usuli NMR orqali μ<sub>eff</sub> ni <strong>tez va arzon</strong> aniqlash imkonini beradi</li>
            <li>K₄[Fe(CN)₆] (Fe²⁺, t₂g⁶) — <strong>diamagnit</strong> (μ = 0), magnit tahlil uchun ideal kontrol namunadir</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/magnit" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← Magnit tahlili
          </Link>
          <Link href="/ilmiy/tahlil/exafs/birikmalar/k3-fe-cn6" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">
            EXAFS/XANES →
          </Link>
        </div>

      </section>
    </main>
  )
}