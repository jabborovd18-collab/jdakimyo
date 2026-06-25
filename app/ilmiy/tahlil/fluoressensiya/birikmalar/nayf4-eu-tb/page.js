"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. EMISSION SPEKTR SIMULYATORI — NaYF₄:Eu,Tb
// ============================================================================
function EmissionSpectrumSimulator() {
  const [excitation, setExcitation] = useState(280)
  const [intensity, setIntensity] = useState(100)
  const [euRatio, setEuRatio] = useState(50) // Eu³⁺ foizi
  const [temperature, setTemperature] = useState(298)
  const [showBoth, setShowBoth] = useState(true)

  // Eu³⁺ cho'qqilari (qizil)
  const euPeaks = [
    { lambda: 580, intensity: 0.25, assign: "⁵D₀→⁷F₀" },
    { lambda: 592, intensity: 0.35, assign: "⁵D₀→⁷F₁" },
    { lambda: 615, intensity: 1.0, assign: "⁵D₀→⁷F₂" },
    { lambda: 652, intensity: 0.25, assign: "⁵D₀→⁷F₃" },
    { lambda: 695, intensity: 0.15, assign: "⁵D₀→⁷F₄" },
  ]

  // Tb³⁺ cho'qqilari (yashil)
  const tbPeaks = [
    { lambda: 490, intensity: 0.30, assign: "⁵D₄→⁷F₆" },
    { lambda: 545, intensity: 1.0, assign: "⁵D₄→⁷F₅" },
    { lambda: 585, intensity: 0.40, assign: "⁵D₄→⁷F₄" },
    { lambda: 620, intensity: 0.20, assign: "⁵D₄→⁷F₃" },
  ]

  const euFactor = euRatio / 100
  const tbFactor = 1 - euFactor
  const tempFactor = Math.max(0.6, 1 - (temperature - 298) / 500)
  const intFactor = (intensity / 100) * tempFactor

  const euSpectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 450 + i * 0.75
      let emission = 0
      euPeaks.forEach(peak => {
        const x = (lambda - peak.lambda) / 2
        emission += peak.intensity * Math.exp(-0.5 * x * x) * intFactor * euFactor
      })
      points.push({ lambda, emission })
    }
    return points
  }, [intensity, temperature, euRatio, intFactor, euFactor])

  const tbSpectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 450 + i * 0.75
      let emission = 0
      tbPeaks.forEach(peak => {
        const x = (lambda - peak.lambda) / 2
        emission += peak.intensity * Math.exp(-0.5 * x * x) * intFactor * tbFactor
      })
      points.push({ lambda, emission })
    }
    return points
  }, [intensity, temperature, euRatio, intFactor, tbFactor])

  const combinedSpectrum = useMemo(() => {
    return euSpectrum.map((p, i) => ({
      lambda: p.lambda,
      emission: p.emission + tbSpectrum[i].emission
    }))
  }, [euSpectrum, tbSpectrum])

  const maxEmission = Math.max(...combinedSpectrum.map(p => p.emission), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💡 Emission spektr simulyatori — NaYF₄:Eu,Tb</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 space-y-4">
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4">
          <p className="text-purple-400 font-bold mb-2">💎 Ko'p rangli lantanid nanopartikullar:</p>
          <p className="text-purple-200 text-xs">
            NaYF₄:Eu,Tb — <strong>ikki xil lantanid</strong> bir matritsada.
            <strong> Eu³⁺</strong> — qizil emissiya (615 nm), <strong>Tb³⁺</strong> — yashil emissiya (545 nm).
            Nisbatni o'zgartirish orqali <strong>ixtiyoriy rang</strong> olish mumkin (qizil, yashil, sariq, oq).
            <strong> Φ ≈ 0.50</strong> va <strong>τ ≈ 1 ms</strong> — lantanid nanopartikullar uchun yuqori.
          </p>
        </div>

        {/* EU/TB NISBATI */}
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Eu³⁺ : Tb³⁺ nisbati:</span>
            <span className="text-emerald-400 font-mono">{euRatio}% : {100 - euRatio}%</span>
          </label>
          <input type="range" min="0" max="100" step="1" value={euRatio}
            onChange={(e) => setEuRatio(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-purple-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span className="text-green-400">100% Tb³⁺ (yashil)</span>
            <span className="text-yellow-400">50:50 (sariq)</span>
            <span className="text-red-400">100% Eu³⁺ (qizil)</span>
          </div>
          <div className="mt-2 h-4 rounded-full overflow-hidden bg-gray-700">
            <div className="h-full flex">
              <div className="bg-red-500 transition-all" style={{width: `${euRatio}%`}}></div>
              <div className="bg-green-500 transition-all" style={{width: `${100-euRatio}%`}}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Qo'zg'alish to'lqin uzunligi:</span>
              <span className="text-emerald-400 font-mono">{excitation} nm</span>
            </label>
            <input type="range" min="250" max="400" step="5" value={excitation}
              onChange={(e) => setExcitation(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-purple-500" />
            <p className="text-purple-400 text-[10px] mt-1">
              Optimal: 280 nm (matritsa yutishi)
            </p>
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Intensivlik:</span>
              <span className="text-emerald-400 font-mono">{intensity}%</span>
            </label>
            <input type="range" min="10" max="100" step="5" value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-purple-500" />
          </div>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Harorat:</span>
            <span className="text-emerald-400 font-mono">{temperature} K</span>
          </label>
          <input type="range" min="100" max="400" step="10" value={temperature}
            onChange={(e) => setTemperature(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-purple-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>100 K (sovuq)</span>
            <span>298 K (xona)</span>
            <span>400 K (issiq)</span>
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input type="checkbox" checked={showBoth}
            onChange={(e) => setShowBoth(e.target.checked)}
            className="accent-purple-500" />
          <span className="text-purple-300">Eu³⁺ va Tb³⁺ spektrlarini alohida ko'rsatish</span>
        </label>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-purple-400 font-bold text-xs mb-2">
            Emission spektri (Eu:Tb = {euRatio}:{100-euRatio}, {temperature} K, λ<sub>exc</sub> = {excitation} nm)
          </h5>
          <svg viewBox="0 0 400 280" className="w-full h-64">
            <line x1="40" y1="240" x2="380" y2="240" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="240" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="275" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="270" fill="#a78bfa" fontSize="8">450</text>
            <text x="380" y="270" fill="#a78bfa" fontSize="8" textAnchor="end">750</text>
            <text x="20" y="130" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 130)">
              Intensivlik
            </text>

            {/* Eu³⁺ cho'qqilari */}
            {showBoth && euFactor > 0 && euPeaks.map((peak, idx) => (
              <g key={`eu-${idx}`}>
                <line x1={40 + ((peak.lambda - 450) / 300) * 340} y1="20" 
                  x2={40 + ((peak.lambda - 450) / 300) * 340} y2="240"
                  stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.5" />
                <text x={40 + ((peak.lambda - 450) / 300) * 340} y="15" 
                  fill="#ef4444" fontSize="6" textAnchor="middle">
                  {peak.lambda}
                </text>
              </g>
            ))}

            {/* Tb³⁺ cho'qqilari */}
            {showBoth && tbFactor > 0 && tbPeaks.map((peak, idx) => (
              <g key={`tb-${idx}`}>
                <line x1={40 + ((peak.lambda - 450) / 300) * 340} y1="20" 
                  x2={40 + ((peak.lambda - 450) / 300) * 340} y2="240"
                  stroke="#10b981" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.5" />
                <text x={40 + ((peak.lambda - 450) / 300) * 340} y="25" 
                  fill="#10b981" fontSize="6" textAnchor="middle">
                  {peak.lambda}
                </text>
              </g>
            ))}

            {/* Eu³⁺ spektri */}
            {showBoth && euFactor > 0 && (
              <polyline
                points={euSpectrum.map((p, i) => {
                  const x = 40 + (i / 400) * 340
                  const y = 240 - (p.emission / maxEmission) * 210
                  return `${x},${y}`
                }).join(' ')}
                fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2"
              />
            )}

            {/* Tb³⁺ spektri */}
            {showBoth && tbFactor > 0 && (
              <polyline
                points={tbSpectrum.map((p, i) => {
                  const x = 40 + (i / 400) * 340
                  const y = 240 - (p.emission / maxEmission) * 210
                  return `${x},${y}`
                }).join(' ')}
                fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,2"
              />
            )}

            {/* Umumiy spektr */}
            <polyline
              points={combinedSpectrum.map((p, i) => {
                const x = 40 + (i / 400) * 340
                const y = 240 - (p.emission / maxEmission) * 210
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#a855f7" strokeWidth="2"
            />

            <text x="200" y="35" fill="#a855f7" fontSize="9" textAnchor="middle" fontWeight="bold">
              NaYF₄:Eu,Tb — ko'p rangli emissiya
            </text>

            {/* Legend */}
            {showBoth && (
              <>
                <rect x="280" y="50" width="10" height="10" fill="#ef4444" />
                <text x="295" y="58" fill="#ef4444" fontSize="8">Eu³⁺ (qizil)</text>
                <rect x="280" y="65" width="10" height="10" fill="#10b981" />
                <text x="295" y="73" fill="#10b981" fontSize="8">Tb³⁺ (yashil)</text>
              </>
            )}
            <rect x="280" y="80" width="10" height="10" fill="#a855f7" />
            <text x="295" y="88" fill="#a855f7" fontSize="8">Umumiy</text>
          </svg>
        </div>

        <div className="grid grid-cols-4 gap-3 text-xs text-center">
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
            <p className="text-red-400">Eu³⁺</p>
            <p className="text-emerald-400 font-bold">{euRatio}%</p>
            <p className="text-purple-400 text-[10px]">qizil</p>
          </div>
          <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3">
            <p className="text-green-400">Tb³⁺</p>
            <p className="text-emerald-400 font-bold">{100 - euRatio}%</p>
            <p className="text-purple-400 text-[10px]">yashil</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Φ</p>
            <p className="text-emerald-400 font-bold">~0.50</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">τ</p>
            <p className="text-emerald-400 font-bold">~1 ms</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun ko'p rangli?</p>
          <p className="text-purple-200">
            <strong>Eu³⁺ va Tb³⁺</strong> — bir matritsada, lekin <strong>mustaqil emissiya</strong> qiladi.
            <br/>
            Eu³⁺ → qizil (615 nm), Tb³⁺ → yashil (545 nm).
            <br/>
            Nisbatni o'zgartirish orqali <strong>ixtiyoriy rang</strong> olish mumkin.
            <br/>
            Bu <strong>multiplex bioimaging</strong> uchun ideal — bir vaqtda bir nechta nishon.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. NaYF₄ MATRITSA STRUKTURASI
// ============================================================================
function MatritsaStrukturasi() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔷 NaYF₄ matritsa — eng samarali lantanid matritsasi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-purple-400 font-bold mb-3">Kristall strukturasi:</h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* Hexagonal panjara - soddalashtirilgan */}
              {/* Y³⁺ ionlari */}
              <circle cx="100" cy="60" r="8" fill="#a855f7" />
              <text x="100" y="63" fill="white" fontSize="6" textAnchor="middle">Y³⁺</text>
              
              <circle cx="60" cy="100" r="8" fill="#a855f7" />
              <text x="60" y="103" fill="white" fontSize="6" textAnchor="middle">Y³⁺</text>
              
              <circle cx="140" cy="100" r="8" fill="#a855f7" />
              <text x="140" y="103" fill="white" fontSize="6" textAnchor="middle">Y³⁺</text>

              {/* Lantanid dopantlar */}
              <circle cx="100" cy="100" r="6" fill="#ef4444" />
              <text x="100" y="103" fill="white" fontSize="5" textAnchor="middle">Eu</text>

              <circle cx="80" cy="130" r="6" fill="#10b981" />
              <text x="80" y="133" fill="white" fontSize="5" textAnchor="middle">Tb</text>

              {/* F⁻ ionlari */}
              <circle cx="70" cy="70" r="4" fill="#fbbf24" />
              <text x="70" y="73" fill="white" fontSize="4" textAnchor="middle">F</text>
              
              <circle cx="130" cy="70" r="4" fill="#fbbf24" />
              <text x="130" y="73" fill="white" fontSize="4" textAnchor="middle">F</text>
              
              <circle cx="80" cy="150" r="4" fill="#fbbf24" />
              <text x="80" y="153" fill="white" fontSize="4" textAnchor="middle">F</text>
              
              <circle cx="120" cy="150" r="4" fill="#fbbf24" />
              <text x="120" y="153" fill="white" fontSize="4" textAnchor="middle">F</text>

              {/* Na⁺ ionlari */}
              <circle cx="50" cy="60" r="5" fill="#3b82f6" />
              <text x="50" y="63" fill="white" fontSize="5" textAnchor="middle">Na</text>
              
              <circle cx="150" cy="60" r="5" fill="#3b82f6" />
              <text x="150" y="63" fill="white" fontSize="5" textAnchor="middle">Na</text>
              
              <circle cx="50" cy="140" r="5" fill="#3b82f6" />
              <text x="50" y="143" fill="white" fontSize="5" textAnchor="middle">Na</text>
              
              <circle cx="150" cy="140" r="5" fill="#3b82f6" />
              <text x="150" y="143" fill="white" fontSize="5" textAnchor="middle">Na</text>

              {/* Bog'lar */}
              <line x1="100" y1="60" x2="70" y2="70" stroke="#a78bfa" strokeWidth="1" opacity="0.5" />
              <line x1="100" y1="60" x2="130" y2="70" stroke="#a78bfa" strokeWidth="1" opacity="0.5" />
              <line x1="60" y1="100" x2="100" y2="100" stroke="#a78bfa" strokeWidth="1" opacity="0.5" />
              <line x1="140" y1="100" x2="100" y2="100" stroke="#a78bfa" strokeWidth="1" opacity="0.5" />

              <text x="100" y="180" fill="#a855f7" fontSize="8" textAnchor="middle" fontWeight="bold">
                NaYF₄ — hexagonal panjara
              </text>
              <text x="100" y="195" fill="#a78bfa" fontSize="7" textAnchor="middle">
                Y³⁺ joylarida Eu³⁺ va Tb³⁺
              </text>
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-purple-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Kimyoviy formula:</span>
                <span className="text-purple-400 font-bold">NaYF₄</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Kristall sistema:</span>
                <span className="text-purple-400">Hexagonal</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Panjara parametri:</span>
                <span className="text-purple-400">a = 6.07 Å, c = 3.53 Å</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Zichlik:</span>
                <span className="text-purple-400">4.26 g/cm³</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Erish harorati:</span>
                <span className="text-purple-400">~1000°C</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Fonon energiyasi:</span>
                <span className="text-purple-400 font-bold">~350 cm⁻¹ (past)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Lantanid dopant:</span>
                <span className="text-purple-400">Eu³⁺, Tb³⁺ (Y³⁺ o'rnida)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Nanopartikula o'lchami:</span>
                <span className="text-purple-400">20-100 nm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun NaYF₄ eng yaxshi matritsa?</p>
          <p className="text-purple-200">
            <strong>Past fonon energiyasi</strong> (~350 cm⁻¹) — nurlanishsiz relaksatsiya kam → yuqori Φ.
            <br/>
            <strong>Hexagonal panjara</strong> — lantanidlar uchun optimal simmetriya.
            <br/>
            <strong>Kimyoviy barqarorlik</strong> — suvda, biologik muhitda barqaror.
            <br/>
            <strong>Past toksiklik</strong> — bioimaging uchun xavfsiz.
            <br/>
            Boshqa matritsalar (LaF₃, YVO₄) pastroq samaradorlik beradi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. ENERGIYA UZATISH MEXANIZMI
// ============================================================================
function EnergiyaUzatish() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1. Matritsa yorug'likni yutadi",
      desc: "NaYF₄ matritsa UV yorug'likni yutadi (F⁻ → Y³⁺ charge transfer)",
      formula: "NaYF₄ + hν (280 nm) → NaYF₄*",
      icon: "💡"
    },
    {
      title: "2. Energiya lantanidlarga uzatiladi",
      desc: "Matritsa energiyani Eu³⁺ va Tb³⁺ ga uzatadi (resonance energy transfer)",
      formula: "NaYF₄* → Eu³⁺* / Tb³⁺*",
      icon: "⚡"
    },
    {
      title: "3. Eu³⁺ qizil nurlanish chiqaradi",
      desc: "Eu³⁺ ⁵D₀ → ⁷F₂ o'tish orqali qizil nurlanish (615 nm)",
      formula: "Eu³⁺* → Eu³⁺ + hν' (615 nm)",
      icon: "🔴"
    },
    {
      title: "4. Tb³⁺ yashil nurlanish chiqaradi",
      desc: "Tb³⁺ ⁵D₄ → ⁷F₅ o'tish orqali yashil nurlanish (545 nm)",
      formula: "Tb³⁺* → Tb³⁺ + hν' (545 nm)",
      icon: "🟢"
    }
  ]

  const s = steps[step]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ Energiya uzatish mexanizmi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 space-y-4">
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4">
          <p className="text-purple-400 font-bold mb-2">💎 "Antenna effekti" matritsa orqali:</p>
          <p className="text-purple-200 text-xs">
            Lantanidlar <strong>to'g'ridan-to'g'ri yorug'likni kuchsiz yutadi</strong> (f-f o'tishlar taqiqlangan).
            <br/>
            <strong>NaYF₄ matritsa</strong> — kuchli yutuvchi (charge transfer band) → energiyani lantanidlarga uzatadi.
            <br/>
            Bu <strong>antenna effekti</strong>ning boshqa turi — organik ligandlar emas, <strong>matritsa</strong> antenna.
          </p>
        </div>

        {/* STEP NAVIGATION */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                step === i 
                  ? "bg-purple-600/80 text-white shadow-lg" 
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* CURRENT STEP */}
        <div className="bg-purple-950/50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{s.icon}</span>
            <h4 className="text-purple-400 font-bold text-lg">{s.title}</h4>
          </div>
          <p className="text-purple-200 text-sm mb-3">{s.desc}</p>
          <div className="bg-purple-900/50 rounded p-3 font-mono text-xs text-center text-emerald-400">
            {s.formula}
          </div>
        </div>

        {/* VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-purple-400 font-bold text-xs mb-3">Energiya uzatish diagrammasi:</h5>
          <svg viewBox="0 0 400 250" className="w-full h-60">
            <line x1="50" y1="230" x2="50" y2="20" stroke="#4c1d95" strokeWidth="1" />
            <text x="30" y="125" fill="#c4b5fd" fontSize="9" textAnchor="middle" transform="rotate(-90, 30, 125)">
              Energiya
            </text>

            {/* Matritsa sathlari */}
            <text x="120" y="40" fill="#a78bfa" fontSize="9" textAnchor="middle" fontWeight="bold">NaYF₄ matritsa</text>
            <rect x="80" y="200" width="80" height="20" fill="#a78bfa" opacity="0.3" />
            <text x="120" y="215" fill="#a78bfa" fontSize="8" textAnchor="middle">GS</text>
            <rect x="80" y="60" width="80" height="20" fill="#a78bfa" opacity="0.3" />
            <text x="120" y="75" fill="#a78bfa" fontSize="8" textAnchor="middle">CT band</text>

            <line x1="120" y1="200" x2="120" y2="80" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowY)" />
            <text x="135" y="140" fill="#fbbf24" fontSize="7">hν (280 nm)</text>

            {/* Eu³⁺ sathlari */}
            <text x="240" y="40" fill="#ef4444" fontSize="9" textAnchor="middle" fontWeight="bold">Eu³⁺</text>
            <rect x="200" y="200" width="80" height="20" fill="#ef4444" opacity="0.3" />
            <text x="240" y="215" fill="#ef4444" fontSize="8" textAnchor="middle">⁷F₀</text>
            <rect x="200" y="100" width="80" height="20" fill="#ef4444" opacity="0.3" />
            <text x="240" y="115" fill="#ef4444" fontSize="8" textAnchor="middle">⁵D₀</text>

            <line x1="160" y1="70" x2="200" y2="110" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#arrowP)" />
            <text x="180" y="85" fill="#a78bfa" fontSize="7">ET</text>

            <line x1="240" y1="120" x2="240" y2="200" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowR)" />
            <text x="255" y="160" fill="#ef4444" fontSize="7">hν' (615 nm)</text>

            {/* Tb³⁺ sathlari */}
            <text x="340" y="40" fill="#10b981" fontSize="9" textAnchor="middle" fontWeight="bold">Tb³⁺</text>
            <rect x="300" y="200" width="80" height="20" fill="#10b981" opacity="0.3" />
            <text x="340" y="215" fill="#10b981" fontSize="8" textAnchor="middle">⁷F₀</text>
            <rect x="300" y="80" width="80" height="20" fill="#10b981" opacity="0.3" />
            <text x="340" y="95" fill="#10b981" fontSize="8" textAnchor="middle">⁵D₄</text>

            <line x1="160" y1="70" x2="300" y2="90" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#arrowP)" />
            <text x="230" y="75" fill="#a78bfa" fontSize="7">ET</text>

            <line x1="340" y1="100" x2="340" y2="200" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowG)" />
            <text x="355" y="150" fill="#10b981" fontSize="7">hν' (545 nm)</text>

            <defs>
              <marker id="arrowY" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#fbbf24" />
              </marker>
              <marker id="arrowP" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#a78bfa" />
              </marker>
              <marker id="arrowR" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#ef4444" />
              </marker>
              <marker id="arrowG" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#10b981" />
              </marker>
            </defs>
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-xs">
            <p className="text-red-400 font-bold mb-1">Eu³⁺ emissiya:</p>
            <ul className="text-purple-200 space-y-1 list-disc list-inside">
              <li>⁵D₀ → ⁷F₂ (615 nm) — qizil</li>
              <li>Elektr dipol o'tish</li>
              <li>Simmetriyaga sezgir</li>
              <li>τ ≈ 1 ms</li>
            </ul>
          </div>
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 text-xs">
            <p className="text-green-400 font-bold mb-1">Tb³⁺ emissiya:</p>
            <ul className="text-purple-200 space-y-1 list-disc list-inside">
              <li>⁵D₄ → ⁷F₅ (545 nm) — yashil</li>
              <li>Elektr dipol o'tish</li>
              <li>Simmetriyaga kamroq sezgir</li>
              <li>τ ≈ 1.5 ms</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun matritsa antenna sifatida ishlaydi?</p>
          <p className="text-purple-200">
            <strong>F⁻ → Y³⁺ charge transfer</strong> — kuchli yutish (ε &gt; 10⁴).
            <br/>
            <strong>Resonance energy transfer</strong> — matritsa energiyani lantanidlarga uzatadi.
            <br/>
            <strong>Past fonon energiyasi</strong> — nurlanishsiz yo'qotish kam → samarali uzatish.
            <br/>
            Bu <strong>anorganik antenna effekti</strong> — organik komplekslardan farqli.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. KO'P RANGLI EMISSIYA
// ============================================================================
function KopRangliEmissiya() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌈 Ko'p rangli emissiya — Eu:Tb nisbati</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Eu:Tb nisbati</th>
                <th className="text-center py-3 px-2 text-yellow-400">Rang</th>
                <th className="text-center py-3 px-2 text-yellow-400">λ<sub>em</sub> (Eu)</th>
                <th className="text-center py-3 px-2 text-yellow-400">λ<sub>em</sub> (Tb)</th>
                <th className="text-center py-3 px-2 text-yellow-400">Qo'llanilish</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["0:100", "Yashil", "—", "545 nm", "Yashil piksel"],
                ["20:80", "Sariq-yashil", "615 nm (kuchsiz)", "545 nm (kuchli)", "Biomarkerlar"],
                ["50:50", "Sariq", "615 nm", "545 nm", "Oq yorug'lik"],
                ["80:20", "To'q sariq", "615 nm (kuchli)", "545 nm (kuchsiz)", "Qizil piksel"],
                ["100:0", "Qizil", "615 nm", "—", "Qizil piksel"],
                ["50:50 + Gd³⁺", "Oq", "615 nm", "545 nm", "Oq OLED"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center font-bold">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-red-400">{r[2]}</td>
                  <td className="py-2 px-2 text-center text-green-400">{r[3]}</td>
                  <td className="py-2 px-2 text-center text-[10px]">{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-purple-400 font-bold text-xs mb-3">Rang palitrasi:</h5>
          <div className="grid grid-cols-6 gap-2">
            {[
              { ratio: "0:100", color: "#10b981", name: "Yashil" },
              { ratio: "20:80", color: "#84cc16", name: "Sariq-yashil" },
              { ratio: "50:50", color: "#eab308", name: "Sariq" },
              { ratio: "80:20", color: "#f97316", name: "To'q sariq" },
              { ratio: "100:0", color: "#ef4444", name: "Qizil" },
              { ratio: "50:50+Gd", color: "#f5f5f5", name: "Oq" },
            ].map((c, i) => (
              <div key={i} className="text-center">
                <div className="w-full h-16 rounded-lg mb-2 border border-purple-700/50" 
                  style={{backgroundColor: c.color}}></div>
                <p className="text-purple-300 text-[10px]">{c.ratio}</p>
                <p className="text-purple-400 text-[9px]">{c.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun ko'p rangli emissiya muhim?</p>
          <p className="text-purple-200">
            <strong>Multiplex bioimaging</strong> — bir vaqtda bir nechta nishonni ko'rish.
            <br/>
            Har bir nishon uchun <strong>alohida Eu:Tb nisbati</strong> → alohida rang.
            <br/>
            <strong>Bir eksperimentda 5-10 nishon</strong> — vaqtni tejash.
            <br/>
            <strong>Yuqori kontrast</strong> — tor chiziqli spektr, ajratish oson.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. Φ VA TAU
// ============================================================================
function PhiVaTau() {
  const [temperature, setTemperature] = useState(298)
  const [size, setSize] = useState(50) // nm

  // O'lcham va harorat ta'siri
  const sizeFactor = Math.min(1, size / 100) // katta o'lcham → yuqori Φ
  const tempFactor = Math.max(0.6, 1 - (temperature - 298) / 500)
  const phi = 0.50 * sizeFactor * tempFactor
  const tau = 1.0 * sizeFactor * tempFactor

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 Φ va τ — o'lcham va harorat ta'siri</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 space-y-4">
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4">
          <p className="text-purple-400 font-bold mb-2">💎 Nanopartikula o'lchami muhim:</p>
          <p className="text-purple-200 text-xs">
            <strong>Kichik nanopartikullar</strong> (&lt; 20 nm) — sirt effektlari kuchli → past Φ.
            <br/>
            <strong>Katta nanopartikullar</strong> (&gt; 50 nm) — bulk xususiyatlar → yuqori Φ.
            <br/>
            <strong>Optimal o'lcham</strong> — 50-100 nm (yuqori Φ + yaxshi dispersiya).
          </p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Nanopartikula o'lchami:</span>
            <span className="text-emerald-400 font-mono">{size} nm</span>
          </label>
          <input type="range" min="10" max="200" step="5" value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-purple-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>10 nm (kichik)</span>
            <span>50-100 nm (optimal)</span>
            <span>200 nm (katta)</span>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Harorat:</span>
            <span className="text-emerald-400 font-mono">{temperature} K</span>
          </label>
          <input type="range" min="100" max="400" step="10" value={temperature}
            onChange={(e) => setTemperature(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-purple-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>100 K (sovuq)</span>
            <span>298 K (xona)</span>
            <span>400 K (issiq)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-3">
            <p className="text-purple-400">Φ (kvant unumi)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{phi.toFixed(3)}</p>
            <p className="text-purple-400 text-[10px]">{phi > 0.45 ? "✓ Juda yuqori" : phi > 0.3 ? "○ Yuqori" : "✗ Past"}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">τ (ms)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{tau.toFixed(2)}</p>
            <p className="text-purple-400 text-[10px]">{tau > 0.8 ? "✓ Juda uzoq" : tau > 0.5 ? "○ Uzoq" : "✗ Qisqa"}</p>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-purple-400 font-bold text-xs mb-2">O'lcham ta'siri grafigi:</h5>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="50" y1="180" x2="380" y2="180" stroke="#4c1d95" strokeWidth="1" />
            <line x1="50" y1="20" x2="50" y2="180" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="215" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">Nanopartikula o'lchami (nm)</text>
            <text x="30" y="100" fill="#c4b5fd" fontSize="9" textAnchor="middle" transform="rotate(-90, 30, 100)">
              Φ
            </text>

            {/* Φ vs size curve */}
            <polyline
              points={Array.from({ length: 100 }, (_, i) => {
                const size = 10 + (i / 100) * 190
                const phi = 0.50 * Math.min(1, size / 100)
                const x = 50 + (i / 100) * 330
                const y = 180 - (phi / 0.50) * 150
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#a855f7" strokeWidth="2"
            />

            {/* Joriy nuqta */}
            <circle 
              cx={50 + ((size - 10) / 190) * 330} 
              cy={180 - (phi / 0.50) * 150} 
              r="5" fill="#fbbf24" />

            {/* Optimal zona */}
            <rect x={50 + ((50 - 10) / 190) * 330} y="20" 
              width={((100 - 50) / 190) * 330} height="160" 
              fill="#10b981" opacity="0.1" />
            <text x={50 + ((75 - 10) / 190) * 330} y="35" fill="#10b981" fontSize="8" textAnchor="middle">
              Optimal zona
            </text>

            <text x="50" y="195" fill="#a78bfa" fontSize="7">10</text>
            <text x="380" y="195" fill="#a78bfa" fontSize="7" textAnchor="end">200</text>
            <text x="45" y="180" fill="#a78bfa" fontSize="7" textAnchor="end">0</text>
            <text x="45" y="30" fill="#a78bfa" fontSize="7" textAnchor="end">0.50</text>
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-xs">
            <p className="text-red-400 font-bold mb-1">Kichik nanopartikullar (&lt; 20 nm):</p>
            <ul className="text-purple-200 space-y-1 list-disc list-inside">
              <li>Katta sirt/hajm nisbati</li>
              <li>Sirt defektlari ko'p</li>
              <li>Nurlanishsiz yo'qotish kuchli</li>
              <li>Φ past (0.1-0.2)</li>
            </ul>
          </div>
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 text-xs">
            <p className="text-green-400 font-bold mb-1">Katta nanopartikullar (&gt; 50 nm):</p>
            <ul className="text-purple-200 space-y-1 list-disc list-inside">
              <li>Kichik sirt/hajm nisbati</li>
              <li>Bulk xususiyatlar ustun</li>
              <li>Nurlanish samarali</li>
              <li>Φ yuqori (0.4-0.5)</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun τ juda uzoq?</p>
          <p className="text-purple-200">
            <strong>Lantanid f-f o'tishlari</strong> — taqiqlangan → sekin emissiya.
            <br/>
            <strong>τ ≈ 1 ms</strong> — bu fluoressensiya emas, <strong>fosforessensiya</strong>.
            <br/>
            Uzoq τ → <strong>vaqt-ajraladigan tahlil</strong> (TRF) uchun ideal.
            <br/>
            Autofluoressensiya (τ ≈ 1-10 ns) o'chadi → <strong>yuqori kontrast</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. SOLISHTIRISH — BOSHQA NANOPARTIKULLAR
// ============================================================================
function Solishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Boshqa nanopartikullar bilan solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Nanopartikula</th>
                <th className="text-center py-3 px-2 text-yellow-400">Material</th>
                <th className="text-center py-3 px-2 text-yellow-400">λ<sub>em</sub></th>
                <th className="text-center py-3 px-2 text-yellow-400">Φ</th>
                <th className="text-center py-3 px-2 text-yellow-400">τ</th>
                <th className="text-center py-3 px-2 text-yellow-400">Toksiklik</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["NaYF₄:Eu,Tb", "Lantanid", "545/615 nm", "0.50", "1 ms", "Past"],
                ["CdSe QD", "Kvant nuqta", "500-700 nm", "0.80", "20 ns", "Yuqori (Cd)"],
                ["Carbon dots", "Uglerod", "450-550 nm", "0.60", "5 ns", "Juda past"],
                ["Au nanoclusters", "Oltin", "600-800 nm", "0.10", "1 μs", "Past"],
                ["Si nanopartikullar", "Kremniy", "600-900 nm", "0.20", "10 μs", "Juda past"],
                ["ZnO nanopartikullar", "Rux oksidi", "380-550 nm", "0.30", "1 ns", "Past"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${i === 0 ? 'bg-purple-900/20' : ''}`}>
                  <td className={`py-2 px-2 font-bold ${i === 0 ? 'text-purple-400' : 'text-purple-300'}`}>{r[0]}</td>
                  <td className="py-2 px-2 text-center">{r[1]}</td>
                  <td className="py-2 px-2 text-center">{r[2]}</td>
                  <td className="py-2 px-2 text-center">{r[3]}</td>
                  <td className="py-2 px-2 text-center">{r[4]}</td>
                  <td className="py-2 px-2 text-center">{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 text-xs">
            <p className="text-purple-400 font-bold mb-1">NaYF₄:Eu,Tb afzalligi:</p>
            <ul className="text-purple-200 space-y-1 list-disc list-inside">
              <li><strong>Ko'p rangli</strong> — Eu va Tb birga</li>
              <li><strong>Uzoq τ</strong> — TRF uchun ideal</li>
              <li><strong>Tor chiziqli</strong> — yuqori kontrast</li>
              <li><strong>Past toksiklik</strong> — bioimaging uchun</li>
              <li><strong>Fotobarqaror</strong> — fotobleaching yo'q</li>
            </ul>
          </div>
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 text-xs">
            <p className="text-purple-400 font-bold mb-1">Cheklovlar:</p>
            <ul className="text-purple-200 space-y-1 list-disc list-inside">
              <li><strong>Past Φ</strong> — CdSe QD dan past</li>
              <li><strong>Katta o'lcham</strong> — 50-100 nm (QD: 5-10 nm)</li>
              <li><strong>Murakkab sintez</strong> — yuqori harorat kerak</li>
              <li><strong>UV qo'zg'alish</strong> — ko'rinadigan emas</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun lantanid nanopartikullar bioimaging uchun eng yaxshi?</p>
          <p className="text-purple-200">
            <strong>CdSe QD</strong> — yuqori Φ, lekin <strong>Cd toksik</strong> → in vivo mumkin emas.
            <br/>
            <strong>Carbon dots</strong> — past toksiklik, lekin <strong>keng spektr</strong> → past kontrast.
            <br/>
            <strong>NaYF₄:Eu,Tb</strong> — <strong>past toksiklik + tor chiziqli + uzoq τ</strong> → eng yaxshi.
            <br/>
            Bu <strong>in vivo bioimaging</strong> uchun ideal — jonli organizmlarda ishlatish mumkin.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. QO'LLANILISH
// ============================================================================
function Qollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 Amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-purple-400 font-bold mb-2">Multiplex bioimaging</h4>
            <p className="text-purple-200 text-xs">
              <strong>Eng muhim qo'llanilish</strong>. Bir vaqtda bir nechta nishonni ko'rish.
              <br/>
              Har bir nishon uchun <strong>alohida Eu:Tb nisbati</strong> → alohida rang.
              <br/>
              <strong>5-10 nishon</strong> bir eksperimentda — vaqtni tejash.
              <br/>
              <strong>Yuqori kontrast</strong> — TRF orqali autofluoressensiya yo'q.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💊</div>
            <h4 className="text-purple-400 font-bold mb-2">Saraton diagnostikasi</h4>
            <p className="text-purple-200 text-xs">
              <strong>Saraton hujayralari</strong> — maxsus markerlar bilan belgilanadi.
              <br/>
              <strong>In vivo imaging</strong> — jonli organizmda saraton joylashuvi.
              <br/>
              <strong>Erta diagnostika</strong> — kichik o'smalar ham ko'rinadi.
              <br/>
              <strong>Past toksiklik</strong> — bemorga xavfsiz.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">📱</div>
            <h4 className="text-purple-400 font-bold mb-2">Xavfsizlik belgilari</h4>
            <p className="text-purple-200 text-xs">
              <strong>Banknotlar</strong>, <strong>pasportlar</strong> — UV nur ostida porlaydi.
              <br/>
              <strong>Ko'p rangli</strong> — qalbakiylikdan himoya.
              <br/>
              <strong>Uzoq umr</strong> — fotobleaching yo'q.
              <br/>
              <strong>Qiyin nusxalash</strong> — maxsus sintez kerak.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💡</div>
            <h4 className="text-purple-400 font-bold mb-2">Yoritish va displeylar</h4>
            <p className="text-purple-200 text-xs">
              <strong>LED phosphor</strong> — ko'k LED + NaYF₄:Eu,Tb → oq yorug'lik.
              <br/>
              <strong>Displey piksellar</strong> — qizil, yashil, ko'k subpiksellar.
              <br/>
              <strong>Barqaror</strong> — uzoq umr, rang o'zgarmaydi.
              <br/>
              <strong>Arzon</strong> — lantanidlar yetarli.
            </p>
          </div>
        </div>

        <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4">
          <p className="text-purple-400 font-bold mb-2">🌟 Qiziqarli faktlar:</p>
          <ul className="text-purple-200 text-xs space-y-2">
            <li>
              <strong>2000-yillar boshi</strong> — NaYF₄ nanopartikullar birinchi marta sintez qilindi.
              <br/>
              Bu <strong>lantanid nanomateriallar</strong> sohasida inqilob qildi.
            </li>
            <li>
              <strong>Upconversion nanopartikullar</strong> (UCNP) — NaYF₄:Yb,Er/Tm.
              <br/>
              <strong>Infraqizil → ko'rinadigan</strong> — chuqur to'qima imaging uchun.
              <br/>
              Bu <strong>Nobel mukofoti</strong> darajasidagi kashfiyot.
            </li>
            <li>
              <strong>10,000+ maqola</strong> chop etilgan — eng ko'p o'rganilgan lantanid nanopartikullar.
              <br/>
              Har yili <strong>1000+ yangi maqola</strong> chiqadi.
            </li>
            <li>
              <strong>Tibbiyotda</strong> — klinik sinovlarda ishlatilmoqda.
              <br/>
              <strong>5-10 yil ichida</strong> — keng qo'llanilishi kutilmoqda.
            </li>
            <li>
              NaYF₄:Eu,Tb — <strong>bioimagingning kelajagi</strong>.
              <br/>
              Hozirda <strong>laboratoriyalarda</strong> keng qo'llaniladi.
              <br/>
              Kelajakda <strong>klinikalarda</strong> ham ishlatiladi.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function NaYF4EuTbFluoressensiya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <nav className="flex items-center gap-2 text-sm flex-wrap">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300">Tahlil</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/fluoressensiya" className="text-purple-400 hover:text-purple-300">Fluoressensiya</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar" className="text-purple-400 hover:text-purple-300">Birikmalar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-purple-400">NaYF₄:Eu,Tb</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">💡 NaYF₄:Eu,Tb — Fluoressensiya tahlili</h1>
          <p className="text-purple-400 text-sm">
            Lantanid nanopartikullar • Ko'p rangli emissiya • Multiplex bioimaging • Φ ≈ 0.50 • τ ≈ 1 ms
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-purple-900/40 border border-purple-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-purple-400">NaYF₄:Eu,Tb</span>
            <div>
              <h2 className="text-xl font-bold text-white">Fluoressensiya tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Ko'p rangli lantanid nanopartikullar" — bioimaging kelajagi</p>
            </div>
          </div>

          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              NaYF₄:Eu,Tb — <strong className="text-purple-400">ko'p rangli lantanid nanopartikullar</strong>.
              NaYF₄ matritsa ichida <strong>Eu³⁺ (qizil, 615 nm)</strong> va <strong>Tb³⁺ (yashil, 545 nm)</strong> birga.
              Nisbatni o'zgartirish orqali <strong>ixtiyoriy rang</strong> olish mumkin.
              <strong> Φ ≈ 0.50</strong> va <strong>τ ≈ 1 ms</strong> — lantanid nanopartikullar uchun yuqori.
              Multiplex bioimaging va saraton diagnostikasi uchun ideal.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-purple-400 font-bold text-lg">Eu³⁺ + Tb³⁺</p>
              <p className="text-purple-300">2 lantanid</p>
              <p className="text-purple-400 mt-1">ko'p rangli</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-purple-400 font-bold text-lg">545/615</p>
              <p className="text-purple-300">nm</p>
              <p className="text-purple-400 mt-1">yashil/qizil</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-purple-400 font-bold text-lg">Φ ≈ 0.50</p>
              <p className="text-purple-300">kvant unumi</p>
              <p className="text-purple-400 mt-1">yuqori</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-purple-400 font-bold text-lg">τ ≈ 1</p>
              <p className="text-purple-300">ms</p>
              <p className="text-purple-400 mt-1">uzoq</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EmissionSpectrumSimulator />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <MatritsaStrukturasi />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EnergiyaUzatish />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <KopRangliEmissiya />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <PhiVaTau />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Solishtirish />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Qollanilish />
        </div>

        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>NaYF₄:Eu,Tb — <strong className="text-purple-400">ko'p rangli lantanid nanopartikullar</strong></li>
            <li><strong>NaYF₄ matritsa</strong> — eng samarali lantanid matritsasi (past fonon energiyasi)</li>
            <li><strong>Eu³⁺</strong> — qizil emissiya (615 nm, ⁵D₀ → ⁷F₂)</li>
            <li><strong>Tb³⁺</strong> — yashil emissiya (545 nm, ⁵D₄ → ⁷F₅)</li>
            <li><strong>Eu:Tb nisbati</strong> — ixtiyoriy rang (yashil, sariq, qizil, oq)</li>
            <li><strong>Φ ≈ 0.50</strong> — lantanid nanopartikullar uchun yuqori</li>
            <li><strong>τ ≈ 1 ms</strong> — vaqt-ajraladigan tahlil (TRF) uchun ideal</li>
            <li><strong>Multiplex bioimaging</strong> — bir vaqtda 5-10 nishon</li>
            <li><strong>Past toksiklik</strong> — in vivo bioimaging uchun xavfsiz</li>
            <li>Qo'llanilish: <strong>bioimaging, saraton diagnostikasi, xavfsizlik belgilari, LED</strong></li>
            <li><strong>Upconversion nanopartikullar</strong> (UCNP) — infraqizil → ko'rinadigan</li>
            <li>Bioimagingning <strong>kelajagi</strong> — klinikalarda keng qo'llaniladi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/ru-dppz2-bpy" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Ru(dppz)₂(bpy)]²⁺
          </Link>
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">
            Fluoressensiya birikmalar →
          </Link>
        </div>
      </section>
    </main>
  )
}