"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. SPIN-ONLY KALKULYATORI (Co²⁺ d⁷ HS)
// ============================================================================
function SpinOnlyCalc() {
  const [n, setN] = useState(3)
  const mu_so = Math.sqrt(n * (n + 2))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Spin-only magnit momenti</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-2">Formula:</p>
          <p className="text-yellow-400 text-xl">μ<sub>so</sub> = √[n(n+2)] μ<sub>B</sub></p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-2">
            <span className="text-yellow-400 font-bold">Toq elektronlar soni (n):</span>
            <span className="text-emerald-400 font-mono text-lg">{n}</span>
          </label>
          <input type="range" min="0" max="7" step="1" value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-blue-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Hisoblash</p>
            <p className="text-purple-200 font-mono">√({n}·{n + 2})</p>
          </div>
          <div className="bg-blue-900/40 border border-blue-500/40 rounded-lg p-3">
            <p className="text-blue-400">Natija</p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{mu_so.toFixed(3)} μ<sub>B</sub></p>
          </div>
        </div>

        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-3 text-xs">
          <p className="text-emerald-400 font-bold mb-1">✅ [CoCl₄]²⁻ uchun:</p>
          <p className="text-purple-200">
            Co²⁺ (d⁷) tetraedrik maydonda — <strong>yuqori spin (HS)</strong>.
            Konfiguratsiya: <strong>e⁴ t₂³</strong> (tetraedrikda teskari tartib).
            Toq elektronlar: <strong>n = 3</strong>, S = 3/2.
            Spin-only: μ<sub>so</sub> = <strong>3.87 μ<sub>B</sub></strong>.
            Ammo eksperimental: <strong>4.3–5.2 μ<sub>B</sub></strong> — orbital moment hissasi katta!
          </p>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun μ<sub>eff</sub> &gt; μ<sub>so</sub>?</p>
          <p className="text-purple-200">
            Tetraedrik d⁷ da <strong>ground state ⁴A₂</strong> — orbital moment to'liq so'nmagan.
            <strong> Spin-orbital coupling</strong> tufayli orbital moment qisman saqlanadi.
            Natijada μ<sub>eff</sub> = g·√[S(S+1)] da <strong>g &gt; 2</strong> (odatda 2.1–2.3).
            Bu Co²⁺ ning <strong>o'ziga xos xususiyati</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. TETRAEDRIK KRISTALL MAYDON (interaktiv)
// ============================================================================
function TetraedralKritsallMaydon() {
  const [Dq, setDq] = useState(3500) // Δ_t cm⁻¹
  const [P, setP] = useState(22000) // juftlanish energiyasi

  // Tetraedrik d⁷: e⁴ t₂³
  // LFSE = -0.6·Δ_t (d⁷ HS uchun)
  const LFSE = -0.6 * Dq

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 Tetraedrik kristall maydon — Co²⁺ (d⁷)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 Tetraedrik maydon — har doim yuqori spin!</p>
          <p className="text-purple-200 text-xs">
            Tetraedrik maydon kuchi oktaedrikka nisbatan <strong>4/9 marta kuchsiz</strong>.
            Shuning uchun deyarli barcha tetraedrik komplekslar <strong>yuqori spinli (HS)</strong>.
            [CoCl₄]²⁻ — buning klassik namunasi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-blue-400 font-bold mb-3">Tetraedrik diagramma (d⁷ HS)</h4>
            <div className="font-mono text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-purple-700/30 pb-2">
                <span className="text-red-400 w-24">t₂ (yuqori)</span>
                <div className="flex gap-2">
                  <span className="text-yellow-400">↑</span>
                  <span className="text-yellow-400">↑</span>
                  <span className="text-yellow-400">↑↓</span>
                </div>
                <span className="text-red-400">3 e⁻</span>
              </div>

              <div className="text-center text-blue-400 text-[10px] py-1">
                Δ<sub>t</sub> = {Dq.toLocaleString()} cm⁻¹
              </div>

              <div className="flex justify-between items-center border-t border-purple-700/30 pt-2">
                <span className="text-emerald-400 w-24">e (pastki)</span>
                <div className="flex gap-2">
                  <span className="text-yellow-400">↑↓</span>
                  <span className="text-yellow-400">↑↓</span>
                </div>
                <span className="text-emerald-400">4 e⁻</span>
              </div>

              <div className="bg-blue-900/30 border border-blue-500/30 rounded p-2 text-center mt-3">
                <p className="text-[10px] text-purple-300">Konfiguratsiya:</p>
                <p className="text-blue-400 font-bold">e⁴ t₂³</p>
                <p className="text-[10px] text-purple-400 mt-1">S = 3/2 | n = 3</p>
                <p className="text-[10px] text-purple-400 mt-1">⁴A₂ ground state</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5 space-y-3">
            <h4 className="text-blue-400 font-bold">Energiya tahlili</h4>

            <div className="bg-purple-900/50 rounded-lg p-3 text-xs">
              <div className="flex justify-between">
                <span className="text-purple-400">Δ<sub>t</sub>:</span>
                <span className="text-emerald-400 font-mono">{Dq.toLocaleString()} cm⁻¹</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-purple-400">P (juftlanish):</span>
                <span className="text-emerald-400 font-mono">{P.toLocaleString()} cm⁻¹</span>
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t border-purple-700/50">
                <span className="text-purple-400">Δ<sub>t</sub> vs P:</span>
                <span className="text-blue-400 font-bold">
                  Δ<sub>t</sub> &lt; P → HS
                </span>
              </div>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3 text-xs">
              <p className="text-yellow-400 font-bold mb-1">LFSE:</p>
              <p className="text-emerald-400 font-mono font-bold text-lg">
                {LFSE.toLocaleString()} cm⁻¹
              </p>
              <p className="text-purple-400 text-[10px] mt-1">
                ≈ {(Math.abs(LFSE) * 1.2e-4 * 96.485).toFixed(1)} kJ/mol
              </p>
              <p className="text-purple-400 text-[10px]">
                (oktaedrikka nisbatan ancha kichik!)
              </p>
            </div>

            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400">Δ<sub>t</sub> (sm⁻¹):</span>
                <span className="text-emerald-400 font-mono">{Dq}</span>
              </label>
              <input type="range" min="2000" max="8000" step="100" value={Dq}
                onChange={(e) => setDq(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
            </div>
          </div>
        </div>

        {/* OKTAEDRIK VS TETRAEDRIK SOLISHTIRISH */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-blue-400 font-bold text-xs mb-3">Oktaedrik vs Tetraedrik:</h5>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-purple-900/50 rounded p-3">
              <p className="text-emerald-400 font-bold mb-1">[Co(H₂O)₆]²⁺</p>
              <p className="text-purple-200">Oktaedrik (HS)</p>
              <p className="text-purple-200">t₂g⁵ e<sub>g</sub>²</p>
              <p className="text-purple-200">Δ<sub>o</sub> ≈ 9300 cm⁻¹</p>
              <p className="text-pink-400 font-bold mt-1">Pushti rang</p>
            </div>
            <div className="bg-purple-900/50 rounded p-3">
              <p className="text-blue-400 font-bold mb-1">[CoCl₄]²⁻</p>
              <p className="text-purple-200">Tetraedrik (HS)</p>
              <p className="text-purple-200">e⁴ t₂³</p>
              <p className="text-purple-200">Δ<sub>t</sub> ≈ 3500 cm⁻¹</p>
              <p className="text-blue-400 font-bold mt-1">Ko'k rang</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun tetraedrik maydon kuchsiz?</p>
          <p className="text-purple-200">
            <strong>Δ<sub>t</sub> = 4/9 · Δ<sub>o</sub></strong> — faqat 4 ta ligand (6 emas),
            va ular ligandlar orasidagi burchakka qaratilmagan.
            Shuning uchun <strong>Δ<sub>t</sub> &lt; P</strong> deyarli har doim →
            <strong> yuqori spin</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. 3D TETRAEDR VIZUALIZATSIYA
// ============================================================================
function Tetraedr3D() {
  const [rotate, setRotate] = useState(0)

  // Tetraedr burchaklari (4 ta Cl)
  const clPositions = [
    { x: 0, y: -1, z: 0 },      // yuqori
    { x: 0.943, y: 0.333, z: 0 },  // old
    { x: -0.471, y: 0.333, z: 0.816 }, // chap-orqa
    { x: -0.471, y: 0.333, z: -0.816 } // o'ng-orqa
  ]

  // 3D → 2D projection (aylanish bilan)
  const project = (p, angle) => {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const x = p.x * cos - p.z * sin
    const z = p.x * sin + p.z * cos
    return {
      x: 200 + x * 80,
      y: 140 + p.y * 80,
      z: z // chuqurlik
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 Tetraedrik geometriya — 3D ko'rinish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Aylantirish burchagi:</span>
            <span className="text-emerald-400 font-mono">{rotate}°</span>
          </label>
          <input type="range" min="0" max="360" step="5" value={rotate}
            onChange={(e) => setRotate(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 280" className="w-full h-64">
            {/* Markaziy Co */}
            <circle cx="200" cy="140" r="20" fill="#3b82f6" />
            <text x="200" y="146" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">Co²⁺</text>

            {/* Cl ligandlar */}
            {clPositions.map((p, i) => {
              const proj = project(p, rotate * Math.PI / 180)
              const size = 14 + proj.z * 3 // chuqurlikka qarab o'lcham
              return (
                <g key={i}>
                  <line x1="200" y1="140" x2={proj.x} y2={proj.y}
                    stroke="#10b981" strokeWidth="2" opacity="0.7" />
                  <circle cx={proj.x} cy={proj.y} r={size} fill="#10b981" opacity="0.9" />
                  <text x={proj.x} y={proj.y + 4} fill="white" fontSize="10"
                    textAnchor="middle" fontWeight="bold">Cl⁻</text>
                </g>
              )
            })}

            {/* Burchak ko'rsatkichi */}
            <text x="200" y="265" fill="#c4b5fd" fontSize="10" textAnchor="middle">
              Cl−Co−Cl burchagi = 109.5° (tetraedrik)
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Koordinatsion son</p>
            <p className="text-blue-400 font-bold text-lg">4</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Burchak</p>
            <p className="text-blue-400 font-bold text-lg">109.5°</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Simmetriya</p>
            <p className="text-blue-400 font-bold text-lg">T<sub>d</sub></p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Tetraedrik burchak:</p>
          <p className="text-purple-200">
            Tetraedrda barcha <strong>Cl−Co−Cl burchaklari 109.5°</strong> (arccos(−1/3)).
            Bu <strong>eng optimal joylashuv</strong> — 4 ta ligand bir-biridan maksimal masofada.
            sp³ gibridlanishga mos keladi (lekin d¹⁰ emas, balki d⁷ uchun).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. UV-VIS SPEKTRI — KO'K RANG SABABI
// ============================================================================
function UVVisSpektr() {
  const [lambdaMax, setLambdaMax] = useState(650)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌈 UV-Vis spektri — ko'k rang sababi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">λ<sub>max</sub>:</span>
            <span className="text-emerald-400 font-mono">{lambdaMax} nm</span>
          </label>
          <input type="range" min="500" max="800" step="5" value={lambdaMax}
            onChange={(e) => setLambdaMax(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="170" x2="380" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <text x="210" y="195" fill="#c4b5fd" fontSize="10" textAnchor="middle">λ (nm)</text>
            <text x="15" y="95" fill="#c4b5fd" fontSize="9" transform="rotate(-90, 15, 95)">A</text>

            {[400, 500, 600, 700, 800].map((wl, i) => (
              <text key={i} x={40 + ((wl - 350) / 500) * 340} y="185" fill="#a78bfa" fontSize="8" textAnchor="middle">
                {wl}
              </text>
            ))}

            {/* Rang spektri */}
            <defs>
              <linearGradient id="spectrum" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b00ff" />
                <stop offset="20%" stopColor="#0000ff" />
                <stop offset="40%" stopColor="#00ff00" />
                <stop offset="60%" stopColor="#ffff00" />
                <stop offset="80%" stopColor="#ff8800" />
                <stop offset="100%" stopColor="#ff0000" />
              </linearGradient>
            </defs>
            <rect x="40" y="165" width="340" height="5" fill="url(#spectrum)" opacity="0.3" />

            {/* 3 ta cho'qqi (tetraedrik d⁷) */}
            <polyline
              points={Array.from({ length: 100 }, (_, i) => {
                const wl = 400 + i * 5
                const x = 40 + ((wl - 350) / 500) * 340
                const p1 = Math.exp(-0.5 * Math.pow((wl - lambdaMax) / 50, 2)) * 100
                const p2 = Math.exp(-0.5 * Math.pow((wl - 580) / 40, 2)) * 60
                const p3 = Math.exp(-0.5 * Math.pow((wl - 1400) / 100, 2)) * 40
                const y = 170 - (p1 + p2 + p3)
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#3b82f6" strokeWidth="2" />

            <line x1={40 + ((lambdaMax - 350) / 500) * 340} y1="70" x2={40 + ((lambdaMax - 350) / 500) * 340} y2="25" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((lambdaMax - 350) / 500) * 340} y="20" fill="#f59e0b" fontSize="9" textAnchor="middle" fontWeight="bold">
              {lambdaMax} nm
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">{lambdaMax} nm</p>
            <p className="text-purple-200">⁴A₂ → ⁴T₁(P)</p>
            <p className="text-purple-400 text-[10px]">ε ≈ 500 M⁻¹cm⁻¹</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">580 nm</p>
            <p className="text-purple-200">⁴A₂ → ⁴T₁(F)</p>
            <p className="text-purple-400 text-[10px]">ε ≈ 20 M⁻¹cm⁻¹</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">~1400 nm</p>
            <p className="text-purple-200">⁴A₂ → ⁴T₂</p>
            <p className="text-purple-400 text-[10px]">IR sohada</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun ko'k rang?</p>
          <p className="text-purple-200">
            {lambdaMax} nm — <strong>qizil-to'q sariq</strong> sohada yutilish.
            Komplementar rang — <strong className="text-blue-400">ko'k</strong>!
            Tetraedrik komplekslarda <strong>ε katta</strong> (oktaedrikka nisbatan) —
            sababi: <strong>Laporte taqiqi qisman buzilgan</strong> (markaziy simmetriya yo'q).
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-blue-400 font-bold text-xs mb-2">Solvatoxromizm — rang o'zgarishi:</h5>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="text-left py-1 text-yellow-400">Eritma</th>
                  <th className="text-center py-1 text-yellow-400">Geometriya</th>
                  <th className="text-left py-1 text-yellow-400">Rang</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  ["CoCl₂ suvda", "Oktaedrik [Co(H₂O)₆]²⁺", "Pushti"],
                  ["CoCl₂ etanol", "Aralash", "Pushti-ko'k"],
                  ["CoCl₂ kons. HCl", "Tetraedrik [CoCl₄]²⁻", "Ko'k"],
                  ["CoCl₂ asetonda", "Tetraedrik", "Ko'k"],
                ].map((r, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${i === 2 ? 'bg-blue-600/10' : ''}`}>
                    <td className="py-1 font-bold">{r[0]}</td>
                    <td className="py-1 text-center text-[11px]">{r[1]}</td>
                    <td className="py-1">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. CURIE-WEISS QONUNI
// ============================================================================
function CurieWeiss() {
  const [C, setC] = useState(2.4)
  const [theta, setTheta] = useState(-10)

  const { chiData, invChiData } = useMemo(() => {
    const chi = []
    const inv = []
    for (let T = 5; T <= 300; T += 2) {
      const chiVal = C / (T - theta)
      chi.push({ T, chi: chiVal })
      inv.push({ T, inv: 1 / chiVal })
    }
    return { chiData: chi, invChiData: inv }
  }, [C, theta])

  const mu_eff = Math.sqrt(8 * C)
  const maxChi = Math.max(...chiData.map(p => p.chi))
  const maxInv = Math.max(...invChiData.map(p => p.inv))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📈 Curie-Weiss qonuni — χ(T)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="space-y-3">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">C:</span>
              <span className="text-emerald-400 font-mono">{C.toFixed(2)} emu·K/mol</span>
            </label>
            <input type="range" min="1" max="4" step="0.05" value={C}
              onChange={(e) => setC(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">θ:</span>
              <span className={`font-mono font-bold ${theta > 0 ? 'text-red-400' : theta < 0 ? 'text-blue-400' : 'text-purple-400'}`}>
                {theta.toFixed(1)} K
              </span>
            </label>
            <input type="range" min="-50" max="50" step="1" value={theta}
              onChange={(e) => setTheta(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-3 text-center font-mono text-sm">
          <p className="text-purple-300">μ<sub>eff</sub> = √(8C) = <span className="text-emerald-400 font-bold">{mu_eff.toFixed(2)} μ<sub>B</sub></span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <h5 className="text-blue-400 font-bold text-xs mb-2">χ vs T</h5>
            <svg viewBox="0 0 300 180" className="w-full h-36 bg-purple-950 rounded">
              <line x1="35" y1="150" x2="290" y2="150" stroke="#4c1d95" strokeWidth="1" />
              <line x1="35" y1="10" x2="35" y2="150" stroke="#4c1d95" strokeWidth="1" />
              <text x="160" y="175" fill="#c4b5fd" fontSize="9" textAnchor="middle">T (K)</text>
              <text x="10" y="80" fill="#c4b5fd" fontSize="8" transform="rotate(-90, 10, 80)">χ</text>
              <polyline
                points={chiData.map(p => {
                  const x = 35 + (p.T / 300) * 255
                  const y = 150 - (p.chi / maxChi) * 130
                  return `${x},${y}`
                }).join(' ')}
                fill="none" stroke="#3b82f6" strokeWidth="2" />
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-3">
            <h5 className="text-emerald-400 font-bold text-xs mb-2">1/χ vs T</h5>
            <svg viewBox="0 0 300 180" className="w-full h-36 bg-purple-950 rounded">
              <line x1="35" y1="150" x2="290" y2="150" stroke="#4c1d95" strokeWidth="1" />
              <line x1="35" y1="10" x2="35" y2="150" stroke="#4c1d95" strokeWidth="1" />
              <text x="160" y="175" fill="#c4b5fd" fontSize="9" textAnchor="middle">T (K)</text>
              <text x="10" y="80" fill="#c4b5fd" fontSize="8" transform="rotate(-90, 10, 80)">1/χ</text>

              {theta >= 0 && theta <= 300 && (
                <circle cx={35 + (theta / 300) * 255} cy="150" r="3" fill="#f97316" />
              )}

              <polyline
                points={invChiData.map(p => {
                  const x = 35 + (p.T / 300) * 255
                  const y = 150 - (p.inv / maxInv) * 130
                  return `${x},${y}`
                }).join(' ')}
                fill="none" stroke="#10b981" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 [CoCl₄]²⁻ uchun:</p>
          <p className="text-purple-200">
            θ ≈ <strong>−10 K</strong> — o'rtacha <strong>antiferromagnit</strong> o'zaro ta'sir.
            μ<sub>eff</sub> ≈ <strong>4.8 μ<sub>B</sub></strong> — spin-only (3.87) dan ancha yuqori.
            Bu orbital momentning hissasi katta ekanligini ko'rsatadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. EPR SPEKTRI (Co²⁺ — murakkab)
// ============================================================================
function EPRSpectrum() {
  const [g, setG] = useState(2.2)

  const B = 3400 / g

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📡 EPR spektri — Co²⁺ (murakkab holat)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">⚠️ Co²⁺ EPR — qiyin!</p>
          <p className="text-purple-200 text-xs">
            Co²⁺ (d⁷, S=3/2) — <strong>EPR uchun qiyin obyekt</strong>. Sabablari:
            <br/>• <strong>I = 7/2</strong> (⁵⁹Co, 100% tabiiy) — 8 ta hiperfin cho'qqi
            <br/>• <strong>Katta spin-orbital coupling</strong> — keng cho'qqilar
            <br/>• <strong>Zero-field splitting</strong> (D ≠ 0) — S &gt; 1/2
            <br/>• Tez relaksatsiya — xona haroratida ko'rinmaydi
          </p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">g<sub>o'rtacha</sub>:</span>
            <span className="text-emerald-400 font-mono">{g.toFixed(2)}</span>
          </label>
          <input type="range" min="2.0" max="2.5" step="0.01" value={g}
            onChange={(e) => setG(parseFloat(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">g</p>
            <p className="text-blue-400 font-bold font-mono">{g.toFixed(2)}</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">B (G)</p>
            <p className="text-yellow-400 font-bold font-mono">{B.toFixed(0)}</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">I (⁵⁹Co)</p>
            <p className="text-emerald-400 font-bold font-mono">7/2</p>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-blue-400 font-bold text-xs mb-2">EPR spektri (sxematik):</h5>
          <svg viewBox="0 0 400 180" className="w-full h-40">
            <line x1="40" y1="140" x2="360" y2="140" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="140" stroke="#4c1d95" strokeWidth="1" />
            <text x="200" y="170" fill="#c4b5fd" fontSize="9" textAnchor="middle">B (Gauss)</text>

            {/* 8 ta hiperfin cho'qqi (I=7/2) */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
              const B_peak = B + (i - 3.5) * 80
              const x = 40 + ((B_peak - 2000) / 3000) * 320
              if (x < 40 || x > 360) return null
              return (
                <g key={i}>
                  <polyline
                    points={`${x-6},100 ${x-3},115 ${x},70 ${x+3},115 ${x+6},100`}
                    fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                </g>
              )
            })}

            <text x="200" y="15" fill="#3b82f6" fontSize="9" textAnchor="middle" fontWeight="bold">
              8 cho'qqi (I = 7/2)
            </text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun 8 cho'qqi?</p>
          <p className="text-purple-200">
            ⁵⁹Co yadrosi <strong>I = 7/2</strong> spinli (100% tabiiy).
            Gipertfin o'zaro ta'sir natijasida <strong>2I+1 = 8 ta cho'qqi</strong> hosil bo'ladi.
            Cho'qqilar orasidagi masofa — <strong>A (hiperfin konstantasi)</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. OKTAEDRIK VS TETRAEDRIK SOLISHTIRISH
// ============================================================================
function OktahedrikVsTetraedrik() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Oktaedrik vs Tetraedrik — Co²⁺</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-pink-400">[Co(H₂O)₆]²⁺</th>
                <th className="text-center py-3 px-2 text-blue-400">[CoCl₄]²⁻</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Geometriya", "Oktaedrik", "Tetraedrik"],
                ["Koordinatsion son", "6", "4"],
                ["Konfiguratsiya", "t₂g⁵ e_g²", "e⁴ t₂³"],
                ["Maydon kuchi", "Δ_o = 9300 cm⁻¹", "Δ_t = 3500 cm⁻¹"],
                ["Spin holati", "Yuqori spin", "Yuqori spin"],
                ["Toq elektron (n)", "3", "3"],
                ["Ground state", "⁴T₁g", "⁴A₂"],
                ["μ_eff", "~4.8 μ_B", "~4.6 μ_B"],
                ["Rang", "Pushti", "Ko'k"],
                ["λ_max", "~510 nm", "~650 nm"],
                ["ε (M⁻¹cm⁻¹)", "~10 (Laporte taqiqlangan)", "~500 (Laporte ruxsat)"],
                ["Simmetriya", "O_h", "T_d"],
                ["EPR", "Keng, murakkab", "Aniqroq"],
                ["Mössbauer", "δ ≈ 1.2 mm/s", "δ ≈ 0.8 mm/s"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-pink-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-blue-400">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-purple-400 text-xs mt-3">
          * Bir xil metall (Co²⁺), bir xil d⁷, bir xil spin — lekin <strong>butunlay boshqa xossalar</strong>!
          Geometriya o'zgarganda rang, intensivlik, EPR, barchasi o'zgaradi.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// 8. SOLVATOXROMIZM (interaktiv)
// ============================================================================
function Solvatoxromizm() {
  const [solvent, setSolvent] = useState("suv")

  const solvents = {
    suv: {
      name: "Suv (H₂O)",
      geometry: "Oktaedrik",
      complex: "[Co(H₂O)₆]²⁺",
      color: "Pushti",
      colorHex: "#ec4899",
      delta: 9300,
      izoh: "Kuchli ligand → oktaedrik"
    },
    etanol: {
      name: "Etanol",
      geometry: "Aralash",
      complex: "[Co(H₂O)₆₋ₙ(EtOH)ₙ]²⁺",
      color: "Pushti-binafsha",
      colorHex: "#a855f7",
      delta: 8000,
      izoh: "O'tish holati"
    },
    hcl: {
      name: "Kons. HCl",
      geometry: "Tetraedrik",
      complex: "[CoCl₄]²⁻",
      color: "Ko'k",
      colorHex: "#3b82f6",
      delta: 3500,
      izoh: "Cl⁻ kuchli → tetraedrik"
    },
    aseton: {
      name: "Aseton",
      geometry: "Tetraedrik",
      complex: "[CoCl₄]²⁻",
      color: "Ko'k",
      colorHex: "#1d4ed8",
      delta: 3500,
      izoh: "Aprotik erituvchi"
    }
  }

  const s = solvents[solvent]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🎨 Solvatoxromizm — erituvchi ta'sirida rang o'zgarishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">🌈 Hayratlanarli hodisa:</p>
          <p className="text-purple-200 text-xs">
            CoCl₂ ni turli erituvchilarda eritganda, <strong>har xil rang</strong> hosil bo'ladi!
            Bu <strong>solvatoxromizm</strong> deb ataladi. Sababi: erituvchi ligand sifatida ishtirok etib,
            kompleksning geometriyasini o'zgartiradi.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(solvents).map(([key, val]) => (
            <button key={key} onClick={() => setSolvent(key)}
              className={`px-2 py-3 rounded-lg text-[10px] font-bold transition-all ${
                solvent === key
                  ? "bg-blue-600/80 text-white shadow-lg"
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              <div className="text-xs mb-1">{val.name}</div>
              <div className="text-[9px] opacity-80">{val.geometry}</div>
            </button>
          ))}
        </div>

        <div className="bg-purple-950/50 rounded-xl p-5">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white/20"
              style={{backgroundColor: s.colorHex}}></div>
            <div>
              <h4 className="text-white font-bold text-lg">{s.color}</h4>
              <p className="text-purple-400 text-sm">{s.complex}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs text-center">
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">Geometriya</p>
              <p className="text-blue-400 font-bold">{s.geometry}</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">Δ (sm⁻¹)</p>
              <p className="text-emerald-400 font-mono font-bold">{s.delta}</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">Izoh</p>
              <p className="text-purple-200 text-[10px]">{s.izoh}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun rang o'zgaradi?</p>
          <p className="text-purple-200">
            Suvda: H₂O <strong>kuchli ligand</strong> → oktaedrik → Δ<sub>o</sub> katta →
            λ<sub>max</sub> qisqa (510 nm, yashil yutilish) → <strong>pink rang</strong>.
            <br/>
            HCl da: Cl⁻ <strong>kuchsiz ligand</strong>, lekin 4 ta → tetraedrik → Δ<sub>t</sub> kichik →
            λ<sub>max</sub> uzun (650 nm, qizil yutilish) → <strong>ko'k rang</strong>.
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-blue-400 font-bold text-xs mb-2">Ranglar spektri:</h5>
          <div className="flex gap-1 h-8 rounded overflow-hidden">
            {Object.entries(solvents).map(([key, val]) => (
              <div key={key}
                className={`flex-1 flex items-center justify-center text-[10px] font-bold text-white ${solvent === key ? 'ring-2 ring-yellow-400' : ''}`}
                style={{backgroundColor: val.colorHex}}>
                {val.color}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 9. TARIXIY KONTEKST
// ============================================================================
function TarixiyKontekst() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst</h3>

      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-5 border border-blue-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">1735 — Brandt</p>
                <p className="text-purple-200 text-xs mt-1">
                  Shveytsariyalik kimyogar <strong>Georg Brandt</strong> kobaltni kashf etdi.
                  "Kobold" (nemischa — "ruh, goblin") — chunki kobalt rudalari zaharli va
                  eritish qiyin edi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🎨</div>
              <div>
                <p className="text-yellow-400 font-bold">1700-1800 — Ko'k pigmentlar</p>
                <p className="text-purple-200 text-xs mt-1">
                  Co²⁺ komplekslari <strong>ko'k pigmentlar</strong> sifatida ishlatilgan.
                  "Kobalt ko'k" (CoAl₂O₄) — eng qadimgi va barqaror pigmentlardan biri.
                  Xitoy, Misr, Rim madaniyatlarida ishlatilgan.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1950-60 — Kristall maydon nazariyasi</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>John Belslab, Yukio Tanabe, Sugano</strong> — tetraedrik va oktaedrik
                  komplekslarning elektron spektrlarini tushuntirishdi.
                  [CoCl₄]²⁻ — <strong>tanabe-sugano d⁷ diagrammasi</strong>ning klassik namunasi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💎</div>
              <div>
                <p className="text-yellow-400 font-bold">1960-70 — Solvatoxromizm</p>
                <p className="text-purple-200 text-xs mt-1">
                  [CoCl₄]²⁻ ning <strong>rang o'zgarishi</strong> erituvchi ta'sirini o'rganishda
                  klassik namuna bo'ldi. Bu hodisa <strong>ligand maydoni kuchiga</strong>
                  bevosita bog'liqligini ko'rsatdi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Co²⁺ ning o'ziga xosligi:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Geometriya o'zgaruvchan</strong> — oktaedrik ↔ tetraedrik</li>
            <li><strong>Rang o'zgaruvchan</strong> — pushti ↔ ko'k</li>
            <li><strong>Orbital moment hissasi katta</strong> — μ<sub>eff</sub> &gt; μ<sub>so</sub></li>
            <li><strong>Vitamin B₁₂</strong> — tabiatdagi yagona Co birikmasi</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 10. AMALIY QO'LLANILISH
// ============================================================================
function AmaliyQollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 Amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🎨</div>
            <h4 className="text-blue-400 font-bold mb-2">Pigmentlar va bo'yoqlar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Kobalt ko'k</strong> (CoAl₂O₄)</li>
              <li>Keramik glazurlar</li>
              <li>Shisha bo'yoqlari</li>
              <li>Rassomlik bo'yoqlari</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚗️</div>
            <h4 className="text-blue-400 font-bold mb-2">Katalizatorlar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Fischer-Tropsch</strong> sintezi</li>
              <li>Neftni qayta ishlash</li>
              <li>Polimerizatsiya</li>
              <li>Organik sintez</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔋</div>
            <h4 className="text-blue-400 font-bold mb-2">Batareyalar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Li-ion</strong> batareyalar (katod)</li>
              <li>LiCoO₂ — eng keng tarqalgan</li>
              <li>Ni-MH batareyalar</li>
              <li>Elektr mashinalar</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💊</div>
            <h4 className="text-blue-400 font-bold mb-2">Tibbiyot</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Vitamin B₁₂</strong> (kobalamin)</li>
              <li>Qon hosil bo'lishi</li>
              <li>Nerv sistemasi</li>
              <li>DNA sintezi</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🧲</div>
            <h4 className="text-blue-400 font-bold mb-2">Magnit materiallar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>SmCo₅</strong> — doimiy magnitlar</li>
              <li>Qattiq disklar</li>
              <li>Elektr motorlar</li>
              <li>Generatorlar</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-blue-400 font-bold mb-2">Indikatorlar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Suv indikatori</strong> (ko'k ↔ pushti)</li>
              <li>Silikagel (ko'k — quruq)</li>
              <li>Kimyoviy sensorlar</li>
              <li>Harorat indikatori</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-400 font-bold mb-2">🌟 Qiziqarli faktlar:</p>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• CoCl₂ · 6H₂O — <strong>pink</strong>, susiz CoCl₂ — <strong>ko'k</strong></li>
            <li>• <strong>Silikagel</strong> (qurituvchi) tarkibida CoCl₂ bor — ko'k → pushti = suv bor</li>
            <li>• <strong>"Ko'k rang" testi</strong> — suvni aniqlashning oddiy usuli</li>
            <li>• Co — <strong>strategik metall</strong> (Kongo 60%+ ishlab chiqarish)</li>
            <li>• Li-ion batareyalar — <strong>zamonaviy texnologiyaning asosi</strong></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function CoCl4Magnit() {
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
          <Link href="/ilmiy/tahlil/magnit/birikmalar" className="text-purple-400 hover:text-purple-300">Birikmalar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-blue-400">[CoCl₄]²⁻</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🧲 [CoCl₄]²⁻ — Magnit tahlili</h1>
          <p className="text-purple-400 text-sm">
            Co²⁺ (d⁷, HS, tetraedrik) • Paramagnit • μ<sub>eff</sub> ≈ 4.6 μ<sub>B</sub> • Ko'k rang
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-blue-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-2xl md:text-4xl font-extrabold font-mono text-blue-400">[CoCl₄]²⁻</span>
            <div>
              <h2 className="text-xl font-bold text-white">Magnit tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Tetraxlorokobaltat(II)" — tetraedrik klassika</p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [CoCl₄]²⁻ — <strong className="text-blue-400">tetraedrik geometriyali</strong> klassik kompleks.
              Co²⁺ (d⁷) tetraedrik maydonda <strong>yuqori spin (HS)</strong> holatida — barcha
              tetraedrik komplekslar kabi. Konfiguratsiya: <strong>e⁴ t₂³</strong>, 3 ta toq elektron,
              <strong> S = 3/2</strong>. μ<sub>eff</sub> ≈ <strong>4.6 μ<sub>B</sub></strong> —
              spin-only (3.87) dan ancha yuqori (orbital moment hissasi katta).
              Kompleks <strong className="text-blue-400">ko'k rangli</strong> — solvatoxromizm klassikasi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">d⁷, S=3/2</p>
              <p className="text-purple-300">HS, tetraedrik</p>
              <p className="text-purple-400 mt-1">Paramagnit</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">μ ≈ 4.6 μ<sub>B</sub></p>
              <p className="text-purple-300">n = 3</p>
              <p className="text-purple-400 mt-1">&gt; spin-only</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">Δ<sub>t</sub> = 3500</p>
              <p className="text-purple-300">sm⁻¹</p>
              <p className="text-purple-400 mt-1">kuchsiz maydon</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">T<sub>d</sub></p>
              <p className="text-purple-300">109.5°</p>
              <p className="text-purple-400 mt-1">tetraedrik</p>
            </div>
          </div>
        </div>

        {/* TETRAEDRIK 3D */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Tetraedr3D />
        </div>

        {/* KRISTALL MAYDON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TetraedralKritsallMaydon />
        </div>

        {/* SPIN-ONLY */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SpinOnlyCalc />
        </div>

        {/* UV-VIS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <UVVisSpektr />
        </div>

        {/* CURIE-WEISS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CurieWeiss />
        </div>

        {/* EPR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EPRSpectrum />
        </div>

        {/* SOLVATOXROMIZM */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Solvatoxromizm />
        </div>

        {/* OKTAEDRIK VS TETRAEDRIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <OktahedrikVsTetraedrik />
        </div>

        {/* TARIX */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TarixiyKontekst />
        </div>

        {/* AMALIYOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AmaliyQollanilish />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Co²⁺ (d⁷) — <strong className="text-blue-400">tetraedrik</strong>, yuqori spin (HS)</li>
            <li>Konfiguratsiya: <strong>e⁴ t₂³</strong>, n = 3, S = 3/2</li>
            <li>μ<sub>eff</sub> ≈ <strong>4.6 μ<sub>B</sub></strong> — spin-only (3.87) dan yuqori</li>
            <li>Sababi: <strong>orbital moment hissasi katta</strong> (⁴A₂ ground state)</li>
            <li>Δ<sub>t</sub> = <strong>3500 cm⁻¹</strong> — oktaedrikka nisbatan 4/9 marta kuchsiz</li>
            <li><strong className="text-blue-400">Ko'k rang</strong> — λ<sub>max</sub> ≈ 650 nm (qizil yutilish)</li>
            <li>ε ≈ 500 M⁻¹cm⁻¹ — <strong>Laporte ruxsat etilgan</strong> (T<sub>d</sub>, markaziy simmetriya yo'q)</li>
            <li>EPR: <strong>8 cho'qqi</strong> (⁵⁹Co, I = 7/2)</li>
            <li><strong>Solvatoxromizm</strong> — erituvchi o'zgarishi bilan rang o'zgaradi</li>
            <li>Oktaedrik [Co(H₂O)₆]²⁺ (pushti) bilan <strong>keskin farq</strong></li>
            <li>Amaliy qo'llanilishi: pigmentlar, batareyalar, kataliz, vitamin B₁₂</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/magnit/birikmalar/ag-nh3-2" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Ag(NH₃)₂]⁺
          </Link>
          <Link href="/ilmiy/tahlil/magnit/birikmalar/ni-cn4" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">
            [Ni(CN)₄]²⁻ →
          </Link>
        </div>

      </section>
    </main>
  )
}