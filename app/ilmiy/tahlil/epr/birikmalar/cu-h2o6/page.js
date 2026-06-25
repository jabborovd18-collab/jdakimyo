"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. EPR SPEKTR SIMULYATORI (Cu²⁺ uchun — aksial anizotropiya)
// ============================================================================
function EPRSpektrSimulyatori() {
  const [gParallel, setGParallel] = useState(2.30)
  const [gPerp, setGPerp] = useState(2.05)
  const [Aparallel, setAparallel] = useState(150) // Gauss
  const [Aperp, setAperp] = useState(20)
  const [linewidth, setLinewidth] = useState(30)
  const [orientation, setOrientation] = useState("powder") // powder, single_crystal_parallel, single_crystal_perp

  const nuGHz = 9.5 // X-band
  const h = 6.626e-34
  const muB = 9.274e-24

  // Rezonans maydonlari
  const BParallel = (h * nuGHz * 1e9) / (gParallel * muB) * 1e4
  const BPerp = (h * nuGHz * 1e9) / (gPerp * muB) * 1e4

  // Spektr simulyatsiyasi
  const spectrum = useMemo(() => {
    const points = []
    const B_min = 2000
    const B_max = 4500
    
    for (let i = 0; i < 500; i++) {
      const B = B_min + (i / 500) * (B_max - B_min)
      let signal = 0
      
      if (orientation === "powder") {
        // Powder spektr — barcha yo'nalishlar aralashmasi
        // Parallel yo'nalish: 4 ta gipernozik cho'qqi
        for (let m = 0; m < 4; m++) {
          const B_shift = BParallel + (m - 1.5) * Aparallel
          const gauss = Math.exp(-0.5 * Math.pow((B - B_shift) / (linewidth / 2), 2))
          signal += gauss * 0.3 // parallel hissasi kichikroq
        }
        
        // Perpendikulyar yo'nalish: 4 ta gipernozik cho'qqi
        for (let m = 0; m < 4; m++) {
          const B_shift = BPerp + (m - 1.5) * Aperp
          const gauss = Math.exp(-0.5 * Math.pow((B - B_shift) / (linewidth / 2), 2))
          signal += gauss * 0.7 // perpendicular hissasi kattaroq
        }
      } else if (orientation === "single_crystal_parallel") {
        // Faqat parallel yo'nalish
        for (let m = 0; m < 4; m++) {
          const B_shift = BParallel + (m - 1.5) * Aparallel
          const gauss = Math.exp(-0.5 * Math.pow((B - B_shift) / (linewidth / 2), 2))
          signal += gauss
        }
      } else {
        // Faqat perpendikulyar yo'nalish
        for (let m = 0; m < 4; m++) {
          const B_shift = BPerp + (m - 1.5) * Aperp
          const gauss = Math.exp(-0.5 * Math.pow((B - B_shift) / (linewidth / 2), 2))
          signal += gauss
        }
      }
      
      points.push({ B, signal })
    }
    return points
  }, [BParallel, BPerp, Aparallel, Aperp, linewidth, orientation])

  const maxSignal = Math.max(...spectrum.map(p => p.signal), 0.01)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📡 EPR spektr simulyatori — Cu²⁺ (d⁹)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 Aksial anizotropiya:</p>
          <p className="text-purple-200 text-xs">
            Cu²⁺ (d⁹) da <strong>g∥ ≠ g⊥</strong> — bu <strong>aksial simmetriya</strong> belgisi.
            Yahn-Teller cho'zilgan oktaedrda toq elektron <strong>d<sub>x²-y²</sub></strong> orbitalida joylashgan.
            g∥ &gt; g⊥ &gt; 2.0 — bu <strong>cho'zilgan oktaedr</strong>ning aniq belgisi.
          </p>
        </div>

        {/* ORIENTATSIYA TANLASH */}
        <div>
          <p className="text-purple-300 text-xs mb-2 font-semibold">Namuna turi:</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "powder", label: "🧪 Powder (kukun)", desc: "Barcha yo'nalishlar" },
              { id: "single_crystal_parallel", label: "💎 || (parallel)", desc: "B∥ z-o'q" },
              { id: "single_crystal_perp", label: "💎 ⊥ (perpendikulyar)", desc: "B⊥ z-o'q" },
            ].map(o => (
              <button key={o.id} onClick={() => setOrientation(o.id)}
                className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  orientation === o.id
                    ? "bg-blue-600/80 text-white shadow-lg"
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                <div>{o.label}</div>
                <div className="text-[9px] opacity-70 mt-1">{o.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* SLIDERLAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">g<sub>∥</sub> (parallel):</span>
                <span className="text-emerald-400 font-mono">{gParallel.toFixed(3)}</span>
              </label>
              <input type="range" min="2.0" max="2.5" step="0.001" value={gParallel}
                onChange={(e) => setGParallel(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
              <p className="text-purple-400 text-[10px] mt-1">B<sub>∥</sub> = {BParallel.toFixed(0)} G</p>
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">g<sub>⊥</sub> (perpendikulyar):</span>
                <span className="text-emerald-400 font-mono">{gPerp.toFixed(3)}</span>
              </label>
              <input type="range" min="2.0" max="2.3" step="0.001" value={gPerp}
                onChange={(e) => setGPerp(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
              <p className="text-purple-400 text-[10px] mt-1">B<sub>⊥</sub> = {BPerp.toFixed(0)} G</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">A<sub>∥</sub> (G):</span>
                <span className="text-emerald-400 font-mono">{Aparallel}</span>
              </label>
              <input type="range" min="50" max="250" step="5" value={Aparallel}
                onChange={(e) => setAparallel(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">A<sub>⊥</sub> (G):</span>
                <span className="text-emerald-400 font-mono">{Aperp}</span>
              </label>
              <input type="range" min="0" max="50" step="1" value={Aperp}
                onChange={(e) => setAperp(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">ΔB (G):</span>
                <span className="text-emerald-400 font-mono">{linewidth}</span>
              </label>
              <input type="range" min="10" max="80" step="1" value={linewidth}
                onChange={(e) => setLinewidth(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
            </div>
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-blue-400 font-bold text-xs mb-2">EPR spektri (X-band, 9.5 GHz):</h5>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="100" x2="380" y2="100" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="40" y1="20" x2="40" y2="180" stroke="#4c1d95" strokeWidth="1" />
            <line x1="380" y1="20" x2="380" y2="180" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">B (Gauss)</text>
            <text x="40" y="195" fill="#a78bfa" fontSize="8">2000</text>
            <text x="380" y="195" fill="#a78bfa" fontSize="8" textAnchor="end">4500</text>

            {/* Absorbsiya */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 500) * 340
                const y = 100 - (p.signal / maxSignal) * 70
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4"
            />

            {/* Birinchi hosila */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 500) * 340
                const next = spectrum[i + 1] || p
                const derivative = (next.signal - p.signal) * 500
                const y = 100 - (derivative / maxSignal) * 70
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#3b82f6" strokeWidth="2"
            />

            {/* g∥ va g⊥ belgilari */}
            <line x1={40 + ((BParallel - 2000) / 2500) * 340} y1="20" x2={40 + ((BParallel - 2000) / 2500) * 340} y2="180"
              stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((BParallel - 2000) / 2500) * 340} y="15" fill="#ef4444" fontSize="8" textAnchor="middle">
              g∥={gParallel.toFixed(2)}
            </text>

            <line x1={40 + ((BPerp - 2000) / 2500) * 340} y1="25" x2={40 + ((BPerp - 2000) / 2500) * 340} y2="180"
              stroke="#10b981" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((BPerp - 2000) / 2500) * 340} y="20" fill="#10b981" fontSize="8" textAnchor="middle">
              g⊥={gPerp.toFixed(2)}
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400">g<sub>∥</sub></p>
            <p className="text-emerald-400 font-bold font-mono">{gParallel.toFixed(3)}</p>
          </div>
          <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-3">
            <p className="text-emerald-400">g<sub>⊥</sub></p>
            <p className="text-emerald-400 font-bold font-mono">{gPerp.toFixed(3)}</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-yellow-400">A<sub>∥</sub></p>
            <p className="text-emerald-400 font-bold font-mono">{Aparallel} G</p>
          </div>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-400">A<sub>⊥</sub></p>
            <p className="text-emerald-400 font-bold font-mono">{Aperp} G</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Kuzatishlar:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Powder spektr</strong> — parallel va perpendikulyar cho'qqilar aralashmasi</li>
            <li><strong>Single crystal ||</strong> — 4 ta gipernozik cho'qqi (katta A<sub>∥</sub>)</li>
            <li><strong>Single crystal ⊥</strong> — 4 ta gipernozik cho'qqi (kichik A<sub>⊥</sub>)</li>
            <li><strong>g<sub>∥</sub> &gt; g<sub>⊥</sub> &gt; 2.0</strong> — cho'zilgan oktaedr belgisi</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. YAHN-TELLER VA G-FAKTOR
// ============================================================================
function YahnTellerGFactor() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ Yahn-Teller effekti va g-faktor</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-blue-400 font-bold mb-3">Yahn-Teller cho'zilishi:</h4>
            <div className="font-mono text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-purple-300">Cu−O (ekvatorial):</span>
                <span className="text-emerald-400 font-bold">1.95 Å (4 ta)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-300">Cu−O (aksial):</span>
                <span className="text-red-400 font-bold">2.40 Å (2 ta)</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-purple-700/30">
                <span className="text-purple-300">Farq:</span>
                <span className="text-yellow-400 font-bold">0.45 Å</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-blue-400 font-bold mb-3">d-orbital energiya:</h4>
            <div className="font-mono text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-red-400">d<sub>x²-y²</sub></span>
                <span className="text-yellow-400">↑</span>
                <span className="text-purple-400">toq e⁻</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-orange-400">d<sub>z²</sub></span>
                <span className="text-yellow-400">↑↓</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-400">d<sub>xy</sub></span>
                <span className="text-yellow-400">↑↓</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-400">d<sub>xz</sub>, d<sub>yz</sub></span>
                <span className="text-yellow-400">↑↓ ↑↓</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-blue-400 font-bold text-xs mb-2">g-faktor formulasi (cho'zilgan oktaedr):</h5>
          <div className="font-mono text-xs space-y-1 text-purple-200">
            <p>g<sub>∥</sub> = g<sub>e</sub> + 8λ/ΔE<sub>xy</sub></p>
            <p>g<sub>⊥</sub> = g<sub>e</sub> + 2λ/ΔE<sub>xz,yz</sub></p>
            <p className="text-purple-400 mt-2">λ — spin-orbital coupling konstantasi</p>
            <p className="text-purple-400">ΔE — qo'shni orbitalar orasidagi energiya farqi</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun g<sub>∥</sub> &gt; g<sub>⊥</sub>?</p>
          <p className="text-purple-200">
            Toq elektron <strong>d<sub>x²-y²</sub></strong> da joylashgan. Bu orbital xy tekisligida →
            <strong> z-o'q bo'yicha</strong> (parallel) spin-orbital coupling kuchliroq.
            Shuning uchun <strong>g<sub>∥</sub></strong> katta og'ishga ega.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. GIPERNOZIK TUZILISH — ⁶³Cu/⁶⁵Cu
// ============================================================================
function GipernozikTuzilish() {
  const [A, setA] = useState(150)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 Gipernozik tuzilish — ⁶³Cu/⁶⁵Cu</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <h5 className="text-blue-400 font-bold text-xs mb-2">⁶³Cu:</h5>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-purple-300">Tabiiylik:</span>
                <span className="text-emerald-400 font-bold">69.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Spin (I):</span>
                <span className="text-emerald-400 font-bold">3/2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Cho'qqilar:</span>
                <span className="text-emerald-400 font-bold">4 ta</span>
              </div>
            </div>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-4">
            <h5 className="text-blue-400 font-bold text-xs mb-2">⁶⁵Cu:</h5>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-purple-300">Tabiiylik:</span>
                <span className="text-emerald-400 font-bold">30.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Spin (I):</span>
                <span className="text-emerald-400 font-bold">3/2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Cho'qqilar:</span>
                <span className="text-emerald-400 font-bold">4 ta</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">A<sub>∥</sub> (G):</span>
            <span className="text-emerald-400 font-mono">{A}</span>
          </label>
          <input type="range" min="50" max="250" step="5" value={A}
            onChange={(e) => setA(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
        </div>

        {/* 4 CHO'QQI VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 150" className="w-full h-36">
            <line x1="40" y1="120" x2="360" y2="120" stroke="#4c1d95" strokeWidth="1" />
            
            {Array.from({ length: 4 }).map((_, i) => {
              const x = 80 + (i / 3) * 240
              const intensity = 1
              return (
                <g key={i}>
                  <line x1={x} y1="120" x2={x} y2={120 - intensity * 80}
                    stroke="#3b82f6" strokeWidth="4" />
                  <text x={x} y="135" fill="#c4b5fd" fontSize="9" textAnchor="middle">
                    m<sub>I</sub> = {1.5 - i}
                  </text>
                  <text x={x} y="30" fill="#3b82f6" fontSize="8" textAnchor="middle">
                    {(A * (1.5 - i)).toFixed(0)} G
                  </text>
                </g>
              )
            })}

            <text x="200" y="15" fill="#3b82f6" fontSize="10" textAnchor="middle" fontWeight="bold">
              4 ta gipernozik cho'qqi (2I+1 = 4)
            </text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 A konstantasi — kovalentlik ko'rsatkichi:</p>
          <p className="text-purple-200">
            <strong>Katta A</strong> (~180 G) → ion bog'lanish (masalan, [Cu(H₂O)₆]²⁺).
            <strong> Kichik A</strong> (~60 G) → kovalent bog'lanish (masalan, [Cu(CN)₄]²⁻).
            Sababi: kovalent bog'da elektron zichligi ligandga siljiydi → yadro bilan o'zaro ta'sir kamayadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. SUPER-GIPERNOZIK — AZOT LIGANDLARI
// ============================================================================
function SuperGipernozik() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 Super-gipernozik — 4 ta azot (¹⁴N)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-blue-400 font-bold text-xs mb-2">¹⁴N yadro xususiyatlari:</h5>
          <div className="grid grid-cols-3 gap-3 text-xs text-center">
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">Spin (I)</p>
              <p className="text-emerald-400 font-bold">1</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">Tabiiylik</p>
              <p className="text-emerald-400 font-bold">99.6%</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">A<sub>N</sub></p>
              <p className="text-emerald-400 font-bold">~15 G</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-blue-400 font-bold text-xs mb-2">[Cu(NH₃)₄(H₂O)₂]²⁺ spektri:</h5>
          <svg viewBox="0 0 400 150" className="w-full h-36">
            <line x1="40" y1="120" x2="360" y2="120" stroke="#4c1d95" strokeWidth="1" />
            
            {/* 4 ta gipernozik cho'qqi, har birida 4 ta super-gipernozik */}
            {Array.from({ length: 4 }).map((_, i) => {
              const x_center = 80 + (i / 3) * 240
              return Array.from({ length: 4 }).map((_, j) => {
                const x = x_center + (j - 1.5) * 8
                return (
                  <line key={`${i}-${j}`} x1={x} y1="120" x2={x} y2={120 - 60}
                    stroke="#f59e0b" strokeWidth="1.5" />
                )
              })
            })}

            <text x="200" y="15" fill="#f59e0b" fontSize="9" textAnchor="middle" fontWeight="bold">
              4 × 4 = 16 cho'qqi (gipernozik × super-gipernozik)
            </text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Super-gipernozik nima beradi?</p>
          <p className="text-purple-200">
            4 ta ekvivalent ¹⁴N (I=1) → har bir gipernozik cho'qqi ichida <strong>4 ta qo'shimcha cho'qqi</strong>.
            Jami: 4 × 4 = <strong>16 cho'qqi</strong>. Bu ligandlar sonini va ularning ekvivalentligini
            ko'rsatadi. A<sub>N</sub> qiymati Cu-N bog'ining <strong>kovalentlik darajasini</strong> beradi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. TURLI Cu²⁺ KOMPLEKSLAR SOLISHTIRISH
// ============================================================================
function SolishtirishJadvali() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Turli Cu²⁺ komplekslar — EPR solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Kompleks</th>
                <th className="text-center py-3 px-2 text-yellow-400">g<sub>∥</sub></th>
                <th className="text-center py-3 px-2 text-yellow-400">g<sub>⊥</sub></th>
                <th className="text-center py-3 px-2 text-yellow-400">A<sub>∥</sub> (G)</th>
                <th className="text-left py-3 px-2 text-yellow-400">Geometriya</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["[Cu(H₂O)₆]²⁺", "2.30", "2.05", "150", "Cho'zilgan oktaedr"],
                ["[Cu(NH₃)₄(H₂O)₂]²⁺", "2.25", "2.05", "180", "Tetragonal"],
                ["[Cu(en)₂(H₂O)₂]²⁺", "2.20", "2.04", "190", "Tetragonal"],
                ["[CuCl₄]²⁻", "2.38", "2.05", "60", "Yassi tetraedr"],
                ["Cu(acac)₂", "2.26", "2.04", "160", "Kvadrat planar"],
                ["CuSO₄·5H₂O", "2.27", "2.08", "140", "Tetragonal"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 ${i === 0 ? 'bg-blue-600/10' : ''} hover:bg-purple-800/20`}>
                  <td className="py-2 px-2 font-bold text-blue-400">{r[0]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[1]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[2]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[3]}</td>
                  <td className="py-2 px-2 text-[11px]">{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-purple-400 text-xs mt-3">
          * Barcha Cu²⁺ komplekslarida <strong>g<sub>∥</sub> &gt; g<sub>⊥</sub> &gt; 2.0</strong> —
          bu cho'zilgan oktaedr/tetragonal geometriyaning universal belgisi.
          A<sub>∥</sub> qiymati ligandning kovalentligiga bog'liq.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// 6. AMALIY QO'LLANILISH
// ============================================================================
function AmaliyQollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 Cu²⁺ EPR ning amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🧬</div>
            <h4 className="text-blue-400 font-bold mb-2">Biologiya</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Plastotsianin</strong> — fotosintez</li>
              <li><strong>Superoksid dismutaza</strong> — antioksidant</li>
              <li><strong>Tsereuloplazmin</strong> — Cu tashish</li>
              <li><strong>Wilson kasalligi</strong> diagnostikasi</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-blue-400 font-bold mb-2">Kataliz</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Cu-zeolitlar</strong> — NO<sub>x</sub> qaytarish</li>
              <li><strong>Cu-MOF</strong> — gaz saqlash</li>
              <li><strong>Cu nanopartikullar</strong> — organik sintez</li>
              <li><strong>AER (Advanced Oxidation)</strong> — suv tozalash</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🌍</div>
            <h4 className="text-blue-400 font-bold mb-2">Geologiya</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Minerallar</strong> — azurit, malaxit</li>
              <li><strong>Tuproq</strong> — Cu holati</li>
              <li><strong>EPR dating</strong> — yoshini aniqlash</li>
              <li><strong>Atrof-muhit</strong> — og'ir metallar</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚗️</div>
            <h4 className="text-blue-400 font-bold mb-2">Materiallar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>YSuperconductors</strong> — YBCO</li>
              <li><strong>Magnit materiallar</strong></li>
              <li><strong>Spin qoldiqlari</strong> — kvant hisoblash</li>
              <li><strong>Defektlar</strong> — yarimo'tkazgichlar</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-400 font-bold mb-2">🌟 Qiziqarli faktlar:</p>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• Cu²⁺ — <strong>EPR ning "ishchi oti"</strong> — eng keng o'rganilgan ion</li>
            <li>• <strong>Spin label</strong> sifatida oqsillar dinamikasini o'rganishda ishlatiladi</li>
            <li>• <strong>Dozimetriya</strong> — radiatsiya dozasi Cu²⁺ EPR orqali aniqlanadi</li>
            <li>• <strong>Arxeologiya</strong> — qadimgi sopol idishlardagi Cu EPR orqali tahlil qilinadi</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function CuH2O6EPR() {
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
          <span className="text-blue-400">[Cu(H₂O)₆]²⁺</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">📡 [Cu(H₂O)₆]²⁺ — EPR tahlili</h1>
          <p className="text-purple-400 text-sm">
            Cu²⁺ (d⁹) • S=1/2 • Aksial anizotropiya • Yahn-Teller • g<sub>∥</sub>=2.30, g<sub>⊥</sub>=2.05
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-blue-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-blue-400">[Cu(H₂O)₆]²⁺</span>
            <div>
              <h2 className="text-xl font-bold text-white">EPR tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Geksaakvamis(II)" — aksial anizotropiya klassikasi</p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Cu(H₂O)₆]²⁺ — <strong className="text-blue-400">Yahn-Teller effekti</strong>ning eng klassik namunasi.
              Cu²⁺ (d⁹) oktaedrik geometriyada <strong>cho'zilgan</strong> — 2 ta Cu−O bog'i uzun (2.40 Å),
              4 tasi qisqa (1.95 Å). Toq elektron <strong>d<sub>x²-y²</sub></strong> orbitalida joylashgan.
              EPR spektrida <strong>aksial anizotropiya</strong> ko'rinadi: g<sub>∥</sub>=2.30, g<sub>⊥</sub>=2.05.
              <strong> ⁶³Cu/⁶⁵Cu</strong> (I=3/2) bilan <strong>4 ta gipernozik cho'qqi</strong> hosil bo'ladi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">Cu²⁺ (d⁹)</p>
              <p className="text-purple-300">S = 1/2</p>
              <p className="text-purple-400 mt-1">1 toq e⁻</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">g<sub>∥</sub>=2.30</p>
              <p className="text-purple-300">g<sub>⊥</sub>=2.05</p>
              <p className="text-purple-400 mt-1">aksial</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">A<sub>∥</sub>≈150 G</p>
              <p className="text-purple-300">⁶³Cu/⁶⁵Cu</p>
              <p className="text-purple-400 mt-1">I=3/2</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">4+2</p>
              <p className="text-purple-300">1.95+2.40 Å</p>
              <p className="text-purple-400 mt-1">Yahn-Teller</p>
            </div>
          </div>
        </div>

        {/* EPR SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EPRSpektrSimulyatori />
        </div>

        {/* YAHN-TELLER VA G-FAKTOR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <YahnTellerGFactor />
        </div>

        {/* GIPERNOZIK TUZILISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <GipernozikTuzilish />
        </div>

        {/* SUPER-GIPERNOZIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SuperGipernozik />
        </div>

        {/* SOLISHTIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SolishtirishJadvali />
        </div>

        {/* AMALIYOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AmaliyQollanilish />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Cu²⁺ (d⁹) — <strong className="text-blue-400">Yahn-Teller cho'zilgan oktaedr</strong></li>
            <li>Toq elektron <strong>d<sub>x²-y²</sub></strong> orbitalida</li>
            <li><strong className="text-blue-400">Aksial anizotropiya</strong>: g<sub>∥</sub>=2.30, g<sub>⊥</sub>=2.05</li>
            <li>g<sub>∥</sub> &gt; g<sub>⊥</sub> &gt; 2.0 — cho'zilgan oktaedr belgisi</li>
            <li><strong>⁶³Cu/⁶⁵Cu</strong> (I=3/2) → <strong>4 ta gipernozik cho'qqi</strong></li>
            <li>A<sub>∥</sub> ≈ 150 G — ion bog'lanish (kovalentlik kuchsiz)</li>
            <li>Azot ligandlari bilan <strong>super-gipernozik</strong> (4 × 4 = 16 cho'qqi)</li>
            <li>Powder spektr — parallel va perpendikulyar aralashmasi</li>
            <li>Single crystal — aniq yo'nalishli spektr</li>
            <li>Amaliy: biologiya (plastotsianin), kataliz, geologiya, materiallar</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/epr/birikmalar/k3-fe-cn6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← K₃[Fe(CN)₆]
          </Link>
          <Link href="/ilmiy/tahlil/epr/birikmalar/co-cl4" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">
            [CoCl₄]²⁻ →
          </Link>
        </div>

      </section>
    </main>
  )
}