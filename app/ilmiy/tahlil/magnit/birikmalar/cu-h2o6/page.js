"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. SPIN-ONLY KALKULYATORI (Cu²⁺ d⁹)
// ============================================================================
function SpinOnlyCalc() {
  const [n, setN] = useState(1)
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

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Cu²⁺ uchun:</p>
          <p className="text-purple-200">
            Cu²⁺ (d⁹) — <strong>bitta toq elektron</strong> (n=1), spin-only μ<sub>so</sub> = <strong>1.73 μ<sub>B</sub></strong>.
            Ammo eksperimental μ<sub>eff</sub> ≈ <strong>1.9–2.1 μ<sub>B</sub></strong> — bu
            <strong> spin-orbital coupling</strong> tufayli. d⁹ holatda orbital moment
            qisman saqlanadi (ground state degenerat).
          </p>
        </div>

        <div className="bg-purple-900/50 rounded-lg p-3 text-xs">
          <p className="text-blue-400 font-bold mb-1">μ<sub>eff</sub> = g · √[S(S+1)] · μ<sub>B</sub></p>
          <p className="text-purple-200 mt-1">
            S = 1/2 bo'lganda: μ<sub>eff</sub> = g · √0.75 ≈ 0.866·g
          </p>
          <p className="text-purple-200 mt-1">
            g ≈ 2.15 (Cu²⁺ uchun tipik) → μ<sub>eff</sub> ≈ 1.86 μ<sub>B</sub>
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. YAHN-TELLER EFFEKTI (asosiy xususiyat!)
// ============================================================================
function YahnTellerEffect() {
  const [elongation, setElongation] = useState(0.23) // 2.40 - 1.95 = 0.45 Å farq
  const [mode, setMode] = useState("elongation") // elongation, compression

  // Bog' uzunliklari
  const equatorial = 1.95 // qisqa bog'lar (4 ta)
  const axial = equatorial + (mode === "elongation" ? elongation : -elongation * 0.5)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ Yahn-Teller effekti — Cu²⁺ ning asosiy xususiyati</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">⚠️ Yahn-Teller teoremasi (1937):</p>
          <p className="text-purple-200 text-xs">
            Agar molekulaning <strong>elektron ground state</strong> degenerat bo'lsa (bir nechta
            bir xil energiyali holat), geometriya <strong>avtomatik buziladi</strong> — degeneratsiya
            yo'qoladi va energiya kamayadi. Cu²⁺ (d⁹) — <strong>eng klassik namuna</strong>!
          </p>
        </div>

        {/* KRISTALL MAYDON DIAGRAMMASI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-yellow-400 font-bold mb-3">Ideal oktaedr (buzilmagan)</h4>
            <div className="font-mono text-xs space-y-2">
              <div className="flex justify-between items-center border-b border-purple-700/30 pb-2">
                <span className="text-red-400 w-24">e<sub>g</sub></span>
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-[9px] text-purple-400">d<sub>z²</sub></p>
                    <p className="text-yellow-400">↑↓</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-purple-400">d<sub>x²-y²</sub></p>
                    <p className="text-yellow-400">↑</p>
                  </div>
                </div>
              </div>
              <div className="text-center text-red-400 text-[10px] py-1">
                ⚠️ DEGENERAT — beqaror!
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-emerald-400 w-24">t<sub>2g</sub></span>
                <div className="flex gap-2">
                  <span className="text-yellow-400">↑↓</span>
                  <span className="text-yellow-400">↑↓</span>
                  <span className="text-yellow-400">↑↓</span>
                </div>
              </div>
              <div className="text-center text-purple-400 text-[10px] mt-2">
                ²E<sub>g</sub> ground state — degenerat
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-yellow-400 font-bold mb-3">Buzilgan oktaedr (elongatsiya)</h4>
            <div className="font-mono text-xs space-y-2">
              <div className="flex justify-between items-center border-b border-purple-700/30 pb-1">
                <span className="text-red-400 w-24">d<sub>x²-y²</sub></span>
                <span className="text-yellow-400">↑</span>
              </div>
              <div className="flex justify-between items-center border-b border-purple-700/30 pb-1">
                <span className="text-orange-400 w-24">d<sub>z²</sub></span>
                <span className="text-yellow-400">↑↓</span>
              </div>
              <div className="flex justify-between items-center border-b border-purple-700/30 pb-1">
                <span className="text-emerald-400 w-24">d<sub>xy</sub></span>
                <span className="text-yellow-400">↑↓</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-blue-400 w-24">d<sub>xz</sub>, d<sub>yz</sub></span>
                <div className="flex gap-2">
                  <span className="text-yellow-400">↑↓</span>
                  <span className="text-yellow-400">↑↓</span>
                </div>
              </div>
              <div className="text-center text-emerald-400 text-[10px] mt-2">
                ✓ Degeneratsiya yo'qoldi
              </div>
            </div>
          </div>
        </div>

        {/* SLIDERLAR */}
        <div className="space-y-3">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Buzilish darajasi:</span>
              <span className="text-emerald-400 font-mono">{elongation.toFixed(2)} Å</span>
            </label>
            <input type="range" min="0" max="0.6" step="0.01" value={elongation}
              onChange={(e) => setElongation(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setMode("elongation")}
              className={`px-3 py-2 rounded-lg text-xs font-bold ${mode === "elongation" ? 'bg-blue-600/80 text-white' : 'bg-purple-800/40 text-purple-300'}`}>
              ⬆️ Elongatsiya (cho'zilish)
            </button>
            <button onClick={() => setMode("compression")}
              className={`px-3 py-2 rounded-lg text-xs font-bold ${mode === "compression" ? 'bg-blue-600/80 text-white' : 'bg-purple-800/40 text-purple-300'}`}>
              ⬇️ Kompressiya (qisqarish)
            </button>
          </div>
        </div>

        {/* SVG VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-blue-400 font-bold text-xs mb-3">
            {mode === "elongation" ? "Cho'zilgan oktaedr" : "Qisqargan oktaedr"}:
          </h5>
          <svg viewBox="0 0 400 280" className="w-full h-64">
            {/* Markaziy Cu */}
            <circle cx="200" cy="140" r="20" fill="#3b82f6" />
            <text x="200" y="146" fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">Cu²⁺</text>

            {/* Ekvatorial ligandlar (qisqa — doim bir xil) */}
            {[
              { x: 120, y: 140 }, // chap
              { x: 280, y: 140 }, // o'ng
              { x: 200, y: 80 },  // yuqori-ekvatorial (3D illusion)
              { x: 200, y: 200 }, // pastki-ekvatorial
            ].map((pos, i) => (
              <g key={i}>
                <line x1="200" y1="140" x2={pos.x} y2={pos.y} stroke="#10b981" strokeWidth="2" />
                <circle cx={pos.x} cy={pos.y} r="14" fill="#10b981" opacity="0.9" />
                <text x={pos.x} y={pos.y + 4} fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">O</text>
              </g>
            ))}

            {/* Aksial ligandlar (o'zgaruvchan) */}
            <line x1="200" y1="140" x2="200" y2={140 - 60 - elongation * 100} stroke="#ef4444" strokeWidth="2" />
            <circle cx="200" cy={140 - 60 - elongation * 100} r="14" fill="#ef4444" opacity="0.9" />
            <text x="200" y={140 - 60 - elongation * 100 + 4} fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">O</text>

            <line x1="200" y1="140" x2="200" y2={140 + 60 + elongation * 100} stroke="#ef4444" strokeWidth="2" />
            <circle cx="200" cy={140 + 60 + elongation * 100} r="14" fill="#ef4444" opacity="0.9" />
            <text x="200" y={140 + 60 + elongation * 100 + 4} fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">O</text>

            {/* Bog' uzunliklari ko'rsatkichlari */}
            <text x="240" y="110" fill="#10b981" fontSize="10" fontWeight="bold">1.95 Å</text>
            <text x="240" y={130 - elongation * 50} fill="#ef4444" fontSize="10" fontWeight="bold">
              {axial.toFixed(2)} Å
            </text>

            {/* Label */}
            <text x="200" y="275" fill="#c4b5fd" fontSize="10" textAnchor="middle">
              {mode === "elongation" ? "4 qisqa + 2 uzun (tetragonal elongatsiya)" : "4 uzun + 2 qisqa (kompressiya)"}
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Ekvatorial</p>
            <p className="text-emerald-400 font-bold font-mono">{equatorial.toFixed(2)} Å</p>
            <p className="text-purple-500 text-[10px]">4 ta O</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Aksial</p>
            <p className="text-red-400 font-bold font-mono">{axial.toFixed(2)} Å</p>
            <p className="text-purple-500 text-[10px]">2 ta O</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Farq</p>
            <p className="text-yellow-400 font-bold font-mono">{Math.abs(axial - equatorial).toFixed(2)} Å</p>
            <p className="text-purple-500 text-[10px]">buzilish</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun elongatsiya ko'proq?</p>
          <p className="text-purple-200">
            <strong>Tetragonal elongatsiya</strong> (z-o'q cho'zilishi) eng keng tarqalgan.
            Sababi: d<sub>z²</sub> pastga tushadi, d<sub>x²-y²</sub> ko'tariladi. Toq elektron
            <strong> d<sub>x²-y²</sub></strong> orbitalida qoladi (yuqori energiya, antibonding).
            Kompressiya kam uchraydi (faqat ba'zi komplekslarda).
            Bu EPR da <strong>g<sub>∥</sub> &gt; g<sub>⊥</sub></strong> bo'lishining sababi!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. EPR SPEKTRI (Cu²⁺ — anizotrop g-faktor)
// ============================================================================
function EPRSpectrum() {
  const [gParallel, setGParallel] = useState(2.30)
  const [gPerp, setGPerp] = useState(2.05)
  const [Aparallel, setAparallel] = useState(150) // 10^-4 cm^-1

  // Rezonans maydoni: B = hν/(gμ_B)
  // X-band: ν = 9.5 GHz → B ≈ 3400/g Gauss
  const B_para = 3400 / gParallel
  const B_perp = 3400 / gPerp

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📡 EPR spektri — Cu²⁺ (S=1/2)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">🎯 Cu²⁺ EPR — klassik namuna:</p>
          <p className="text-purple-200 text-xs">
            Cu²⁺ (d⁹, S=1/2) — <strong>ideal EPR obyekti</strong>. Bitta toq elektron,
            I = 3/2 (⁶³Cu va ⁶⁵Cu — ikkalasi ham 3/2 spinli, ~70% tabiiy).
            <strong> Anizotrop g-faktor</strong> — Yahn-Teller effekti tufayli.
          </p>
        </div>

        {/* G-FAKTORLAR */}
        <div className="space-y-3">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">g<sub>∥</sub> (parallel, z-o'q):</span>
              <span className="text-emerald-400 font-mono">{gParallel.toFixed(2)}</span>
            </label>
            <input type="range" min="2.0" max="2.5" step="0.01" value={gParallel}
              onChange={(e) => setGParallel(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">g<sub>⊥</sub> (perpendikulyar):</span>
              <span className="text-emerald-400 font-mono">{gPerp.toFixed(2)}</span>
            </label>
            <input type="range" min="2.0" max="2.3" step="0.01" value={gPerp}
              onChange={(e) => setGPerp(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">g<sub>∥</sub></p>
            <p className="text-blue-400 font-bold font-mono">{gParallel.toFixed(2)}</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">g<sub>⊥</sub></p>
            <p className="text-blue-400 font-bold font-mono">{gPerp.toFixed(2)}</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">B<sub>∥</sub> (G)</p>
            <p className="text-yellow-400 font-bold font-mono">{B_para.toFixed(0)}</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">B<sub>⊥</sub> (G)</p>
            <p className="text-yellow-400 font-bold font-mono">{B_perp.toFixed(0)}</p>
          </div>
        </div>

        {/* EPR SPEKTRI */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-blue-400 font-bold text-xs mb-3">X-band (9.5 GHz) EPR spektri:</h5>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="170" x2="380" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <text x="210" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">B (Gauss)</text>
            <text x="15" y="95" fill="#c4b5fd" fontSize="8" transform="rotate(-90, 15, 95)">dI/dB</text>

            {/* Scale */}
            {[2000, 2500, 3000, 3500, 4000].map((v, i) => (
              <text key={i} x={40 + (i * 85)} y="185" fill="#a78bfa" fontSize="8" textAnchor="middle">
                {v}
              </text>
            ))}

            {/* Parallel peaks (4 cho'qqi - Cu hyperfine, I=3/2) */}
            {[0, 1, 2, 3].map(i => {
              const B = B_para + (i - 1.5) * (Aparallel * 0.1)
              const x = 40 + ((B - 2000) / 2000) * 340
              if (x < 40 || x > 380) return null
              return (
                <g key={`para-${i}`}>
                  <polyline
                    points={`${x-10},100 ${x-5},130 ${x},80 ${x+5},130 ${x+10},100`}
                    fill="none" stroke="#ef4444" strokeWidth="1.5" />
                </g>
              )
            })}

            {/* Perpendicular peaks (4 cho'qqi) */}
            {[0, 1, 2, 3].map(i => {
              const B = B_perp + (i - 1.5) * 10
              const x = 40 + ((B - 2000) / 2000) * 340
              if (x < 40 || x > 380) return null
              return (
                <g key={`perp-${i}`}>
                  <polyline
                    points={`${x-8},100 ${x-4},115 ${x},95 ${x+4},115 ${x+8},100`}
                    fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                </g>
              )
            })}

            {/* Labels */}
            <text x={40 + ((B_para - 2000) / 2000) * 340} y="40" fill="#ef4444" fontSize="9" textAnchor="middle" fontWeight="bold">
              g∥ = {gParallel.toFixed(2)}
            </text>
            <text x={40 + ((B_perp - 2000) / 2000) * 340} y="60" fill="#3b82f6" fontSize="9" textAnchor="middle" fontWeight="bold">
              g⊥ = {gPerp.toFixed(2)}
            </text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 g-faktorlar nima haqida gapiradi?</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>g<sub>∥</sub> &gt; g<sub>⊥</sub> &gt; 2.0</strong> — elongatsiyalangan oktaedr (d<sub>x²-y²</sub> ground state)</li>
            <li><strong>g<sub>⊥</sub> &gt; g<sub>∥</sub> &gt; 2.0</strong> — kompressiyalangan oktaedr (d<sub>z²</sub> ground state)</li>
            <li><strong>Hiperfin struktura</strong> (4 cho'qqi) — ⁶³Cu va ⁶⁵Cu (I = 3/2) bilan bog'lanish</li>
            <li><strong>A<sub>∥</sub></strong> qiymati — kovalentlik darajasi (kichik A = ko'proq kovalent)</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-blue-400 font-bold mb-1">g<sub>o'rtacha</sub> hisoblash:</p>
            <p className="text-purple-200 font-mono">
              g<sub>av</sub> = (g<sub>∥</sub> + 2·g<sub>⊥</sub>)/3
            </p>
            <p className="text-emerald-400 font-mono font-bold mt-1">
              = {((gParallel + 2 * gPerp) / 3).toFixed(3)}
            </p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-blue-400 font-bold mb-1">μ<sub>eff</sub> (EPR dan):</p>
            <p className="text-purple-200 font-mono">
              μ = g<sub>av</sub> · √(S(S+1))
            </p>
            <p className="text-emerald-400 font-mono font-bold mt-1">
              = {(((gParallel + 2 * gPerp) / 3) * Math.sqrt(0.75)).toFixed(3)} μ<sub>B</sub>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. UV-VIS SPEKTRI (ko'k rang sababi)
// ============================================================================
function UVVisSpektr() {
  const [lambdaMax, setLambdaMax] = useState(800) // nm

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌈 UV-Vis spektri — ko'k rang sababi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">λ<sub>max</sub> (d-d o'tish):</span>
            <span className="text-emerald-400 font-mono">{lambdaMax} nm</span>
          </label>
          <input type="range" min="600" max="1000" step="10" value={lambdaMax}
            onChange={(e) => setLambdaMax(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="170" x2="380" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <text x="210" y="195" fill="#c4b5fd" fontSize="10" textAnchor="middle">λ (nm)</text>
            <text x="15" y="95" fill="#c4b5fd" fontSize="9" transform="rotate(-90, 15, 95)">A</text>

            {/* Wavelength markers */}
            {[400, 500, 600, 700, 800, 900].map((wl, i) => (
              <text key={i} x={40 + ((wl - 350) / 600) * 340} y="185" fill="#a78bfa" fontSize="8" textAnchor="middle">
                {wl}
              </text>
            ))}

            {/* Color spectrum background */}
            <defs>
              <linearGradient id="spectrum" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b00ff" />
                <stop offset="15%" stopColor="#0000ff" />
                <stop offset="30%" stopColor="#00ff00" />
                <stop offset="50%" stopColor="#ffff00" />
                <stop offset="70%" stopColor="#ff8800" />
                <stop offset="100%" stopColor="#ff0000" />
              </linearGradient>
            </defs>
            <rect x="40" y="165" width="340" height="5" fill="url(#spectrum)" opacity="0.3" />

            {/* Main peak */}
            <polyline
              points={Array.from({ length: 100 }, (_, i) => {
                const wl = 400 + i * 6
                const x = 40 + ((wl - 350) / 600) * 340
                const amplitude = Math.exp(-0.5 * Math.pow((wl - lambdaMax) / 80, 2)) * 120
                const y = 170 - amplitude
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#3b82f6" strokeWidth="2" />

            {/* Peak marker */}
            <line x1={40 + ((lambdaMax - 350) / 600) * 340} y1="50" x2={40 + ((lambdaMax - 350) / 600) * 340} y2="20" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((lambdaMax - 350) / 600) * 340} y="15" fill="#f59e0b" fontSize="9" textAnchor="middle" fontWeight="bold">
              {lambdaMax} nm
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">λ<sub>max</sub></p>
            <p className="text-blue-400 font-bold font-mono">{lambdaMax} nm</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">ΔE</p>
            <p className="text-yellow-400 font-bold font-mono">{(1240 / lambdaMax).toFixed(2)} eV</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">Δ<sub>o</sub></p>
            <p className="text-emerald-400 font-bold font-mono">{Math.round(1e7 / lambdaMax)} cm⁻¹</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun ko'k rang?</p>
          <p className="text-purple-200">
            {lambdaMax} nm — <strong>qizil/to'q sariq</strong> sohasida yutilish.
            Komplementar rang — <strong className="text-blue-400">ko'k</strong>!
            O'tish: <strong>d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub> → d<sub>x²-y²</sub></strong>.
            Laporte-taqiqlangan (markaziy simmetrik), ε ≈ 10–30 M⁻¹cm⁻¹ (kuchsiz).
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-2">Turli Cu²⁺ komplekslari:</h5>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="text-left py-2 text-yellow-400">Kompleks</th>
                  <th className="text-center py-2 text-yellow-400">λ<sub>max</sub> (nm)</th>
                  <th className="text-center py-2 text-yellow-400">Δ<sub>o</sub> (cm⁻¹)</th>
                  <th className="text-left py-2 text-yellow-400">Rang</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  ["[Cu(H₂O)₆]²⁺", "800", "12500", "Ko'k"],
                  ["[Cu(NH₃)₄(H₂O)₂]²⁺", "620", "16100", "To'q ko'k"],
                  ["[Cu(en)₂]²⁺", "570", "17500", "Binafsha-ko'k"],
                  ["[CuCl₄]²⁻", "700", "14300", "Sariq-yashil"],
                  ["[Cu(acac)₂]", "650", "15400", "Yashil"],
                ].map((r, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${i === 0 ? 'bg-blue-600/10' : ''}`}>
                    <td className="py-1 font-bold text-blue-400">{r[0]}</td>
                    <td className="py-1 text-center font-mono">{r[1]}</td>
                    <td className="py-1 text-center font-mono">{r[2]}</td>
                    <td className="py-1">{r[3]}</td>
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
// 5. CURIE-WEISS QONUNI (χ vs T)
// ============================================================================
function CurieWeiss() {
  const [C, setC] = useState(0.45)
  const [theta, setTheta] = useState(-2)

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
              <span className="text-yellow-400 font-bold">C (Curie doimiysi):</span>
              <span className="text-emerald-400 font-mono">{C.toFixed(2)} emu·K/mol</span>
            </label>
            <input type="range" min="0.2" max="1" step="0.01" value={C}
              onChange={(e) => setC(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">θ (Weiss doimiysi):</span>
              <span className={`font-mono font-bold ${theta > 0 ? 'text-red-400' : theta < 0 ? 'text-blue-400' : 'text-purple-400'}`}>
                {theta.toFixed(1)} K
              </span>
            </label>
            <input type="range" min="-50" max="50" step="1" value={theta}
              onChange={(e) => setTheta(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
            <div className="flex justify-between text-[10px] mt-1">
              <span className="text-blue-400">Antiferro (−)</span>
              <span className="text-purple-400">Ideal (0)</span>
              <span className="text-red-400">Ferro (+)</span>
            </div>
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
            <h5 className="text-emerald-400 font-bold text-xs mb-2">1/χ vs T (chiziqli)</h5>
            <svg viewBox="0 0 300 180" className="w-full h-36 bg-purple-950 rounded">
              <line x1="35" y1="150" x2="290" y2="150" stroke="#4c1d95" strokeWidth="1" />
              <line x1="35" y1="10" x2="35" y2="150" stroke="#4c1d95" strokeWidth="1" />
              <text x="160" y="175" fill="#c4b5fd" fontSize="9" textAnchor="middle">T (K)</text>
              <text x="10" y="80" fill="#c4b5fd" fontSize="8" transform="rotate(-90, 10, 80)">1/χ</text>

              {theta >= 0 && theta <= 300 && (
                <>
                  <circle cx={35 + (theta / 300) * 255} cy="150" r="3" fill="#f97316" />
                  <line x1={35 + (theta / 300) * 255} y1="150" x2={35 + (theta / 300) * 255} y2="10" stroke="#f97316" strokeWidth="0.5" strokeDasharray="2,2" />
                </>
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
          <p className="text-yellow-400 font-bold mb-1">💡 [Cu(H₂O)₆]²⁺ uchun:</p>
          <p className="text-purple-200">
            θ ≈ <strong>−2 K</strong> — juda kuchsiz <strong>antiferromagnit</strong> o'zaro ta'sir.
            Cu²⁺ ionlari orasida vodorod bog'lari orqali superexchange.
            Paramagnit holat keng harorat oralig'ida (5-300 K) saqlanadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. Cu²⁺ KOMPLEKSLARI SOLISHTIRISH
// ============================================================================
function SolishtirishJadvali() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Turli Cu²⁺ komplekslari</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-2 px-2 text-yellow-400">Kompleks</th>
                <th className="text-center py-2 px-2 text-yellow-400">Geometriya</th>
                <th className="text-center py-2 px-2 text-yellow-400">μ<sub>eff</sub></th>
                <th className="text-center py-2 px-2 text-yellow-400">g<sub>∥</sub></th>
                <th className="text-center py-2 px-2 text-yellow-400">g<sub>⊥</sub></th>
                <th className="text-left py-2 px-2 text-yellow-400">Rang</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["[Cu(H₂O)₆]²⁺", "Oktaedr (elong.)", "1.9", "2.30", "2.05", "Ko'k"],
                ["[Cu(NH₃)₄(H₂O)₂]²⁺", "Tetragonal", "1.85", "2.25", "2.05", "To'q ko'k"],
                ["[CuCl₄]²⁻", "Tetraedr (buz.)", "1.9", "2.38", "2.05", "Sariq-yashil"],
                ["Cu(acac)₂", "Kvadrat tekislik", "1.8", "2.26", "2.04", "Yashil"],
                ["[Cu(en)₂(H₂O)₂]²⁺", "Tetragonal", "1.9", "2.20", "2.04", "Binafsha"],
                ["CuSO₄·5H₂O", "Tetragonal", "1.9", "2.27", "2.08", "Ko'k"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 ${i === 0 ? 'bg-blue-600/10' : ''}`}>
                  <td className="py-2 px-2 font-bold text-blue-400">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-[11px]">{r[1]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[2]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[3]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[4]}</td>
                  <td className="py-2 px-2">{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-purple-400 text-xs mt-3">
          * Barcha Cu²⁺ komplekslarida <strong>Yahn-Teller effekti</strong> kuzatiladi.
          Geometriya doim "ideal" dan farq qiladi. EPR g-faktorlar o'xshash, lekin
          ligand maydoni kuchi bilan biroz o'zgaradi.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// 7. CuSO₄·5H₂O — klassik misol
// ============================================================================
function CuSO45H2O() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💎 CuSO₄·5H₂O — "mis kuporos" klassik namunasi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">⚗️ Qiziqarli fakt:</p>
          <p className="text-purple-200 text-xs">
            CuSO₄·5H₂O ("mis kuporos") — eng mashhur Cu²⁺ birikmalaridan biri.
            <strong> 5 ta suv molekulasi</strong> turli vazifalarda:
            4 tasi Cu²⁺ ga bevosita bog'langan (koordinatsion), 1 tasi SO₄²⁻ bilan
            vodorod bog' orqali. Qizdirilganda suv yo'qoladi → oq CuSO₄ (rang o'zgarishi!).
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-blue-400 font-bold text-xs mb-3">Struktura (sxematik):</h5>
          <svg viewBox="0 0 400 250" className="w-full h-56">
            {/* Markaziy Cu */}
            <circle cx="200" cy="125" r="18" fill="#3b82f6" />
            <text x="200" y="131" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">Cu²⁺</text>

            {/* 4 ta ekvatorial H₂O */}
            {[
              { x: 130, y: 125 },
              { x: 270, y: 125 },
              { x: 200, y: 70 },
              { x: 200, y: 180 },
            ].map((pos, i) => (
              <g key={`eq-${i}`}>
                <line x1="200" y1="125" x2={pos.x} y2={pos.y} stroke="#10b981" strokeWidth="1.5" />
                <circle cx={pos.x} cy={pos.y} r="12" fill="#06b6d4" />
                <text x={pos.x} y={pos.y + 4} fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">H₂O</text>
              </g>
            ))}

            {/* 2 ta aksial — biri H₂O, biri O (sulfat) */}
            <line x1="200" y1="125" x2="200" y2="40" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
            <circle cx="200" cy="40" r="12" fill="#06b6d4" opacity="0.7" />
            <text x="200" y="44" fill="white" fontSize="9" textAnchor="middle">H₂O</text>

            <line x1="200" y1="125" x2="200" y2="210" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
            <circle cx="200" cy="210" r="12" fill="#ef4444" opacity="0.7" />
            <text x="200" y="214" fill="white" fontSize="9" textAnchor="middle">O</text>

            {/* 5-chi suv (H-bond orqali) */}
            <line x1="200" y1="40" x2="260" y2="25" stroke="#a78bfa" strokeWidth="0.8" strokeDasharray="1,1" />
            <circle cx="260" cy="25" r="10" fill="#f59e0b" />
            <text x="260" y="29" fill="white" fontSize="8" textAnchor="middle">H₂O</text>

            {/* Labels */}
            <text x="310" y="130" fill="#10b981" fontSize="9" fontWeight="bold">4× qisqa</text>
            <text x="310" y="145" fill="#10b981" fontSize="9">(1.95-2.00 Å)</text>
            <text x="250" y="220" fill="#ef4444" fontSize="9" fontWeight="bold">2× uzun (2.35 Å)</text>
            <text x="310" y="30" fill="#f59e0b" fontSize="8">5-chi suv</text>
            <text x="310" y="42" fill="#f59e0b" fontSize="8">(H-bond)</text>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400 font-bold mb-2">💧 Suvni yo'qotish:</p>
            <div className="font-mono text-xs space-y-1 text-purple-200">
              <p>CuSO₄·5H₂O → <span className="text-yellow-400">~110°C</span> → CuSO₄·H₂O</p>
              <p>CuSO₄·H₂O → <span className="text-yellow-400">~250°C</span> → CuSO₄ (oq)</p>
              <p>CuSO₄ → <span className="text-red-400">~650°C</span> → CuO + SO₃</p>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">🎨 Rang o'zgarishi:</p>
            <div className="flex items-center gap-2 justify-center mt-3">
              <div className="w-8 h-8 rounded bg-blue-500 border border-blue-400"></div>
              <span className="text-purple-300">→</span>
              <div className="w-8 h-8 rounded bg-blue-300 border border-blue-200"></div>
              <span className="text-purple-300">→</span>
              <div className="w-8 h-8 rounded bg-white border border-gray-300"></div>
            </div>
            <p className="text-purple-300 text-[10px] text-center mt-2">
              Ko'k → och ko'k → oq
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Amaliy qo'llanilishi:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li>Qishloq xo'jaligi — <strong>bordo suyuqligi</strong> (fungitsid)</li>
            <li>Elektroplating — mis qoplash</li>
            <li>Ta'lim — <strong>kristall o'stirish</strong> tajribalari</li>
            <li>Suvni suvsizlantirish indikatori (oq → ko'k = suv bor)</li>
            <li>Kimyoviy sintez boshlang'ich materiali</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 8. BIOANORGANIK KIMYO (gemotsianin, plastotsianin)
// ============================================================================
function Bioanorganik() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧬 Bioanorganik kimyo — tabiatda Cu²⁺</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">🌿 Mis — hayotiy element:</p>
          <p className="text-purple-200 text-xs">
            Mis — <strong>hayotiy zarur mikroelement</strong>. Odam tanasida ~100 mg mis bor.
            Bir nechta muhim oqsillar Cu ni o'z ichiga oladi:
            gemotsianin (kislorod tashish), plastotsianin (fotosintez),
            sitoxrom c oksidaza (nafas olish).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🩸</div>
            <h4 className="text-blue-400 font-bold mb-2">Gemotsianin</h4>
            <p className="text-purple-200 text-xs mb-2">
              <strong>Kislorod tashuvchi</strong> oqsil (molyuskalar, artropodlarda).
              GEMoglobin o'rnini bosadi.
            </p>
            <ul className="text-purple-300 text-xs space-y-1 list-disc list-inside">
              <li>2 ta Cu⁺ ion (deoksi — rangsiz)</li>
              <li>O₂ bog'langanda → Cu²⁺ (ko'k)</li>
              <li><strong>Molyuska qoni ko'k!</strong></li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🌱</div>
            <h4 className="text-emerald-400 font-bold mb-2">Plastotsianin</h4>
            <p className="text-purple-200 text-xs mb-2">
              <strong>Fotosintez</strong>da elektron tashuvchi.
              O'simliklar va suvo'simliklarida.
            </p>
            <ul className="text-purple-300 text-xs space-y-1 list-disc list-inside">
              <li>1 ta Cu (Cu⁺/Cu²⁺ aylanishi)</li>
              <li>Ko'k rang (LMCT, S→Cu)</li>
              <li>ε ≈ 5000 (juda kuchli!)</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="text-yellow-400 font-bold mb-2">Sitoxrom c oksidaza</h4>
            <p className="text-purple-200 text-xs mb-2">
              <strong>Nafas olish zanjiri</strong>ning oxirgi fermenti.
              O₂ ni H₂O ga qaytaradi.
            </p>
            <ul className="text-purple-300 text-xs space-y-1 list-disc list-inside">
              <li>2 ta Cu markazi (Cu<sub>A</sub>, Cu<sub>B</sub>)</li>
              <li>Cu<sub>A</sub> — binuklear (2 Cu)</li>
              <li>Mitoxondriyada joylashgan</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🛡️</div>
            <h4 className="text-pink-400 font-bold mb-2">Superoksid dismutaza</h4>
            <p className="text-purple-200 text-xs mb-2">
              <strong>Antioksidant ferment</strong> — O₂⁻ radikallarini parchalaydi.
            </p>
            <ul className="text-purple-300 text-xs space-y-1 list-disc list-inside">
              <li>Cu,Zn-SOD (odamda)</li>
              <li>Cu²⁺ ↔ Cu⁺ aylanishi</li>
              <li>Kasaliklarda muhim rol</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-400 font-bold mb-2">🔬 Entatik holat (Entatic state):</p>
          <p className="text-purple-200 text-xs">
            Biologik Cu oqsillarida metall <strong>"kuchlangan" geometriya</strong>da bo'ladi.
            Bu Cu⁺ va Cu²⁺ holatlariga moslashuvchan — tez elektron ko'chishi uchun ideal.
            Oddiy [Cu(H₂O)₆]²⁺ dan <strong>butunlay boshqa</strong> xossalarga ega.
          </p>
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
                <p className="text-yellow-400 font-bold">Qadimgi davr — mis kuporos</p>
                <p className="text-purple-200 text-xs mt-1">
                  CuSO₄·5H₂O qadimgi Rim va Xitoyda ishlatilgan. "Chalkanthite" minerali.
                  Tibbiyot va bo'yoqchilikda qo'llangan.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1937 — Yahn-Teller teoremasi</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Hermann Yahn</strong> va <strong>Edward Teller</strong> matematik isbotladilar:
                  degenerat ground state → geometriya buzilishi.
                  Cu²⁺ (d⁹) eng mashhur namunaga aylandi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📡</div>
              <div>
                <p className="text-yellow-400 font-bold">1950-60 — EPR davri</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>B. Bleaney</strong> va boshqalar Cu²⁺ ning EPR spektrlarini
                  batafsil o'rgandilar. g-faktorlar va hiperfin tuzilish tushunildi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💎</div>
              <div>
                <p className="text-yellow-400 font-bold">1960+ — XRD strukturalari</p>
                <p className="text-purple-200 text-xs mt-1">
                  Cu²⁺ komplekslarining rentgen strukturaviy tahlili
                  <strong> tetragonal buzilishni</strong> aniq ko'rsatdi.
                  Misol: CuSO₄·5H₂O — 4 qisqa + 2 uzun bog'.
                </p>
              </div>
            </div>
          </div>
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
            <div className="text-3xl mb-2">🌱</div>
            <h4 className="text-blue-400 font-bold mb-2">Qishloq xo'jaligi</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Bordo suyuqligi</strong> (CuSO₄ + Ca(OH)₂)</li>
              <li>Fungitsid — qo'ziqorin kasalliklariga</li>
              <li>Mikroo'g'it — Cu yetishmovchiligi</li>
              <li>Algitsid — suvo'simliklarga qarshi</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔌</div>
            <h4 className="text-blue-400 font-bold mb-2">Elektrokimyo</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Elektroplating</strong> — mis qoplash</li>
              <li>Daniell elementi (galvanik element)</li>
              <li>Mis rafinatsiyasi</li>
              <li>PCB ishlab chiqarish</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🎨</div>
            <h4 className="text-blue-400 font-bold mb-2">Pigmentlar va bo'yoqlar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li>Ko'k-yashil keramika glazurlari</li>
              <li>Mineral pigmentlar</li>
              <li>Photography (cyanotype)</li>
              <li>Tatuirovka siyohi</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-blue-400 font-bold mb-2">Analitik kimyo</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Biuret testi</strong> — oqsil aniqlash</li>
              <li><strong>Fehling eritmasi</strong> — qand aniqlash</li>
              <li><strong>Benedict reaktivi</strong> — glukoza</li>
              <li>Iodometriya — mis miqdoriy</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">⚠️ Toksiklik:</p>
          <p className="text-purple-200 text-xs">
            Cu²⁺ — <strong>o'rta darajada toksik</strong>. Oshqozon-ichak traktida
            tez so'riladi, ko'ngil aynishi, qusish chaqiradi.
            <strong> Vilson kasalligi</strong> — mis metabolizmi buzilishi (genetik).
            Suv organizmlari uchun juda toksik (baliqlar, qisqichbaqalar).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function CuH2O6Magnit() {
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
          <span className="text-blue-400">[Cu(H₂O)₆]²⁺</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🧲 [Cu(H₂O)₆]²⁺ — Magnit tahlili</h1>
          <p className="text-purple-400 text-sm">
            Cu²⁺ (d⁹, S=1/2) • Paramagnit • Yahn-Teller • μ<sub>eff</sub> ≈ 1.9 μ<sub>B</sub> • g<sub>∥</sub>=2.30
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-blue-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-2xl md:text-4xl font-extrabold font-mono text-blue-400">[Cu(H₂O)₆]²⁺</span>
            <div>
              <h2 className="text-xl font-bold text-white">Magnit tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Geksaakvamis(II)" — Yahn-Teller effekti klassikasi</p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Cu(H₂O)₆]²⁺ — <strong className="text-blue-400">d⁹ konfiguratsiyali</strong> klassik kompleks.
              Bitta toq elektron (S=1/2) mavjud, ya'ni <strong>paramagnit</strong>.
              Eng qiziqarlisi — <strong className="text-yellow-400">Yahn-Teller effekti</strong> tufayli
              oktaedrik geometriya <strong>buziladi</strong>: 2 ta Cu−O bog'i uzun (~2.40 Å),
              4 tasi qisqa (~1.95 Å). Bu <strong>tetragonal elongatsiya</strong> deb ataladi.
              μ<sub>eff</sub> ≈ <strong>1.9 μ<sub>B</sub></strong> — spin-only (1.73) dan biroz yuqori.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">d⁹, S=1/2</p>
              <p className="text-purple-300">1 toq e⁻</p>
              <p className="text-purple-400 mt-1">Paramagnit</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">μ ≈ 1.9 μ<sub>B</sub></p>
              <p className="text-purple-300">298 K da</p>
              <p className="text-purple-400 mt-1">&gt; spin-only</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">g<sub>∥</sub>=2.30</p>
              <p className="text-purple-300">g<sub>⊥</sub>=2.05</p>
              <p className="text-purple-400 mt-1">EPR</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">4+2</p>
              <p className="text-purple-300">1.95 + 2.40 Å</p>
              <p className="text-purple-400 mt-1">Yahn-Teller</p>
            </div>
          </div>
        </div>

        {/* YAHN-TELLER EFFEKTI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <YahnTellerEffect />
        </div>

        {/* EPR SPEKTRI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EPRSpectrum />
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

        {/* CuSO4·5H2O */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CuSO45H2O />
        </div>

        {/* SOLISHTIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SolishtirishJadvali />
        </div>

        {/* BIOANORGANIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Bioanorganik />
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
            <li>Cu²⁺ (d⁹, S=1/2) — <strong className="text-blue-400">paramagnit</strong>, bitta toq elektron</li>
            <li>μ<sub>eff</sub> ≈ <strong>1.9 μ<sub>B</sub></strong> — spin-only (1.73) dan biroz yuqori</li>
            <li><strong className="text-yellow-400">Yahn-Teller effekti</strong> — oktaedr cho'zilgan (4 qisqa + 2 uzun bog')</li>
            <li>EPR: <strong>g<sub>∥</sub> = 2.30, g<sub>⊥</sub> = 2.05</strong> — elongatsiyaning aniq belgisi</li>
            <li>⁶³Cu, ⁶⁵Cu (I=3/2) — <strong>4 ta hiperfin cho'qqi</strong> EPR da</li>
            <li>UV-Vis: λ<sub>max</sub> ≈ <strong>800 nm</strong> — komplementar <strong className="text-blue-400">ko'k rang</strong></li>
            <li>Curie-Weiss θ ≈ <strong>−2 K</strong> — kuchsiz antiferromagnit</li>
            <li>CuSO₄·5H₂O — <strong>mis kuporos</strong>, klassik namuna (5 ta suv)</li>
            <li>Bioanorganik: gemotsianin, plastotsianin, SOD — <strong>hayotiy muhim</strong></li>
            <li>Analitik: <strong>Biuret, Fehling, Benedict</strong> — klassik testlar</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/magnit/birikmalar/ferrosen" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← Ferrosen
          </Link>
          <Link href="/ilmiy/tahlil/magnit/birikmalar/ag-nh3-2" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">
            [Ag(NH₃)₂]⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}