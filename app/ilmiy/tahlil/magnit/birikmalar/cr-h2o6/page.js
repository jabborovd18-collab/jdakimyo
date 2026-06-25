"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. SPIN-ONLY KALKULYATORI (Cr³⁺ d³)
// ============================================================================
function SpinOnlyCalc() {
  const [n, setN] = useState(3)
  const mu_so = Math.sqrt(n * (n + 2))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Spin-only magnit momenti</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
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
            className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Hisoblash</p>
            <p className="text-purple-200 font-mono">√({n}·{n + 2})</p>
          </div>
          <div className="bg-emerald-900/40 border border-emerald-500/40 rounded-lg p-3">
            <p className="text-emerald-400">Natija</p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{mu_so.toFixed(3)} μ<sub>B</sub></p>
          </div>
        </div>

        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-3 text-xs">
          <p className="text-emerald-400 font-bold mb-1">✅ [Cr(H₂O)₆]³⁺ uchun:</p>
          <p className="text-purple-200">
            Cr³⁺ (d³) — <strong>3 ta toq elektron</strong>, barchasi t₂g da joylashgan (t₂g³).
            <strong> S = 3/2</strong>, spin-only μ<sub>so</sub> = <strong>3.87 μ<sub>B</sub></strong>.
            Eksperimental μ<sub>eff</sub> ≈ <strong>3.7-3.9 μ<sub>B</sub></strong> — <strong>spin-only bilan deyarli bir xil</strong>!
            Sababi: ground state <strong>⁴A₂g</strong> — orbital moment to'liq so'ngan (L = 0).
            Bu <strong>spin-only nazariyasining eng yaxshi tasdig'i</strong>.
          </p>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun μ<sub>eff</sub> ≈ μ<sub>so</sub>?</p>
          <p className="text-purple-200">
            d³ oktaedrikda ground state <strong>⁴A₂g</strong> — <strong>A term</strong> (orbital moment yo'q).
            Spin-orbital coupling <strong>kichik hissa</strong> beradi.
            Shuning uchun d³, d⁵ (HS), d⁸ kabi <strong>A yoki E ground state</strong>li ionlar
            spin-only formulaga <strong>juda yaqin</strong> qiymat beradi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. OKTAEDRIK KRISTALL MAYDON (d³)
// ============================================================================
function CrystalFieldOctahedral() {
  const [Dq, setDq] = useState(17400) // Cr³⁺ H₂O uchun

  // d³: t₂g³, LFSE = -1.2·Δo
  const LFSE = -1.2 * Dq

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 Oktaedrik kristall maydon — Cr³⁺ (d³)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 d³ — eng barqaror konfiguratsiyalardan biri:</p>
          <p className="text-purple-200 text-xs">
            d³ oktaedrikda <strong>t₂g yarim to'lgan</strong> (t₂g³). Bu <strong>alohida barqaror</strong> —
            barcha 3 ta t₂g orbitali bittadan elektron bilan to'lgan (Hund qoidasi).
            Hech qanday juftlanish energiyasi yo'q → <strong>CFSE maksimal</strong>.
            Shuning uchun Cr³⁺ <strong>kinetik inert</strong> (ligand almashinishi juda sekin).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-emerald-400 font-bold mb-3">Kristall maydon diagrammasi</h4>
            <div className="font-mono text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-purple-700/30 pb-2">
                <span className="text-red-400 w-24">e<sub>g</sub>*</span>
                <div className="flex gap-2">
                  <span className="text-purple-500">__</span>
                  <span className="text-purple-500">__</span>
                </div>
                <span className="text-purple-500">bo'sh</span>
              </div>

              <div className="text-center text-emerald-400 text-[10px] py-1">
                Δ<sub>o</sub> = {Dq.toLocaleString()} cm⁻¹
              </div>

              <div className="flex justify-between items-center border-t border-purple-700/30 pt-2">
                <span className="text-emerald-400 w-24">t₂g</span>
                <div className="flex gap-2">
                  <span className="text-yellow-400">↑</span>
                  <span className="text-yellow-400">↑</span>
                  <span className="text-yellow-400">↑</span>
                </div>
                <span className="text-emerald-400">3 e⁻</span>
              </div>

              <div className="bg-emerald-900/30 border border-emerald-500/30 rounded p-2 text-center mt-3">
                <p className="text-[10px] text-purple-300">Konfiguratsiya:</p>
                <p className="text-emerald-400 font-bold">t₂g³ e<sub>g</sub>⁰</p>
                <p className="text-[10px] text-purple-400 mt-1">S = 3/2 | n = 3</p>
                <p className="text-[10px] text-purple-400 mt-1">⁴A₂g ground state</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5 space-y-3">
            <h4 className="text-emerald-400 font-bold">Energiya tahlili</h4>

            <div className="bg-purple-900/50 rounded-lg p-3 text-xs">
              <div className="flex justify-between">
                <span className="text-purple-400">Δ<sub>o</sub>:</span>
                <span className="text-emerald-400 font-mono">{Dq.toLocaleString()} cm⁻¹</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-purple-400">P (juftlanish):</span>
                <span className="text-emerald-400 font-mono">0 (kerak emas)</span>
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t border-purple-700/50">
                <span className="text-purple-400">Toq e⁻:</span>
                <span className="text-emerald-400 font-bold">3 ta (parallel)</span>
              </div>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3 text-xs">
              <p className="text-yellow-400 font-bold mb-1">CFSE (stabilizatsiya):</p>
              <p className="text-emerald-400 font-mono font-bold text-lg">
                {Math.abs(LFSE).toLocaleString()} cm⁻¹
              </p>
              <p className="text-purple-400 text-[10px] mt-1">
                ≈ {(Math.abs(LFSE) * 1.2e-4 * 96.485).toFixed(1)} kJ/mol
              </p>
              <p className="text-purple-400 text-[10px]">
                (d³ — eng yuqori CFSE lardan biri!)
              </p>
            </div>

            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400">Δ<sub>o</sub> (sm⁻¹):</span>
                <span className="text-emerald-400 font-mono">{Dq}</span>
              </label>
              <input type="range" min="10000" max="30000" step="500" value={Dq}
                onChange={(e) => setDq(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun d³ barqaror?</p>
          <p className="text-purple-200">
            <strong>Yarim to'lgan t₂g</strong> — barcha 3 ta orbital bittadan elektron bilan to'lgan.
            <strong> Juftlanish energiyasi = 0</strong> (hech qanday elektron juftlashmagan).
            <strong> CFSE = 1.2 Δ<sub>o</sub></strong> — oktaedrik uchun maksimal qiymatlardan biri.
            Shuning uchun Cr³⁺, Mo³⁺, W³⁺ — <strong>hammasi inert</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. 3D OKTAEDR VIZUALIZATSIYA
// ============================================================================
function Octahedral3D() {
  const [rotate, setRotate] = useState(0)

  const ligands = [
    { x: 0, y: -1, z: 0, label: "H₂O" },
    { x: 0, y: 1, z: 0, label: "H₂O" },
    { x: 1, y: 0, z: 0, label: "H₂O" },
    { x: -1, y: 0, z: 0, label: "H₂O" },
    { x: 0, y: 0, z: 1, label: "H₂O" },
    { x: 0, y: 0, z: -1, label: "H₂O" }
  ]

  const project = (p, angle) => {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const x = p.x * cos - p.z * sin
    const z = p.x * sin + p.z * cos
    return { x: 200 + x * 80, y: 140 + p.y * 80, z: z }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 Oktaedrik geometriya — 3D ko'rinish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Aylantirish burchagi:</span>
            <span className="text-emerald-400 font-mono">{rotate}°</span>
          </label>
          <input type="range" min="0" max="360" step="5" value={rotate}
            onChange={(e) => setRotate(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 280" className="w-full h-64">
            <circle cx="200" cy="140" r="22" fill="#10b981" />
            <text x="200" y="146" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">Cr³⁺</text>

            {ligands.map((l, i) => {
              const proj = project(l, rotate * Math.PI / 180)
              const size = 12 + proj.z * 2
              return (
                <g key={i}>
                  <line x1="200" y1="140" x2={proj.x} y2={proj.y}
                    stroke="#3b82f6" strokeWidth="2" opacity="0.8" />
                  <circle cx={proj.x} cy={proj.y} r={size} fill="#3b82f6" opacity="0.9" />
                  <text x={proj.x} y={proj.y + 3} fill="white" fontSize="8"
                    textAnchor="middle" fontWeight="bold">H₂O</text>
                </g>
              )
            })}

            <text x="200" y="265" fill="#c4b5fd" fontSize="10" textAnchor="middle">
              O<sub>h</sub> simmetriya — 6 ta ligand, burchak = 90°
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Koordinatsion son</p>
            <p className="text-emerald-400 font-bold text-lg">6</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Burchak</p>
            <p className="text-emerald-400 font-bold text-lg">90°</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Simmetriya</p>
            <p className="text-emerald-400 font-bold text-lg">O<sub>h</sub></p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Cr³⁺ bog' uzunliklari:</p>
          <p className="text-purple-200">
            Cr−O (H₂O) = <strong>1.96 Å</strong> — oktaedrik uchun tipik.
            Barcha 6 ta bog' <strong>bir xil uzunlikda</strong> (Yahn-Teller effekti yo'q,
            chunki t₂g³ simmetrik to'lgan).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. TANABE-SUGANO DIAGRAMMASI (d³)
// ============================================================================
function TanabeSugano() {
  const [DeltaB, setDeltaB] = useState(1.74) // Δ/B, Cr³⁺ H₂O uchun B≈600 cm⁻¹

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 Tanabe-Sugano diagrammasi — d³</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 d³ ning o'ziga xosligi:</p>
          <p className="text-purple-200 text-xs">
            d³ uchun <strong>spin crossover yo'q</strong> — barcha Δ/B qiymatlarida
            <strong> yuqori spin</strong> (⁴A₂g ground state). Faqat <strong>spin-ruxsat etilgan</strong>
            o'tishlar: ⁴A₂g → ⁴T₂g, ⁴T₁g(F), ⁴T₁g(P).
          </p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Δ/B (maydon kuchi):</span>
            <span className="text-emerald-400 font-mono">{DeltaB.toFixed(2)}</span>
          </label>
          <input type="range" min="0" max="4" step="0.05" value={DeltaB}
            onChange={(e) => setDeltaB(parseFloat(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 250" className="w-full h-60">
            {/* O'qlar */}
            <line x1="40" y1="220" x2="380" y2="220" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="220" x2="40" y2="20" stroke="#4c1d95" strokeWidth="1" />
            <text x="210" y="245" fill="#c4b5fd" fontSize="10" textAnchor="middle">Δ/B</text>
            <text x="15" y="120" fill="#c4b5fd" fontSize="9" transform="rotate(-90, 15, 120)">E/B</text>

            {/* Scale */}
            {[0, 1, 2, 3, 4].map(v => (
              <text key={v} x={40 + v * 85} y="235" fill="#a78bfa" fontSize="8" textAnchor="middle">{v}</text>
            ))}
            {[0, 10, 20, 30, 40, 50].map(v => (
              <text key={v} x="35" y={220 - v * 4} fill="#a78bfa" fontSize="8" textAnchor="end">{v}</text>
            ))}

            {/* Energiya sathlari (soddalashtirilgan) */}
            {/* ⁴A₂g - ground state (horizontal) */}
            <line x1="40" y1="220" x2="380" y2="220" stroke="#10b981" strokeWidth="2" />
            <text x="385" y="223" fill="#10b981" fontSize="8">⁴A₂g</text>

            {/* ⁴T₂g - chiziqli o'sadi */}
            <line x1="40" y1="220" x2="380" y2="220 - 10*4" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="385" y={220 - 10*4 + 3} fill="#3b82f6" fontSize="8">⁴T₂g</text>

            {/* ⁴T₁g(F) */}
            <line x1="40" y1="220" x2="380" y2="220 - 18*4" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="385" y={220 - 18*4 + 3} fill="#f59e0b" fontSize="8">⁴T₁g(F)</text>

            {/* ⁴T₁g(P) */}
            <line x1="40" y1="220 - 15*4" x2="380" y2="220 - 30*4" stroke="#ef4444" strokeWidth="1.5" />
            <text x="385" y={220 - 30*4 + 3} fill="#ef4444" fontSize="8">⁴T₁g(P)</text>

            {/* ²E_g, ²T₁_g, ²T₂_g (spin-taqiqlangan) */}
            <line x1="40" y1="220 - 18*4" x2="380" y2="220 - 18*4" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,2" />
            <text x="385" y={220 - 18*4 - 5} fill="#a78bfa" fontSize="7">²E_g, ²T₁_g</text>

            {/* Current position marker */}
            <line x1={40 + DeltaB * 85} y1="220" x2={40 + DeltaB * 85} y2="30"
              stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx={40 + DeltaB * 85} cy="220" r="3" fill="#fbbf24" />
            <text x={40 + DeltaB * 85} y="25" fill="#fbbf24" fontSize="9" textAnchor="middle" fontWeight="bold">
              Δ/B = {DeltaB.toFixed(2)}
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-400 font-bold mb-1">⁴A₂g → ⁴T₂g</p>
            <p className="text-purple-200">ν₁ = Δ<sub>o</sub> = 17400 cm⁻¹</p>
            <p className="text-purple-400 text-[10px]">~575 nm (sariq yutilish)</p>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">⁴A₂g → ⁴T₁g(F)</p>
            <p className="text-purple-200">ν₂ ≈ 24500 cm⁻¹</p>
            <p className="text-purple-400 text-[10px]">~408 nm (binafsha yutilish)</p>
          </div>
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 font-bold mb-1">⁴A₂g → ⁴T₁g(P)</p>
            <p className="text-purple-200">ν₃ ≈ 38000 cm⁻¹</p>
            <p className="text-purple-400 text-[10px]">~263 nm (UV)</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun yashil rang?</p>
          <p className="text-purple-200">
            ν₁ (575 nm, <strong>sariq</strong>) va ν₂ (408 nm, <strong>binafsha</strong>) yutiladi.
            Komplementar rang — <strong className="text-emerald-400">yashil-binafsha</strong>.
            Cr³⁺ ning <strong>ruby</strong> (qizil) va <strong>emerald</strong> (yashil) ranglari
            shu o'tishlar va atrof-muhit (ligand) bilan bog'liq.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. UV-VIS SPEKTRI — 3 TA CHO'QQI
// ============================================================================
function UVVisSpektr() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌈 UV-Vis spektri — 3 ta spin-ruxsat etilgan cho'qqi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="170" x2="380" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <text x="210" y="195" fill="#c4b5fd" fontSize="10" textAnchor="middle">λ (nm)</text>
            <text x="15" y="95" fill="#c4b5fd" fontSize="9" transform="rotate(-90, 15, 95)">A</text>

            {[300, 400, 500, 600, 700].map((wl, i) => (
              <text key={i} x={40 + ((wl - 250) / 500) * 340} y="185" fill="#a78bfa" fontSize="8" textAnchor="middle">
                {wl}
              </text>
            ))}

            {/* Rang spektri */}
            <defs>
              <linearGradient id="spectrum3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b00ff" />
                <stop offset="20%" stopColor="#0000ff" />
                <stop offset="40%" stopColor="#00ff00" />
                <stop offset="60%" stopColor="#ffff00" />
                <stop offset="80%" stopColor="#ff8800" />
                <stop offset="100%" stopColor="#ff0000" />
              </linearGradient>
            </defs>
            <rect x="40" y="165" width="340" height="5" fill="url(#spectrum3)" opacity="0.3" />

            {/* 3 ta cho'qqi */}
            <polyline
              points={Array.from({ length: 150 }, (_, i) => {
                const wl = 250 + i * 3.33
                const x = 40 + (i / 150) * 340

                // ν₁ = 575 nm (⁴T₂g)
                const p1 = Math.exp(-0.5 * Math.pow((wl - 575) / 30, 2)) * 80
                // ν₂ = 408 nm (⁴T₁g(F))
                const p2 = Math.exp(-0.5 * Math.pow((wl - 408) / 25, 2)) * 100
                // ν₃ = 263 nm (⁴T₁g(P)) - UV
                const p3 = Math.exp(-0.5 * Math.pow((wl - 263) / 20, 2)) * 120

                const y = 170 - (p1 + p2 + p3)
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#10b981" strokeWidth="2" />

            {/* Labels */}
            <line x1={40 + ((575 - 250) / 500) * 340} y1="90" x2={40 + ((575 - 250) / 500) * 340} y2="25"
              stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((575 - 250) / 500) * 340} y="20" fill="#f59e0b" fontSize="8" textAnchor="middle">
              ν₁ = 575 nm
            </text>

            <line x1={40 + ((408 - 250) / 500) * 340} y1="70" x2={40 + ((408 - 250) / 500) * 340} y2="30"
              stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((408 - 250) / 500) * 340} y="25" fill="#3b82f6" fontSize="8" textAnchor="middle">
              ν₂ = 408 nm
            </text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 d³ ning o'ziga xosligi:</p>
          <p className="text-purple-200">
            d³ da <strong>3 ta spin-ruxsat etilgan</strong> o'tish bor (⁴ → ⁴).
            Bu <strong>Δ<sub>o</sub> va B (Racah parametrlari)</strong> ni aniqlashga imkon beradi.
            ν₁ = Δ<sub>o</sub>, ν₂ va ν₃ dan B va C hisoblanadi.
            <strong> d³ — kristall maydon nazariyasining eng muhim test holati</strong>.
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-2">Turli Cr³⁺ komplekslari:</h5>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="text-left py-1 text-yellow-400">Kompleks</th>
                  <th className="text-center py-1 text-yellow-400">Δ<sub>o</sub> (cm⁻¹)</th>
                  <th className="text-left py-1 text-yellow-400">Rang</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  ["[Cr(H₂O)₆]³⁺", "17400", "Binafsha-yashil"],
                  ["[Cr(NH₃)₆]³⁺", "21550", "Sariq"],
                  ["[Cr(en)₃]³⁺", "21700", "Sariq"],
                  ["[Cr(CN)₆]³⁻", "26600", "Sariq"],
                  ["Ruby (Al₂O₃:Cr³⁺)", "17800", "Qizil"],
                  ["Emerald (Be₃Al₂Si₆O₁₈:Cr³⁺)", "16800", "Yashil"],
                ].map((r, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${i === 0 ? 'bg-emerald-600/10' : ''}`}>
                    <td className="py-1 font-bold text-emerald-400">{r[0]}</td>
                    <td className="py-1 text-center font-mono">{r[1]}</td>
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
// 6. CURIE-WEISS QONUNI
// ============================================================================
function CurieWeiss() {
  const [C, setC] = useState(1.875)
  const [theta, setTheta] = useState(0)

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

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="space-y-3">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">C:</span>
              <span className="text-emerald-400 font-mono">{C.toFixed(3)} emu·K/mol</span>
            </label>
            <input type="range" min="1" max="3" step="0.01" value={C}
              onChange={(e) => setC(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
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
              className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-3 text-center font-mono text-sm">
          <p className="text-purple-300">μ<sub>eff</sub> = √(8C) = <span className="text-emerald-400 font-bold">{mu_eff.toFixed(3)} μ<sub>B</sub></span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <h5 className="text-emerald-400 font-bold text-xs mb-2">χ vs T</h5>
            <svg viewBox="0 0 300 180" className="w-full h-36 bg-purple-950 rounded">
              <line x1="35" y1="150" x2="290" y2="150" stroke="#4c1d95" strokeWidth="1" />
              <line x1="35" y1="10" x2="35" y2="150" stroke="#4c1d95" strokeWidth="1" />
              <text x="160" y="175" fill="#c4b5fd" fontSize="9" textAnchor="middle">T (K)</text>
              <polyline
                points={chiData.map(p => {
                  const x = 35 + (p.T / 300) * 255
                  const y = 150 - (p.chi / maxChi) * 130
                  return `${x},${y}`
                }).join(' ')}
                fill="none" stroke="#10b981" strokeWidth="2" />
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-3">
            <h5 className="text-emerald-400 font-bold text-xs mb-2">1/χ vs T</h5>
            <svg viewBox="0 0 300 180" className="w-full h-36 bg-purple-950 rounded">
              <line x1="35" y1="150" x2="290" y2="150" stroke="#4c1d95" strokeWidth="1" />
              <line x1="35" y1="10" x2="35" y2="150" stroke="#4c1d95" strokeWidth="1" />
              <text x="160" y="175" fill="#c4b5fd" fontSize="9" textAnchor="middle">T (K)</text>
              <polyline
                points={invChiData.map(p => {
                  const x = 35 + (p.T / 300) * 255
                  const y = 150 - (p.inv / maxInv) * 130
                  return `${x},${y}`
                }).join(' ')}
                fill="none" stroke="#f59e0b" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 [Cr(H₂O)₆]³⁺ uchun:</p>
          <p className="text-purple-200">
            θ ≈ <strong>0 K</strong> — <strong>ideal Curie qonuni</strong> (o'zaro ta'sir yo'q).
            μ<sub>eff</sub> = <strong>3.87 μ<sub>B</sub></strong> — spin-only bilan <strong>ideal mos</strong>.
            Bu d³ ning <strong>A ground state</strong> ekanligini tasdiqlaydi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. EPR SPEKTRI (Cr³⁺ — S=3/2)
// ============================================================================
function EPRSpectrum() {
  const [g, setG] = useState(1.98)
  const [D, setD] = useState(0.2) // Zero-field splitting (cm⁻¹)

  const B = 3400 / g

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📡 EPR spektri — Cr³⁺ (S=3/2)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">⚠️ Cr³⁺ EPR — o'ziga xos:</p>
          <p className="text-purple-200 text-xs">
            Cr³⁺ (S=3/2) — <strong>yarim butun spin</strong>.
            <strong> Zero-field splitting (ZFS)</strong> — D parametrlari muhim.
            ⁵³Cr (I = 3/2, 9.5% tabiiy) — <strong>4 cho'qqi hiperfin struktura</strong>.
            Lekin asosiy izotop ⁵²Cr (I = 0, 83.8%) — <strong>hiperfin yo'q</strong>.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">g-faktor:</span>
              <span className="text-emerald-400 font-mono">{g.toFixed(3)}</span>
            </label>
            <input type="range" min="1.9" max="2.1" step="0.001" value={g}
              onChange={(e) => setG(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">D (ZFS, sm⁻¹):</span>
              <span className="text-emerald-400 font-mono">{D.toFixed(3)}</span>
            </label>
            <input type="range" min="0" max="1" step="0.01" value={D}
              onChange={(e) => setD(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">g</p>
            <p className="text-emerald-400 font-bold font-mono">{g.toFixed(3)}</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">B (G)</p>
            <p className="text-yellow-400 font-bold font-mono">{B.toFixed(0)}</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">S</p>
            <p className="text-emerald-400 font-bold font-mono">3/2</p>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-2">EPR spektri (sxematik):</h5>
          <svg viewBox="0 0 400 180" className="w-full h-40">
            <line x1="40" y1="140" x2="360" y2="140" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="140" stroke="#4c1d95" strokeWidth="1" />
            <text x="200" y="170" fill="#c4b5fd" fontSize="9" textAnchor="middle">B (Gauss)</text>

            {/* Asosiy cho'qqi */}
            <polyline
              points={`${B*0.1 + 100 - 8},100 ${B*0.1 + 100 - 4},115 ${B*0.1 + 100},70 ${B*0.1 + 100 + 4},115 ${B*0.1 + 100 + 8},100`}
              fill="none" stroke="#10b981" strokeWidth="2" />

            {/* ⁵³Cr hiperfin (agar bo'lsa) */}
            {D > 0 && [0, 1, 2, 3].map(i => {
              const B_peak = B + (i - 1.5) * 50
              const x = B_peak * 0.1 + 100
              if (x < 40 || x > 360) return null
              return (
                <g key={i}>
                  <polyline
                    points={`${x-5},100 ${x-2},110 ${x},85 ${x+2},110 ${x+5},100`}
                    fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.7" />
                </g>
              )
            })}

            <text x="200" y="15" fill="#10b981" fontSize="9" textAnchor="middle" fontWeight="bold">
              Δm<sub>S</sub> = ±1 transitions
            </text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 ZFS nima uchun muhim?</p>
          <p className="text-purple-200">
            S &gt; 1/2 bo'lganda, <strong>spin darajalari</strong> maydon bo'lmasa ham ajraladi.
            D parametri — <strong>axial simmetriya buzilishi</strong>ning o'lchovi.
            Cr³⁺ oktaedrikda <strong>D kichik</strong> (~0.2 cm⁻¹) — simmetriya yuqori.
            Past simmetriyali komplekslarda D kattalashadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 8. KINETIK INERTLIK
// ============================================================================
function KinetikInertlik() {
  const [T, setT] = useState(25)

  const A = 1e10
  const Ea = 150 // Cr³⁺ uchun juda yuqori
  const R = 8.314e-3
  const k = A * Math.exp(-Ea / (R * (T + 273.15)))
  const t_half = Math.log(2) / k

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⏱️ Kinetik inertlik — Cr³⁺ ning eng kuchli xususiyati</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 Eng inert ionlardan biri:</p>
          <p className="text-purple-200 text-xs">
            Cr³⁺ (d³) — <strong>ligand almashinishi juda sekin</strong>.
            Sababi: <strong>t₂g³ yarim to'lgan</strong> — katta CFSE yo'qotish.
            O'tish holatida CFSE kamayadi → <strong>yuqori aktivatsiya energiyasi</strong>.
            Suvda haftalar, oylab barqaror!
          </p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Harorat (T):</span>
            <span className="text-emerald-400 font-mono">{T}°C</span>
          </label>
          <input type="range" min="0" max="100" step="1" value={T}
            onChange={(e) => setT(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">Tezlik konstantasi (k)</p>
            <p className="text-emerald-400 font-bold font-mono">{k.toExponential(2)} s⁻¹</p>
          </div>
          <div className="bg-emerald-900/40 border border-emerald-500/40 rounded-lg p-3">
            <p className="text-emerald-400">Yarim yemirilish (t<sub>1/2</sub>)</p>
            <p className="text-white font-bold font-mono text-lg">
              {t_half < 60 ? `${t_half.toFixed(1)} s` :
               t_half < 3600 ? `${(t_half / 60).toFixed(1)} min` :
               t_half < 86400 ? `${(t_half / 3600).toFixed(1)} soat` :
               t_half < 2592000 ? `${(t_half / 86400).toFixed(1)} kun` :
               `${(t_half / 2592000).toFixed(1)} oy`}
            </p>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-3">Taqqoslash — ligand almashinish tezligi:</h5>
          <div className="space-y-2 text-xs">
            {[
              { ion: "[Cr(H₂O)₆]³⁺ (d³)", t12: "~40 soat", barqaror: true },
              { ion: "[Co(NH₃)₆]³⁺ (d⁶ LS)", t12: "~1 kun", barqaror: true },
              { ion: "[Fe(H₂O)₆]³⁺ (d⁵ HS)", t12: "~10⁻³ s", barqaror: false },
              { ion: "[Ni(H₂O)₆]²⁺ (d⁸)", t12: "~10⁻⁵ s", barqaror: false },
              { ion: "[Cu(H₂O)₆]²⁺ (d⁹)", t12: "~10⁻⁵ s", barqaror: false },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-48 text-purple-200">{c.ion}</span>
                <span className={`flex-1 text-center font-mono ${c.barqaror ? 'text-emerald-400' : 'text-red-400'}`}>
                  {c.t12}
                </span>
                <span className={c.barqaror ? 'text-emerald-400' : 'text-red-400'}>
                  {c.barqaror ? '🐢 Inert' : '⚡ Labil'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Cr³⁺ inert?</p>
          <p className="text-purple-200">
            <strong>t₂g³</strong> — har bir orbital bitta elektron bilan to'lgan.
            Ligand ketayotganda <strong>CFSE yo'qotish</strong> katta (1.2 Δ<sub>o</sub>).
            <strong> Aktivatsiya energiyasi</strong> = 150 kJ/mol (juda yuqori).
            Shuning uchun Cr³⁺ komplekslarini <strong>sintez qilish qiyin</strong>,
            lekin <strong>barqaror</strong> — uzoq saqlanadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 9. QIMMATBAHO TOSHLAR — RUBY VA EMERALD
// ============================================================================
function QimmatbahoToshlar() {
  const [tosha, setTosha] = useState("ruby")

  const toshlar = {
    ruby: {
      name: "Ruby (Yoqut)",
      formula: "Al₂O₃ : Cr³⁺",
      rang: "Qizil",
      color: "#dc2626",
      sababi: "Cr³⁺ → ⁴T₂ o'tish (694 nm, qizil yutilish)",
      icon: "💎"
    },
    emerald: {
      name: "Emerald (Zumrad)",
      formula: "Be₃Al₂Si₆O₁₈ : Cr³⁺",
      rang: "Yashil",
      color: "#16a34a",
      sababi: "Cr³⁺ → maydon kuchsiz (16800 cm⁻¹), yashil komplementar",
      icon: "💚"
    },
    alexandrite: {
      name: "Alexandrite",
      formula: "BeAl₂O₄ : Cr³⁺",
      rang: "Yashil ↔ Qizil",
      color: "#7c3aed",
      sababi: "Yorug'lik manbaiga bog'liq rang o'zgarishi",
      icon: "🔮"
    }
  }

  const t = toshlar[tosha]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💎 Qimmatbaho toshlar — Cr³⁺ rangi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 Cr³⁺ — toshlarning rangi uchun mas'ul:</p>
          <p className="text-purple-200 text-xs">
            <strong>Ruby</strong>, <strong>emerald</strong>, <strong>alexandrite</strong> — barchasining
            rangi <strong>Cr³⁺</strong> ioniga bog'liq. Bir xil ion, lekin <strong>har xil muhit</strong>
            (kristall panjara, ligandlar) → <strong>har xil rang</strong>!
          </p>
        </div>

        {/* TANLASH */}
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(toshlar).map(([key, val]) => (
            <button key={key} onClick={() => setTosha(key)}
              className={`px-3 py-3 rounded-lg text-xs font-bold transition-all ${
                tosha === key
                  ? "bg-emerald-600/80 text-white shadow-lg"
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              <div className="text-2xl mb-1">{val.icon}</div>
              <div className="text-[10px]">{val.name}</div>
            </button>
          ))}
        </div>

        {/* INFO */}
        <div className="bg-purple-950/50 rounded-xl p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full border-4 border-white/20"
              style={{backgroundColor: t.color}}></div>
            <div>
              <h4 className="text-white font-bold text-xl">{t.name}</h4>
              <p className="text-purple-400 text-sm font-mono">{t.formula}</p>
              <p className="text-emerald-400 font-bold mt-1">{t.rang}</p>
            </div>
          </div>

          <div className="bg-purple-900/50 rounded p-3">
            <p className="text-yellow-400 font-bold text-xs mb-1">Rang sababi:</p>
            <p className="text-purple-200 text-xs">{t.sababi}</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun bir xil Cr³⁺ turli rang beradi?</p>
          <p className="text-purple-200">
            <strong>Ruby</strong>: Al₂O₃ panjarasida Cr³⁺ → <strong>kuchli maydon</strong> →
            Δ<sub>o</sub> = 17800 cm⁻¹ → ko'k-yashil yutilish → <strong className="text-red-400">qizil</strong>.
            <br/>
            <strong>Emerald</strong>: Be₃Al₂Si₆O₁₈ da Cr³⁺ → <strong>o'rtacha maydon</strong> →
            Δ<sub>o</sub> = 16800 cm⁻¹ → qizil-ko'k yutilish → <strong className="text-emerald-400">yashil</strong>.
            <br/>
            Bu <strong>"kristall maydon ta'siri"</strong>ning ajoyib namunasi!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 10. SOLISHTIRISH — Cr IONLARI
// ============================================================================
function SolishtirishJadvali() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Cr ionlari — oksidlanish darajalari bo'yicha</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Ion</th>
                <th className="text-center py-3 px-2 text-yellow-400">dⁿ</th>
                <th className="text-center py-3 px-2 text-yellow-400">S</th>
                <th className="text-center py-3 px-2 text-yellow-400">μ<sub>eff</sub></th>
                <th className="text-center py-3 px-2 text-yellow-400">Magnit</th>
                <th className="text-left py-3 px-2 text-yellow-400">Rang</th>
                <th className="text-center py-3 px-2 text-yellow-400">Inertlik</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Cr⁰", "d⁶", "0", "0", "Diamagnit", "—", "—"],
                ["Cr²⁺", "d⁴", "2", "4.8", "Paramagnit", "Ko'k", "Labil"],
                ["Cr³⁺", "d³", "3/2", "3.8", "Paramagnit", "Yashil", "Inert"],
                ["Cr⁴⁺", "d²", "1", "2.8", "Paramagnit", "Qizil", "Inert"],
                ["Cr⁶⁺", "d⁰", "0", "0", "Diamagnit", "Sariq", "—"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 ${i === 2 ? 'bg-emerald-600/10' : ''} hover:bg-purple-800/20`}>
                  <td className="py-2 px-2 font-bold text-emerald-400">{r[0]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[1]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[2]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[3]}</td>
                  <td className={`py-2 px-2 text-center font-bold ${r[4] === 'Diamagnit' ? 'text-blue-400' : 'text-red-400'}`}>
                    {r[4]}
                  </td>
                  <td className="py-2 px-2">{r[5]}</td>
                  <td className={`py-2 px-2 text-center ${r[6] === 'Inert' ? 'text-emerald-400' : r[6] === 'Labil' ? 'text-red-400' : 'text-purple-400'}`}>
                    {r[6]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-purple-400 text-xs mt-3">
          * <strong>Cr³⁺</strong> — eng barqaror oksidlanish darajasi (t₂g³ yarim to'lgan).
          <strong> Cr⁶⁺</strong> (d⁰) — kuchli oksidlovchi, zaharli (K₂Cr₂O₇, K₂CrO₄).
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// 11. TARIXIY KONTEKST
// ============================================================================
function TarixiyKontekst() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — Xrom kimyosi</h3>

      <div className="bg-gradient-to-br from-emerald-900/30 to-purple-900/30 rounded-xl p-5 border border-emerald-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">1797 — Vauquelin kashfiyoti</p>
                <p className="text-purple-200 text-xs mt-1">
                  Fransuz kimyogari <strong>Louis Nicolas Vauquelin</strong> Sibir rudalaridan
                  yangi element ajratib oldi. Yunoncha "chroma" (rang) so'zidan <strong>xrom</strong> deb nomladi —
                  chunki birikmalari <strong>har xil rangda</strong> edi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💎</div>
              <div>
                <p className="text-yellow-400 font-bold">Qadim zamon — Ruby va Emerald</p>
                <p className="text-purple-200 text-xs mt-1">
                  Qadimgi Hindiston, Misr, Rim <strong>yoqut</strong> va <strong>zumrad</strong>ni
                  qadrlagan. Lekin ularning rangi <strong>Cr³⁺</strong> dan ekanligi faqat
                  19-asrda tushunildi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1930-50 — Kristall maydon nazariyasi</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Bethe, Van Vleck</strong> va boshqalar Cr³⁺ komplekslarining
                  rangini tushuntirishdi. <strong>Tanabe-Sugano d³ diagrammasi</strong> —
                  eng muhim test holati.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🏆</div>
              <div>
                <p className="text-yellow-400 font-bold">1960 — Birinchi laser</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Theodore Maiman</strong> <strong>ruby laser</strong>ni yaratdi —
                  birinchi ishlaydigan laser. Al₂O₃:Cr³⁺ kristalida
                  <strong> 694.3 nm</strong> da nurlanish.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Cr³⁺ ning o'ziga xosligi:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Eng barqaror</strong> oksidlanish darajasi (t₂g³)</li>
            <li><strong>Kinetik inert</strong> — ligand almashinishi sekin</li>
            <li><strong>Spin-only</strong> magnit momentga yaqin (A ground state)</li>
            <li><strong>3 ta spin-ruxsat etilgan</strong> UV-Vis o'tish</li>
            <li><strong>Qimmatbaho toshlar</strong>ning rangi (ruby, emerald)</li>
            <li><strong>Ruby laser</strong> — birinchi laser</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 12. AMALIY QO'LLANILISH
// ============================================================================
function AmaliyQollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 Amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🎨</div>
            <h4 className="text-emerald-400 font-bold mb-2">Pigmentlar va bo'yoqlar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Xrom yashil</strong> (Cr₂O₃)</li>
              <li><strong>Xrom sariq</strong> (PbCrO₄)</li>
              <li><strong>Xrom qizil</strong> (PbCrO₄·Pb(OH)₂)</li>
              <li>Keramik glazurlar, shisha</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="text-emerald-400 font-bold mb-2">Galvanizatsiya</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Xrom qoplash</strong> (avto, mebel)</li>
              <li>Korroziyadan himoya</li>
              <li>Dekorativ qoplamalar</li>
              <li>Qattiq, yaltiroq sirt</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💎</div>
            <h4 className="text-emerald-400 font-bold mb-2">Lazerlar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Ruby laser</strong> (694.3 nm)</li>
              <li>Tibbiyot, sanoat</li>
              <li>Holografiya</li>
              <li>O'lchov asboblari</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔧</div>
            <h4 className="text-emerald-400 font-bold mb-2">Qotishmalar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Zanglamas po'lat</strong> (Fe-Cr-Ni)</li>
              <li>Xromli po'lat (mustahkam)</li>
              <li>Nichrome (issiqqa chidamli)</li>
              <li>Aviasiya, tibbiyot</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚗️</div>
            <h4 className="text-emerald-400 font-bold mb-2">Katalizatorlar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Phillips katalizatori</strong> (CrO₃/SiO₂)</li>
              <li>Polyetilen ishlab chiqarish</li>
              <li>Polimerizatsiya</li>
              <li>Yillik millionlab tonna</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-emerald-400 font-bold mb-2">Analitik kimyo</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Xromatometriya</strong></li>
              <li>Oksidlovchi agent (Cr₂O₇²⁻)</li>
              <li>Kolumkalar (silika gel)</li>
              <li>Titrlash (temir aniqlash)</li>
            </ul>
          </div>
        </div>

        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-bold mb-2">⚠️ ZAHARLI!</p>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• <strong>Cr⁶⁺</strong> — <strong>juda zaharli</strong> va <strong>kantserogen</strong></li>
            <li>• <strong>Erin Brockovich</strong> filmi — Cr⁶⁺ bilan suvni zaharlash</li>
            <li>• Cr³⁺ — <strong>kam zaharli</strong> (ozuqa mikroelementi)</li>
            <li>• Cr⁶⁺ → Cr³⁺ gacha qaytarish — <strong>zaharsizlantirish</strong></li>
          </ul>
        </div>

        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 font-bold mb-2">🌟 Qiziqarli faktlar:</p>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• Xrom — <strong>Yer po'stlog'ining 0.01%</strong> ini tashkil qiladi</li>
            <li>• <strong>JANUB</strong> — dunyodagi eng katta xrom zaxirasi (Kaspiy dengizi)</li>
            <li>• <strong>"Xrom"</strong> yunoncha "rang" — barcha birikmalari rangli</li>
            <li>• <strong>Mars qizil</strong> — Fe₂O₃ bilan birga Cr³⁺ ham bor</li>
            <li>• <strong>Inson organizmi</strong> da ~2 mg Cr³⁺ bor (glyukoza metabolizmi)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function CrH2O6Magnit() {
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
          <span className="text-emerald-400">[Cr(H₂O)₆]³⁺</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-emerald-400">🧲 [Cr(H₂O)₆]³⁺ — Magnit tahlili</h1>
          <p className="text-purple-400 text-sm">
            Cr³⁺ (d³, S=3/2) • Paramagnit • μ<sub>eff</sub> ≈ 3.87 μ<sub>B</sub> • Kinetik inert • Ruby/Emerald
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-emerald-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-2xl md:text-4xl font-extrabold font-mono text-emerald-400">[Cr(H₂O)₆]³⁺</span>
            <div>
              <h2 className="text-xl font-bold text-white">Magnit tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Geksaakvaxrom(III)" — spin-only klassikasi</p>
            </div>
          </div>

          <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Cr(H₂O)₆]³⁺ — <strong className="text-emerald-400">spin-only nazariyasining eng yaxshi tasdig'i</strong>.
              Cr³⁺ (d³) oktaedrik maydonda <strong>t₂g³ konfiguratsiya</strong>ga ega.
              3 ta toq elektron, <strong>S = 3/2</strong>. μ<sub>eff</sub> = <strong>3.87 μ<sub>B</sub></strong> —
              spin-only bilan <strong>deyarli bir xil</strong>! Sababi: ground state <strong>⁴A₂g</strong> (A term) —
              orbital moment to'liq so'ngan. Qo'shimcha ravishda, Cr³⁺ <strong>kinetik inert</strong> —
              ligand almashinishi juda sekin (haftalar, oylab).
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">d³, S=3/2</p>
              <p className="text-purple-300">t₂g³</p>
              <p className="text-purple-400 mt-1">Paramagnit</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">μ ≈ 3.87 μ<sub>B</sub></p>
              <p className="text-purple-300">n = 3</p>
              <p className="text-purple-400 mt-1">spin-only ≈ exp</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">Δ<sub>o</sub> = 17400</p>
              <p className="text-purple-300">sm⁻¹</p>
              <p className="text-purple-400 mt-1">H₂O maydon</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">⁴A₂g</p>
              <p className="text-purple-300">ground state</p>
              <p className="text-purple-400 mt-1">A term</p>
            </div>
          </div>
        </div>

        {/* 3D OKTAEDR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Octahedral3D />
        </div>

        {/* KRISTALL MAYDON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CrystalFieldOctahedral />
        </div>

        {/* SPIN-ONLY */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SpinOnlyCalc />
        </div>

        {/* TANABE-SUGANO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TanabeSugano />
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

        {/* KINETIK INERTLIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <KinetikInertlik />
        </div>

        {/* QIMMATBAHO TOSHLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <QimmatbahoToshlar />
        </div>

        {/* SOLISHTIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SolishtirishJadvali />
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
        <div className="bg-gradient-to-r from-emerald-600/10 to-purple-600/10 border border-emerald-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Cr³⁺ (d³) — <strong className="text-emerald-400">t₂g³ yarim to'lgan</strong>, alohida barqaror</li>
            <li>μ<sub>eff</sub> ≈ <strong>3.87 μ<sub>B</sub></strong> — spin-only bilan <strong>ideal mos</strong></li>
            <li>Sababi: ground state <strong>⁴A₂g</strong> — orbital moment yo'q (A term)</li>
            <li>Δ<sub>o</sub> = <strong>17400 cm⁻¹</strong> (H₂O maydon)</li>
            <li>3 ta spin-ruxsat etilgan o'tish: <strong>⁴A₂g → ⁴T₂g, ⁴T₁g(F), ⁴T₁g(P)</strong></li>
            <li>UV-Vis: 575, 408, 263 nm → <strong>yashil-binafsha rang</strong></li>
            <li><strong className="text-emerald-400">Kinetik inert</strong> — t<sub>1/2</sub> ≈ 40 soat</li>
            <li>EPR: g ≈ 1.98, S = 3/2, D ≈ 0.2 cm⁻¹ (kichik ZFS)</li>
            <li>Curie-Weiss: θ ≈ 0 K — <strong>ideal paramagnet</strong></li>
            <li><strong className="text-emerald-400">Ruby</strong> (qizil) va <strong className="text-emerald-400">Emerald</strong> (yashil) — Cr³⁺ rangi</li>
            <li>Ruby laser (694.3 nm) — birinchi laser</li>
            <li>Amaliy: pigmentlar, galvanizatsiya, qotishmalar, kataliz</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/magnit/birikmalar/zn-oh4" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Zn(OH)₄]²⁻
          </Link>
          <Link href="/ilmiy/tahlil/magnit" className="px-6 py-3 bg-emerald-600/80 rounded-xl hover:bg-emerald-500 text-white font-semibold">
            Magnit tahliliga qaytish →
          </Link>
        </div>

      </section>
    </main>
  )
}