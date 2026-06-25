"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. EMISSION SPEKTR SIMULYATORI — [Ru(dppz)₂(bpy)]²⁺
// ============================================================================
function EmissionSpectrumSimulator() {
  const [excitation, setExcitation] = useState(440)
  const [intensity, setIntensity] = useState(100)
  const [dnaPresent, setDnaPresent] = useState(true)
  const [dnaConc, setDnaConc] = useState(50)

  // Ru²⁺ ning ³MLCT emission cho'qqilari
  const peaks = [
    { lambda: 580, intensity: 0.5, assign: "³MLCT" },
    { lambda: 620, intensity: 1.0, assign: "³MLCT (max)" },
    { lambda: 660, intensity: 0.6, assign: "³MLCT" },
  ]

  // DNK bilan bog'lanish — light switch effekti
  const switchFactor = dnaPresent ? Math.min(1, dnaConc / 100) * 100 : 0
  const intFactor = (intensity / 100) * switchFactor

  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 500 + i * 0.75
      let emission = 0
      peaks.forEach(peak => {
        const x = (lambda - peak.lambda) / 40
        emission += peak.intensity * Math.exp(-0.5 * x * x) * intFactor
      })
      points.push({ lambda, emission })
    }
    return points
  }, [intensity, dnaPresent, dnaConc, intFactor])

  const maxEmission = Math.max(...spectrum.map(p => p.emission), 0.01)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💡 Emission spektr simulyatori — "DNA Light Switch"</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-4">
          <p className="text-amber-400 font-bold mb-2">💎 "DNA Light Switch" effekti:</p>
          <p className="text-purple-200 text-xs">
            [Ru(dppz)₂(bpy)]²⁺ — <strong>eng mashhur "DNA light switch"</strong>.
            <strong> Suvda</strong> — fluoressensiya <strong>deyarli yo'q</strong> (Φ ≈ 10⁻⁵).
            <strong> DNK bilan</strong> — fluoressensiya <strong>10,000 marta kuchayadi</strong> (Φ ≈ 0.1).
            Bu xususiyat DNK ni <strong>yuqori kontrast</strong> bilan ko'rishga imkon beradi.
          </p>
        </div>

        {/* DNK TOGGLE */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setDnaPresent(true)}
            className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              dnaPresent 
                ? "bg-amber-600/80 text-white shadow-lg" 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}>
            <div className="text-lg mb-1">🧬</div>
            <div>DNK bor</div>
            <div className="text-[10px] opacity-70 mt-1">Φ ≈ 0.10 (YORIQ!)</div>
          </button>
          <button onClick={() => setDnaPresent(false)}
            className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              !dnaPresent 
                ? "bg-amber-600/80 text-white shadow-lg" 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}>
            <div className="text-lg mb-1">💧</div>
            <div>Faqat suv</div>
            <div className="text-[10px] opacity-70 mt-1">Φ ≈ 0.00001 (O'CHGAN)</div>
          </button>
        </div>

        {/* DNK KONSENTRATSIYASI */}
        {dnaPresent && (
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">DNK konsentratsiyasi:</span>
              <span className="text-emerald-400 font-mono">{dnaConc} μM (bazalar)</span>
            </label>
            <input type="range" min="0" max="200" step="1" value={dnaConc}
              onChange={(e) => setDnaConc(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-amber-500" />
            <div className="flex justify-between text-[10px] text-purple-400 mt-1">
              <span>0 μM</span>
              <span>100 μM</span>
              <span>200 μM</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">λ<sub>exc</sub>:</span>
              <span className="text-emerald-400 font-mono">{excitation} nm</span>
            </label>
            <input type="range" min="350" max="500" step="5" value={excitation}
              onChange={(e) => setExcitation(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-amber-500" />
            <p className="text-purple-400 text-[10px] mt-1">
              Optimal: 440 nm (MLCT yutish)
            </p>
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Intensivlik:</span>
              <span className="text-emerald-400 font-mono">{intensity}%</span>
            </label>
            <input type="range" min="10" max="100" step="5" value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-amber-500" />
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-amber-400 font-bold text-xs mb-2">
            Emission spektri ({dnaPresent ? `DNK = ${dnaConc} μM` : 'Faqat suv'}, λ<sub>exc</sub> = {excitation} nm)
          </h5>
          <svg viewBox="0 0 400 280" className="w-full h-64">
            <line x1="40" y1="240" x2="380" y2="240" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="240" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="275" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="270" fill="#a78bfa" fontSize="8">500</text>
            <text x="380" y="270" fill="#a78bfa" fontSize="8" textAnchor="end">800</text>
            <text x="20" y="130" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 130)">
              Intensivlik
            </text>

            {/* λ_max belgilari */}
            {peaks.map((peak, idx) => (
              <g key={idx}>
                <line x1={40 + ((peak.lambda - 500) / 300) * 340} y1="20" 
                  x2={40 + ((peak.lambda - 500) / 300) * 340} y2="240"
                  stroke={peak.intensity === 1.0 ? "#fbbf24" : "#a78bfa"} 
                  strokeWidth="0.5" strokeDasharray="2,2" />
                <text x={40 + ((peak.lambda - 500) / 300) * 340} y="15" 
                  fill={peak.intensity === 1.0 ? "#fbbf24" : "#a78bfa"} 
                  fontSize="7" textAnchor="middle">
                  {peak.lambda} nm
                </text>
                <text x={40 + ((peak.lambda - 500) / 300) * 340} y="25" 
                  fill={peak.intensity === 1.0 ? "#fbbf24" : "#a78bfa"} 
                  fontSize="6" textAnchor="middle">
                  {peak.assign}
                </text>
              </g>
            ))}

            {/* Emission spektri */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 400) * 340
                const y = 240 - (p.emission / maxEmission) * 210
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke={dnaPresent ? "#f97316" : "#6b7280"} strokeWidth={dnaPresent ? "2" : "1"}
              strokeDasharray={dnaPresent ? "0" : "3,3"}
            />

            <text x="200" y="35" fill={dnaPresent ? "#f97316" : "#6b7280"} fontSize="9" textAnchor="middle" fontWeight="bold">
              {dnaPresent ? '🧬 DNK BOR — YORIQ! (620 nm)' : '💧 FAQAT SUV — O\'CHGAN'}
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-4 gap-3 text-xs text-center">
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-3">
            <p className="text-amber-400">Holat</p>
            <p className="text-emerald-400 font-bold">{dnaPresent ? 'DNK bor' : 'Suvda'}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">λ<sub>em</sub></p>
            <p className="text-emerald-400 font-bold">620 nm</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Φ</p>
            <p className="text-emerald-400 font-bold">{dnaPresent ? '0.10' : '10⁻⁵'}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Kuchayish</p>
            <p className="text-yellow-400 font-bold">10,000×</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun bunday katta farq?</p>
          <p className="text-purple-200">
            <strong>Suvda</strong> — dppz ning N atomlari suv bilan H-bog' hosil qiladi →
            energiya <strong>nurlanishsiz</strong> yo'qotiladi (Φ ≈ 10⁻⁵).
            <br/>
            <strong>DNK bilan</strong> — dppz bazalar orasiga <strong>intercalate</strong> qilinadi →
            suv molekulalari <strong>chetlashtiriladi</strong> → emissiya <strong>10,000×</strong> kuchayadi!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. DPPZ VA BPY LIGANDLARI
// ============================================================================
function LigandStrukturasi() {
  const [ligand, setLigand] = useState("dppz")

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 dppz va bpy ligandlari</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setLigand("dppz")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              ligand === "dppz" 
                ? "bg-amber-600/80 text-white shadow-lg" 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}>
            dppz (katta)
          </button>
          <button onClick={() => setLigand("bpy")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              ligand === "bpy" 
                ? "bg-amber-600/80 text-white shadow-lg" 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}>
            bpy (kichik)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-amber-400 font-bold mb-3">
              {ligand === "dppz" ? "dppz strukturasi" : "bpy strukturasi"}
            </h4>
            <svg viewBox="0 0 200 180" className="w-full h-44">
              {ligand === "dppz" ? (
                <>
                  {/* dppz — 5 ta halqa */}
                  {/* Chap piridin */}
                  <polygon points="30,70 50,60 70,70 70,90 50,100 30,90" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
                  <circle cx="30" cy="90" r="4" fill="#3b82f6" />
                  <text x="30" y="93" fill="white" fontSize="5" textAnchor="middle">N</text>

                  {/* O'rta piridin */}
                  <polygon points="70,70 90,60 110,70 110,90 90,100 70,90" fill="none" stroke="#a78bfa" strokeWidth="1.5" />

                  {/* Bog' */}
                  <line x1="70" y1="80" x2="110" y2="80" stroke="#a78bfa" strokeWidth="1.5" />

                  {/* Fenazin qismi — 3 halqa */}
                  <polygon points="110,70 130,60 150,70 150,90 130,100 110,90" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
                  <polygon points="130,60 150,50 170,60 170,80 150,90 130,80" fill="none" stroke="#a78bfa" strokeWidth="1.5" />

                  {/* N atomlari */}
                  <circle cx="130" cy="60" r="4" fill="#3b82f6" />
                  <text x="130" y="63" fill="white" fontSize="5" textAnchor="middle">N</text>
                  <circle cx="170" cy="80" r="4" fill="#3b82f6" />
                  <text x="170" y="83" fill="white" fontSize="5" textAnchor="middle">N</text>

                  {/* Muhim qism — intercalation uchun */}
                  <rect x="110" y="50" width="60" height="50" fill="#f97316" opacity="0.2" stroke="#f97316" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="140" y="40" fill="#f97316" fontSize="7" textAnchor="middle">
                    Intercalation qismi
                  </text>

                  <text x="100" y="130" fill="#a78bfa" fontSize="8" textAnchor="middle">
                    dppz = dipirido[3,2-a:2',3'-c]fenazin
                  </text>
                  <text x="100" y="145" fill="#f97316" fontSize="7" textAnchor="middle">
                    Kengaytirilgan π-sistema (5 halqa)
                  </text>
                  <text x="100" y="160" fill="#fbbf24" fontSize="7" textAnchor="middle">
                    22 π-elektron
                  </text>
                </>
              ) : (
                <>
                  {/* bpy — 2 ta halqa */}
                  <polygon points="40,70 60,60 80,70 80,90 60,100 40,90" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
                  <line x1="80" y1="80" x2="120" y2="80" stroke="#a78bfa" strokeWidth="2" />
                  <polygon points="120,70 140,60 160,70 160,90 140,100 120,90" fill="none" stroke="#a78bfa" strokeWidth="1.5" />

                  {/* N atomlari */}
                  <circle cx="60" cy="100" r="4" fill="#3b82f6" />
                  <text x="60" y="103" fill="white" fontSize="5" textAnchor="middle">N</text>
                  <circle cx="140" cy="100" r="4" fill="#3b82f6" />
                  <text x="140" y="103" fill="white" fontSize="5" textAnchor="middle">N</text>

                  <text x="100" y="130" fill="#a78bfa" fontSize="8" textAnchor="middle">
                    bpy = 2,2'-bipiridin
                  </text>
                  <text x="100" y="145" fill="#3b82f6" fontSize="7" textAnchor="middle">
                    Oddiy π-sistema (2 halqa)
                  </text>
                  <text x="100" y="160" fill="#fbbf24" fontSize="7" textAnchor="middle">
                    12 π-elektron
                  </text>
                </>
              )}
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-amber-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              {ligand === "dppz" ? (
                <>
                  <div className="flex justify-between bg-purple-900/50 rounded p-2">
                    <span className="text-purple-300">To'liq nomi:</span>
                    <span className="text-amber-400 font-bold text-[10px]">dipiridofenazin</span>
                  </div>
                  <div className="flex justify-between bg-purple-900/50 rounded p-2">
                    <span className="text-purple-300">Turi:</span>
                    <span className="text-amber-400">Bidentat (N,N)</span>
                  </div>
                  <div className="flex justify-between bg-purple-900/50 rounded p-2">
                    <span className="text-purple-300">Halqalar soni:</span>
                    <span className="text-amber-400 font-bold">5 ta</span>
                  </div>
                  <div className="flex justify-between bg-purple-900/50 rounded p-2">
                    <span className="text-purple-300">π-elektronlar:</span>
                    <span className="text-amber-400">22</span>
                  </div>
                  <div className="flex justify-between bg-purple-900/50 rounded p-2">
                    <span className="text-purple-300">N atomlari:</span>
                    <span className="text-amber-400">4 ta</span>
                  </div>
                  <div className="flex justify-between bg-purple-900/50 rounded p-2">
                    <span className="text-purple-300">Intercalation:</span>
                    <span className="text-amber-400 font-bold">Ha ✓</span>
                  </div>
                  <div className="flex justify-between bg-purple-900/50 rounded p-2">
                    <span className="text-purple-300">H-bog' acceptor:</span>
                    <span className="text-amber-400">2 ta N</span>
                  </div>
                  <div className="flex justify-between bg-purple-900/50 rounded p-2">
                    <span className="text-purple-300">Vazifasi:</span>
                    <span className="text-amber-400">DNK light switch</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between bg-purple-900/50 rounded p-2">
                    <span className="text-purple-300">To'liq nomi:</span>
                    <span className="text-blue-400 font-bold text-[10px]">2,2'-bipiridin</span>
                  </div>
                  <div className="flex justify-between bg-purple-900/50 rounded p-2">
                    <span className="text-purple-300">Turi:</span>
                    <span className="text-blue-400">Bidentat (N,N)</span>
                  </div>
                  <div className="flex justify-between bg-purple-900/50 rounded p-2">
                    <span className="text-purple-300">Halqalar soni:</span>
                    <span className="text-blue-400 font-bold">2 ta</span>
                  </div>
                  <div className="flex justify-between bg-purple-900/50 rounded p-2">
                    <span className="text-purple-300">π-elektronlar:</span>
                    <span className="text-blue-400">12</span>
                  </div>
                  <div className="flex justify-between bg-purple-900/50 rounded p-2">
                    <span className="text-purple-300">N atomlari:</span>
                    <span className="text-blue-400">2 ta</span>
                  </div>
                  <div className="flex justify-between bg-purple-900/50 rounded p-2">
                    <span className="text-purple-300">Intercalation:</span>
                    <span className="text-blue-400">Yo'q ✗</span>
                  </div>
                  <div className="flex justify-between bg-purple-900/50 rounded p-2">
                    <span className="text-purple-300">Vazifasi:</span>
                    <span className="text-blue-400">Ru²⁺ ni barqarorlashtirish</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun 2 ta dppz va 1 ta bpy?</p>
          <p className="text-purple-200">
            <strong>2 ta dppz</strong> — DNK bilan intercalation uchun zarur. Kengaytirilgan π-sistema.
            <br/>
            <strong>1 ta bpy</strong> — Ru²⁺ ni barqarorlashtirish va yutilishni kuchaytirish uchun.
            <br/>
            Bu kombinatsiya <strong>optimal muvozanat</strong> beradi: DNK sezgirligi + samarali emissiya.
            <br/>
            <strong>3 ta dppz</strong> bo'lsa — juda katta, DNK ga kirish qiyin.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. DNA LIGHT SWITCH MEXANIZMI
// ============================================================================
function LightSwitchMexanizmi() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1. Suvda — o'chgan holat",
      desc: "dppz ning N atomlari suv bilan H-bog' hosil qiladi → energiya yo'qoladi",
      formula: "Ru-dppz + H₂O → Ru-dppz···H₂O (kvenching)",
      icon: "💧",
      color: "#6b7280"
    },
    {
      title: "2. DNK yaqinlashadi",
      desc: "Kengaytirilgan dppz halqasi DNK bazalari orasiga intercalate qilinadi",
      formula: "Ru-dppz + DNA → intercalation",
      icon: "🧬",
      color: "#f97316"
    },
    {
      title: "3. Suv chetlashtiriladi",
      desc: "DNK bazalari dppz atrofidagi suvni chetlashtiradi → H-bog'lar yo'qoladi",
      formula: "Ru-dppz@DNA — suv yo'q",
      icon: "🚫",
      color: "#ef4444"
    },
    {
      title: "4. Emissiya yoqiladi",
      desc: "Nurlanishsiz yo'qotish kamayadi → fluoressensiya 10,000× kuchayadi",
      formula: "Ru-dppz@DNA + hν → hν' (620 nm)",
      icon: "✨",
      color: "#f97316"
    }
  ]

  const s = steps[step]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ DNA Light Switch mexanizmi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-4">
          <p className="text-amber-400 font-bold mb-2">💎 "Light Switch" nima?</p>
          <p className="text-purple-200 text-xs">
            <strong>"Light switch"</strong> — sharoitga qarab fluoressensiya yoqilishi/o'chishi.
            <br/>
            [Ru(dppz)₂(bpy)]²⁺ da bu <strong>eng kuchli namuna</strong> — 10,000× kuchayish!
            <br/>
            Sababi: dppz N atomlari suvda <strong>H-bog' hosil qiladi</strong> → kvenching.
            DNK ichida suv yo'q → <strong>kvenching yo'qoladi</strong> → emissiya yoqiladi.
          </p>
        </div>

        {/* STEP NAVIGATION */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                step === i 
                  ? "bg-amber-600/80 text-white shadow-lg" 
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
            <h4 className="text-amber-400 font-bold text-lg">{s.title}</h4>
          </div>
          <p className="text-purple-200 text-sm mb-3">{s.desc}</p>
          <div className="bg-purple-900/50 rounded p-3 font-mono text-xs text-center text-emerald-400">
            {s.formula}
          </div>
        </div>

        {/* VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-amber-400 font-bold text-xs mb-3">Light Switch vizualizatsiyasi:</h5>
          <svg viewBox="0 0 400 250" className="w-full h-60">
            {/* Chap tomon — Suvda (o'chgan) */}
            <text x="100" y="20" fill="#6b7280" fontSize="10" textAnchor="middle" fontWeight="bold">
              SUVDA (O'CHGAN)
            </text>
            
            {/* Ru markazi */}
            <circle cx="100" cy="100" r="15" fill="#f97316" />
            <text x="100" y="104" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">Ru</text>

            {/* dppz halqalari */}
            <rect x="60" y="60" width="30" height="15" fill="#a78bfa" opacity="0.5" />
            <rect x="110" y="60" width="30" height="15" fill="#a78bfa" opacity="0.5" />
            
            {/* N atomlari */}
            <circle cx="75" cy="55" r="4" fill="#3b82f6" />
            <text x="75" y="58" fill="white" fontSize="5" textAnchor="middle">N</text>
            <circle cx="125" cy="55" r="4" fill="#3b82f6" />
            <text x="125" y="58" fill="white" fontSize="5" textAnchor="middle">N</text>

            {/* Suv molekulalari */}
            <circle cx="60" cy="40" r="6" fill="#06b6d4" opacity="0.6" />
            <text x="60" y="43" fill="white" fontSize="5" textAnchor="middle">H₂O</text>
            <circle cx="140" cy="40" r="6" fill="#06b6d4" opacity="0.6" />
            <text x="140" y="43" fill="white" fontSize="5" textAnchor="middle">H₂O</text>

            {/* H-bog'lar */}
            <line x1="75" y1="51" x2="65" y2="45" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="125" y1="51" x2="135" y2="45" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" />

            {/* Kvenching strelka */}
            <line x1="100" y1="120" x2="100" y2="150" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowR)" />
            <text x="115" y="140" fill="#ef4444" fontSize="7">Kvenching</text>

            {/* O'chgan belgisi */}
            <circle cx="100" cy="180" r="15" fill="#6b7280" opacity="0.3" />
            <text x="100" y="184" fill="#6b7280" fontSize="10" textAnchor="middle" fontWeight="bold">✗</text>

            {/* O'ng tomon — DNK bilan (yoqilgan) */}
            <text x="300" y="20" fill="#f97316" fontSize="10" textAnchor="middle" fontWeight="bold">
              DNK BILAN (YOQILGAN)
            </text>

            {/* DNK spiral */}
            <ellipse cx="300" cy="100" rx="50" ry="70" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.3" />
            
            {/* Bazalar */}
            <rect x="260" y="60" width="25" height="8" fill="#10b981" opacity="0.6" />
            <rect x="260" y="75" width="25" height="8" fill="#10b981" opacity="0.6" />
            <rect x="260" y="115" width="25" height="8" fill="#10b981" opacity="0.6" />
            <rect x="260" y="130" width="25" height="8" fill="#10b981" opacity="0.6" />

            <rect x="315" y="60" width="25" height="8" fill="#10b981" opacity="0.6" />
            <rect x="315" y="75" width="25" height="8" fill="#10b981" opacity="0.6" />
            <rect x="315" y="115" width="25" height="8" fill="#10b981" opacity="0.6" />
            <rect x="315" y="130" width="25" height="8" fill="#10b981" opacity="0.6" />

            {/* Ru-dppz intercalated */}
            <circle cx="300" cy="95" r="12" fill="#f97316" />
            <text x="300" y="99" fill="white" fontSize="7" textAnchor="middle" fontWeight="bold">Ru</text>
            <rect x="280" y="85" width="15" height="8" fill="#a78bfa" opacity="0.8" />
            <rect x="305" y="85" width="15" height="8" fill="#a78bfa" opacity="0.8" />

            {/* Nurlanish strelkasi */}
            <line x1="300" y1="120" x2="300" y2="150" stroke="#f97316" strokeWidth="2" markerEnd="url(#arrowO)" />
            <text x="315" y="140" fill="#f97316" fontSize="7">Emissiya</text>

            {/* Yoqilgan belgisi */}
            <circle cx="300" cy="180" r="15" fill="#f97316" opacity="0.5" />
            <text x="300" y="184" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">✓</text>

            <defs>
              <marker id="arrowR" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#ef4444" />
              </marker>
              <marker id="arrowO" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#f97316" />
              </marker>
            </defs>
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-xs">
            <p className="text-red-400 font-bold mb-1">Suvda (Φ ≈ 10⁻⁵):</p>
            <ul className="text-purple-200 space-y-1 list-disc list-inside">
              <li>N atomlari H-bog' hosil qiladi</li>
              <li>Nurlanishsiz yo'qotish ustun</li>
              <li>Emissiya deyarli yo'q</li>
            </ul>
          </div>
          <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3 text-xs">
            <p className="text-amber-400 font-bold mb-1">DNK bilan (Φ ≈ 0.10):</p>
            <ul className="text-purple-200 space-y-1 list-disc list-inside">
              <li>DNK ichida suv yo'q</li>
              <li>H-bog'lar yo'qoladi</li>
              <li>Emissiya 10,000× kuchayadi</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun 10,000× kuchayish?</p>
          <p className="text-purple-200">
            <strong>dppz N atomlari</strong> — kuchli H-bog' acceptorlari.
            <br/>
            Suvda ular <strong>H-bog'lar</strong> orqali energiyani issiqlikka aylantiradi → kvenching.
            <br/>
            DNK ichida <strong>gidrofob muhit</strong> — suv yo'q → H-bog' yo'q → kvenching yo'q.
            <br/>
            Bu <strong>"H-bog' switch"</strong> mexanizmi deb ataladi.
            <br/>
            Bu eng kuchli light switch effekti — boshqa materiallar 100-1000×, bu 10,000×!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. DNK INTERCALATION
// ============================================================================
function DnaIntercalation() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧬 DNK intercalation — bazalar orasiga kirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-4">
          <p className="text-amber-400 font-bold mb-2">💎 Intercalation nima?</p>
          <p className="text-purple-200 text-xs">
            <strong>Intercalation</strong> — tekis, kengaytirilgan molekula DNK bazalari orasiga
            <strong> vertikal kirib</strong>, π-π stacking orqali bog'lanadi.
            <br/>
            [Ru(dppz)₂(bpy)]²⁺ ning <strong>dppz halqasi</strong> buni qiladi — bpy emas.
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-amber-400 font-bold text-xs mb-3">Intercalation vizualizatsiyasi:</h5>
          <svg viewBox="0 0 400 250" className="w-full h-60">
            {/* DNK double helix — soddalashtirilgan */}
            {/* Chap zanjir */}
            <path d="M 100 40 Q 120 60 100 80 Q 80 100 100 120 Q 120 140 100 160 Q 80 180 100 200 Q 120 220 100 240" 
              fill="none" stroke="#10b981" strokeWidth="2" />
            {/* O'ng zanjir */}
            <path d="M 300 40 Q 280 60 300 80 Q 320 100 300 120 Q 280 140 300 160 Q 320 180 300 200 Q 280 220 300 240" 
              fill="none" stroke="#10b981" strokeWidth="2" />

            {/* Bazalar (juftliklar) */}
            <g>
              <line x1="115" y1="60" x2="285" y2="60" stroke="#3b82f6" strokeWidth="1.5" />
              <rect x="115" y="57" width="20" height="6" fill="#3b82f6" />
              <rect x="265" y="57" width="20" height="6" fill="#ef4444" />
              <text x="125" y="55" fill="#a78bfa" fontSize="7" textAnchor="middle">A-T</text>
            </g>

            <g>
              <line x1="95" y1="100" x2="305" y2="100" stroke="#10b981" strokeWidth="1.5" />
              <rect x="95" y="97" width="20" height="6" fill="#10b981" />
              <rect x="285" y="97" width="20" height="6" fill="#f59e0b" />
              <text x="105" y="95" fill="#a78bfa" fontSize="7" textAnchor="middle">G-C</text>
            </g>

            {/* INTERCALATED Ru-dppz */}
            <g>
              <line x1="110" y1="140" x2="290" y2="140" stroke="#f97316" strokeWidth="2" />
              <rect x="120" y="130" width="160" height="20" fill="#f97316" opacity="0.5" stroke="#f97316" strokeWidth="1" />
              
              {/* Ru markazi */}
              <circle cx="200" cy="140" r="10" fill="#f97316" />
              <text x="200" y="143" fill="white" fontSize="7" textAnchor="middle" fontWeight="bold">Ru</text>
              
              {/* dppz halqalari */}
              <rect x="130" y="133" width="40" height="14" fill="#a78bfa" opacity="0.7" />
              <rect x="230" y="133" width="40" height="14" fill="#a78bfa" opacity="0.7" />
              
              <text x="200" y="125" fill="#f97316" fontSize="8" textAnchor="middle" fontWeight="bold">
                [Ru(dppz)₂(bpy)]²⁺ INTERCALATED
              </text>
            </g>

            <g>
              <line x1="95" y1="180" x2="305" y2="180" stroke="#8b5cf6" strokeWidth="1.5" />
              <rect x="95" y="177" width="20" height="6" fill="#8b5cf6" />
              <rect x="285" y="177" width="20" height="6" fill="#06b6d4" />
              <text x="105" y="175" fill="#a78bfa" fontSize="7" textAnchor="middle">C-G</text>
            </g>

            <g>
              <line x1="115" y1="220" x2="285" y2="220" stroke="#f59e0b" strokeWidth="1.5" />
              <rect x="115" y="217" width="20" height="6" fill="#f59e0b" />
              <rect x="265" y="217" width="20" height="6" fill="#3b82f6" />
              <text x="125" y="215" fill="#a78bfa" fontSize="7" textAnchor="middle">T-A</text>
            </g>

            {/* π-π stacking belgisi */}
            <text x="350" y="140" fill="#fbbf24" fontSize="7">π-π stacking</text>
            <line x1="340" y1="130" x2="340" y2="150" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-amber-400 font-bold mb-3">Intercalation xususiyatlari:</h4>
            <ul className="text-purple-200 text-xs space-y-2 list-disc list-inside">
              <li><strong>Tekis molekula</strong> — bazalar orasiga kiradi</li>
              <li><strong>π-π stacking</strong> — bazalar bilan o'zaro ta'sir</li>
              <li><strong>Gidrofob muhit</strong> — DNK ichida suv yo'q</li>
              <li><strong>Muntazam bog'lanish</strong> — har 2-3 bazada</li>
              <li><strong>DNK struktura</strong> — biroz uzayadi, buriladi</li>
              <li><strong>K<sub>d</sub></strong> ≈ 10⁻⁶ M — yuqori affinitet</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-amber-400 font-bold mb-3">DNK turi bo'yicha farq:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">B-DNK (standart):</span>
                <span className="text-amber-400 font-bold">Yaxshi</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">A-DNK (dehydrated):</span>
                <span className="text-amber-400">O'rtacha</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Z-DNK (chap spiral):</span>
                <span className="text-amber-400">Past</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">GC-rich DNK:</span>
                <span className="text-amber-400 font-bold">Eng yaxshi</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">AT-rich DNK:</span>
                <span className="text-amber-400">Yaxshi</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun dppz intercalate qiladi, bpy emas?</p>
          <p className="text-purple-200">
            <strong>dppz</strong> — kengaytirilgan π-sistema (5 halqa, 22 π-e⁻) → bazalar o'lchamiga mos.
            <br/>
            <strong>bpy</strong> — kichik (2 halqa, 12 π-e⁻) → bazalar orasiga sig'maydi.
            <br/>
            Shuning uchun [Ru(dppz)₂(bpy)]²⁺ da <strong>dppz intercalate</strong> qiladi,
            <strong> bpy esa tashqarida</strong> qoladi → suv bilan aloqada.
            <br/>
            Lekin bpy ning roli ham muhim — <strong>Ru²⁺ ni barqarorlashtiradi</strong> va
            <strong> MLCT yutishni</strong> ta'minlaydi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. Φ VA TAU — DNK BILAN VS SUVDA
// ============================================================================
function PhiVaTau() {
  const [dnaRatio, setDnaRatio] = useState(1)
  const [temperature, setTemperature] = useState(298)

  // DNK:Ru nisbati bo'yicha Φ va τ
  const phi = dnaRatio > 0 ? 0.10 * (1 - Math.exp(-dnaRatio * 2)) : 1e-5
  const tau = dnaRatio > 0 ? 200 * (1 - Math.exp(-dnaRatio * 2)) : 1 // ns
  const tempFactor = Math.max(0.5, 1 - (temperature - 298) / 400)
  const phiFinal = phi * tempFactor
  const tauFinal = tau * tempFactor

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 Φ va τ — DNK:Ru nisbati va harorat ta'siri</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-4">
          <p className="text-amber-400 font-bold mb-2">💎 Kvant unumi va yashash vaqti:</p>
          <p className="text-purple-200 text-xs">
            <strong>Suvda</strong> — Φ ≈ 10⁻⁵, τ ≈ 1 ns (deyarli o'lchanmaydi).
            <br/>
            <strong>DNK bilan</strong> (to'liq bog'langanda) — Φ ≈ 0.10, τ ≈ 200 ns.
            <br/>
            Bu <strong>10,000× farq</strong> — light switch effektining asosi.
          </p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <label className="text-yellow-400 font-bold">DNK:Ru nisbati (bazalar/Ru):</label>
            <span className="text-emerald-400 font-mono">{dnaRatio.toFixed(1)}</span>
          </label>
          <input type="range" min="0" max="10" step="0.1" value={dnaRatio}
            onChange={(e) => setDnaRatio(parseFloat(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-amber-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0 (faqat suv)</span>
            <span>5 (o'rtacha)</span>
            <span>10 (to'liq)</span>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Harorat:</span>
            <span className="text-emerald-400 font-mono">{temperature} K</span>
          </label>
          <input type="range" min="273" max="333" step="1" value={temperature}
            onChange={(e) => setTemperature(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-amber-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>273 K (0°C)</span>
            <span>298 K (25°C)</span>
            <span>333 K (60°C)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-3">
            <p className="text-amber-400">Φ (kvant unumi)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{phiFinal.toFixed(4)}</p>
            <p className="text-purple-400 text-[10px]">
              {phiFinal > 0.08 ? "✓ To'liq yoqilgan" : phiFinal > 0.01 ? "○ Qisman yoqilgan" : "✗ O'chgan"}
            </p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">τ (ns)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{tauFinal.toFixed(0)}</p>
            <p className="text-purple-400 text-[10px]">
              {tauFinal > 150 ? "✓ Uzoq" : tauFinal > 50 ? "○ O'rtacha" : "✗ Juda qisqa"}
            </p>
          </div>
        </div>

        {/* Binding curve */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-amber-400 font-bold text-xs mb-2">DNK binding curve:</h5>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="50" y1="180" x2="380" y2="180" stroke="#4c1d95" strokeWidth="1" />
            <line x1="50" y1="20" x2="50" y2="180" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="215" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">DNK:Ru nisbati</text>
            <text x="30" y="100" fill="#c4b5fd" fontSize="9" textAnchor="middle" transform="rotate(-90, 30, 100)">
              Φ
            </text>

            {/* Binding curve — exponential saturation */}
            <polyline
              points={Array.from({ length: 100 }, (_, i) => {
                const ratio = (i / 100) * 10
                const phi = 0.10 * (1 - Math.exp(-ratio * 2))
                const x = 50 + (ratio / 10) * 330
                const y = 180 - (phi / 0.10) * 150
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#f97316" strokeWidth="2"
            />

            {/* Joriy nuqta */}
            <circle 
              cx={50 + (dnaRatio / 10) * 330} 
              cy={180 - (phi / 0.10) * 150} 
              r="5" fill="#fbbf24" />

            {/* Saturation chizig'i */}
            <line x1="50" y1={180 - 150} x2="380" y2={180 - 150}
              stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" />
            <text x="390" y={180 - 150} fill="#ef4444" fontSize="7">Φ_max = 0.10</text>

            <text x="50" y="195" fill="#a78bfa" fontSize="7">0</text>
            <text x="380" y="195" fill="#a78bfa" fontSize="7" textAnchor="end">10</text>
            <text x="45" y="180" fill="#a78bfa" fontSize="7" textAnchor="end">0</text>
            <text x="45" y="30" fill="#a78bfa" fontSize="7" textAnchor="end">0.10</text>
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-xs">
            <p className="text-red-400 font-bold mb-1">DNK:Ru past (0-2):</p>
            <p className="text-purple-200">
              Ru ning katta qismi suvda → emissiya kuchsiz.
              <br/>
              Faqat bir necha Ru DNK bilan bog'langan.
            </p>
          </div>
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 text-xs">
            <p className="text-green-400 font-bold mb-1">DNK:Ru yuqori (5-10):</p>
            <p className="text-purple-200">
              Deyarli barcha Ru DNK bilan bog'langan → maksimal emissiya.
              <br/>
              Φ ≈ 0.10, τ ≈ 200 ns.
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Harorat ta'siri:</p>
          <p className="text-purple-200">
            <strong>Harorat oshishi</strong> → DNK-Ru bog'lanishi kuchsizlanadi (endotermik).
            <br/>
            <strong>DNK denaturatsiyasi</strong> (60°C+) → intercalation buziladi → emissiya kamayadi.
            <br/>
            Shuning uchun <strong>xona harorati</strong> (25°C) optimal.
            <br/>
            Bu xususiyat <strong>DNK erish haroratini</strong> (T<sub>m</sub>) o'lchash uchun ishlatiladi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. SOLISHTIRISH — BOSHQA DNK SENSORLARI
// ============================================================================
function Solishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Boshqa DNK sensorlari bilan solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Sensor</th>
                <th className="text-center py-3 px-2 text-yellow-400">λ<sub>em</sub></th>
                <th className="text-center py-3 px-2 text-yellow-400">Φ (suv)</th>
                <th className="text-center py-3 px-2 text-yellow-400">Φ (DNK)</th>
                <th className="text-center py-3 px-2 text-yellow-400">Kuchayish</th>
                <th className="text-center py-3 px-2 text-yellow-400">Mexanizm</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["[Ru(dppz)₂(bpy)]²⁺", "620 nm", "10⁻⁵", "0.10", "10,000×", "H-bog' switch"],
                ["Ethidium bromide", "590 nm", "0.01", "0.30", "30×", "Intercalation"],
                ["DAPI", "460 nm", "0.05", "0.60", "12×", "Minor groove"],
                ["Hoechst 33258", "460 nm", "0.03", "0.58", "20×", "Minor groove"],
                ["SYBR Green I", "520 nm", "0.001", "0.80", "800×", "Intercalation"],
                ["[Ru(bpy)₃]²⁺", "620 nm", "0.04", "0.05", "1.25×", "Groove binding"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${i === 0 ? 'bg-amber-900/20' : ''}`}>
                  <td className={`py-2 px-2 font-bold ${i === 0 ? 'text-amber-400' : 'text-purple-300'}`}>{r[0]}</td>
                  <td className="py-2 px-2 text-center">{r[1]}</td>
                  <td className="py-2 px-2 text-center">{r[2]}</td>
                  <td className="py-2 px-2 text-center">{r[3]}</td>
                  <td className="py-2 px-2 text-center font-bold">{r[4]}</td>
                  <td className="py-2 px-2 text-center text-[10px]">{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3 text-xs">
            <p className="text-amber-400 font-bold mb-1">[Ru(dppz)₂(bpy)]²⁺ afzalligi:</p>
            <ul className="text-purple-200 space-y-1 list-disc list-inside">
              <li><strong>Eng katta kuchayish</strong> — 10,000×</li>
              <li><strong>Qizil emissiya</strong> — chuqur to'qima</li>
              <li><strong>Uzoq τ</strong> — TRF uchun ideal</li>
              <li><strong>Fotobarqaror</strong> — fotobleaching kam</li>
            </ul>
          </div>
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 text-xs">
            <p className="text-purple-400 font-bold mb-1">Cheklovlar:</p>
            <ul className="text-purple-200 space-y-1 list-disc list-inside">
              <li><strong>Qimmat</strong> — Ru, dppz sintezi murakkab</li>
              <li><strong>Past Φ</strong> — SYBR Green dan past</li>
              <li><strong>Spektrofotometr</strong> kerak — ko'zga ko'rinmaydi</li>
              <li><strong>Uzoq inkubatsiya</strong> — 30+ daqiqa</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun 10,000× kuchayish muhim?</p>
          <p className="text-purple-200">
            <strong>Yuqori kontrast</strong> — fon signali deyarli yo'q.
            <br/>
            <strong>Past konsentratsiyali DNK</strong> ham aniqlash mumkin (pM darajada).
            <br/>
            <strong>Jonli hujayralarda</strong> ham ishlatish mumkin — autofluoressensiya ta'siri kam.
            <br/>
            Boshqa sensorlar 10-1000× beradi, bu <strong>10,000×</strong> — rekord daraja!
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

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-amber-400 font-bold mb-2">DNK tahlili</h4>
            <p className="text-purple-200 text-xs">
              <strong>Eng keng qo'llanilish</strong>. DNK konsentratsiyasini aniqlash.
              <br/>
              <strong>Yuqori sezgirlik</strong> — pM darajasida DNK aniqlash.
              <br/>
              <strong>Real-time monitoring</strong> — DNK sintezi, PCR.
              <br/>
              <strong>Gel elektroforez</strong> — DNK bandlarini ko'rish.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🧬</div>
            <h4 className="text-amber-400 font-bold mb-2">Bioimaging</h4>
            <p className="text-purple-200 text-xs">
              <strong>Jonli hujayralarda DNK</strong> tasvirlash.
              <br/>
              <strong>Yadro va mitoxondriya</strong> — DNK joylashuvi.
              <br/>
              <strong>Hujayra bo'linishi</strong> — mitoz kuzatish.
              <br/>
              <strong>Apoptoz</strong> — DNK fragmentatsiyasi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💊</div>
            <h4 className="text-amber-400 font-bold mb-2">Saraton tadqiqoti</h4>
            <p className="text-purple-200 text-xs">
              <strong>DNK shikastlanishi</strong> — saraton hujayralarida.
              <br/>
              <strong>Kimyoterapiya ta'siri</strong> — DNK repair mexanizmlari.
              <br/>
              <strong>G-quadruplex</strong> — saraton bilan bog'liq DNK strukturalari.
              <br/>
              <strong>Telomerlar</strong> — hujayra qarishi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-amber-400 font-bold mb-2">DNK strukturasi tadqiqoti</h4>
            <p className="text-purple-200 text-xs">
              <strong>B-DNK, A-DNK, Z-DNK</strong> — turli shakllar.
              <br/>
              <strong>DNK erish harorati</strong> (T<sub>m</sub>) — Φ haroratga bog'liq.
              <br/>
              <strong>GC-tarkibi</strong> — Φ GC ga bog'liq.
              <br/>
              <strong>DNK-protein o'zaro ta'siri</strong> — binding affinity.
            </p>
          </div>
        </div>

        <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-4">
          <p className="text-amber-400 font-bold mb-2">🌟 Qiziqarli faktlar:</p>
          <ul className="text-purple-200 text-xs space-y-2">
            <li>
              <strong>1990 yil</strong> — Barton va Turro birinchi marta "DNA light switch" effektini
              [Ru(dppz)₂(bpy)]²⁺ da kashf etdilar.
              <br/>
              Bu <strong>bioanorganik kimyoda inqilob</strong> qildi.
            </li>
            <li>
              <strong>10,000× kuchayish</strong> — eng kuchli light switch effekti.
              <br/>
              Hozirgacha hech bir material bu rekordni yangilamagan.
            </li>
            <li>
              <strong>20,000+ maqola</strong> chop etilgan — eng ko'p o'rganilgan DNK sensorlaridan biri.
              <br/>
              Har yili <strong>500+ yangi maqola</strong> chiqadi.
            </li>
            <li>
              <strong>Tibbiy diagnostika</strong> — COVID-19 PCR testlarida DNK aniqlash uchun
              shunga o'xshash sensorlar ishlatiladi.
            </li>
            <li>
              <strong>Nobel mukofoti</strong> — light switch effekti uchun emas, lekin
              <strong> DNK repair tadqiqotlari</strong> uchun 2015 yilda Nobel berildi.
              <br/>
              [Ru(dppz)₂(bpy)]²⁺ bu tadqiqotlarda muhim rol o'ynadi.
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
export default function RuDppz2BpyFluoressensiya() {
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
          <span className="text-amber-400">[Ru(dppz)₂(bpy)]²⁺</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-amber-400">💡 [Ru(dppz)₂(bpy)]²⁺ — Fluoressensiya tahlili</h1>
          <p className="text-purple-400 text-sm">
            Ru²⁺ • DNA Light Switch • 10,000× kuchayish • Φ ≈ 0.10 (DNK bilan) • Intercalation
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-purple-900/40 border border-amber-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-amber-400">[Ru(dppz)₂(bpy)]²⁺</span>
            <div>
              <h2 className="text-xl font-bold text-white">Fluoressensiya tahlili — to'liq profil</h2>
              <p className="text-purple-400">"DNA Light Switch" — eng kuchli DNK sensori</p>
            </div>
          </div>

          <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Ru(dppz)₂(bpy)]²⁺ — <strong className="text-amber-400">eng mashhur "DNA light switch"</strong>.
              Ru²⁺ (4d⁶) <strong>ikki ta dppz</strong> va <strong>bir ta bpy</strong> ligand bilan o'ralgan.
              <strong> Suvda</strong> — fluoressensiya <strong>deyarli yo'q</strong> (Φ ≈ 10⁻⁵).
              <strong> DNK bilan</strong> — fluoressensiya <strong>10,000 marta kuchayadi</strong> (Φ ≈ 0.10).
              Bu xususiyat DNK ni <strong>yuqori kontrast</strong> bilan ko'rishga imkon beradi.
              Bioimaging va saraton tadqiqotida keng qo'llaniladi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">Ru²⁺ (4d⁶)</p>
              <p className="text-purple-300">oktaedrik</p>
              <p className="text-purple-400 mt-1">S = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">λ<sub>em</sub> = 620</p>
              <p className="text-purple-300">nm</p>
              <p className="text-purple-400 mt-1">qizil</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">Φ ≈ 0.10</p>
              <p className="text-purple-300">(DNK bilan)</p>
              <p className="text-purple-400 mt-1">10,000×</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">τ ≈ 200</p>
              <p className="text-purple-300">ns</p>
              <p className="text-purple-400 mt-1">TRF uchun</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EmissionSpectrumSimulator />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <LigandStrukturasi />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <LightSwitchMexanizmi />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <DnaIntercalation />
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

        <div className="bg-gradient-to-r from-amber-600/10 to-purple-600/10 border border-amber-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Ru(dppz)₂(bpy)]²⁺ — <strong className="text-amber-400">eng mashhur "DNA light switch"</strong></li>
            <li>Ru²⁺ (4d⁶) — <strong>oktaedrik</strong> geometriya, S = 0</li>
            <li><strong>2 × dppz + 1 × bpy</strong> — optimal kombinatsiya</li>
            <li><strong>Suvda Φ ≈ 10⁻⁵</strong> — H-bog' kvenching</li>
            <li><strong>DNK bilan Φ ≈ 0.10</strong> — 10,000× kuchayish</li>
            <li><strong>³MLCT emissiya</strong> — qizil (620 nm), τ ≈ 200 ns</li>
            <li><strong>Intercalation</strong> — dppz bazalar orasiga kiradi</li>
            <li><strong>"H-bog' switch"</strong> mexanizmi — eng kuchli light switch</li>
            <li>Qo'llanilish: <strong>DNK tahlili, bioimaging, saraton tadqiqoti</strong></li>
            <li><strong>1990 yil</strong> — Barton va Turro kashf etdi</li>
            <li><strong>20,000+ maqola</strong> — eng ko'p o'rganilgan DNK sensorlaridan</li>
            <li>Rekord darajadagi <strong>10,000× kuchayish</strong> — hali yangilanmagan</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/alq3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← Alq₃
          </Link>
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/nayf4-eu-tb" className="px-6 py-3 bg-amber-600/80 rounded-xl hover:bg-amber-500 text-white font-semibold">
            NaYF₄:Eu,Tb →
          </Link>
        </div>
      </section>
    </main>
  )
}