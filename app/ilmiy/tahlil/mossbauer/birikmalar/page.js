"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

export default function MossbauerBirikmalar() {
  const [qidiruv, setQidiruv] = useState("")
  const [filter, setFilter] = useState("hammasi")
  const [selectedState, setSelectedState] = useState(null)

  const birikmalar = [
    {
      id: "k3-fe-cn6",
      formula: "K₃[Fe(CN)₆]",
      iupac: "kaliy geksasiyanoferrat(III)",
      tarixiy: "Qizil qon tuzi",
      ion: "Fe³⁺",
      oksidlanish: "+3",
      config: "d⁵ (LS, t₂g⁵)",
      spin: "LS (S=1/2)",
      magnit: "Paramagnit",
      delta: "−0.12",
      deltaQ: "0.38",
      H: "0",
      spektr: "Dublet",
      izoh: "Kuchli maydon ligandlari (CN⁻) → LS holat. t₂g⁵ simmetrik emas → kichik ΔE_Q. Fe³⁺ uchun past δ — yuqori oksidlanish.",
      sababi: "Fe³⁺ LS — barcha d-elektronlar t₂g da, s-elektron zichligi yuqori",
      alternativ: "EPR (g₁=2.76, g₂=2.20, g₃=2.00), UV-Vis",
      href: "/ilmiy/tahlil/mossbauer/birikmalar/k3-fe-cn6",
      rang: "red"
    },
    {
      id: "k4-fe-cn6",
      formula: "K₄[Fe(CN)₆]",
      iupac: "kaliy geksasiyanoferrat(II)",
      tarixiy: "Sariq qon tuzi",
      ion: "Fe²⁺",
      oksidlanish: "+2",
      config: "d⁶ (LS, t₂g⁶)",
      spin: "LS (S=0)",
      magnit: "Diamagnit",
      delta: "−0.06",
      deltaQ: "0.00",
      H: "0",
      spektr: "Singlet",
      izoh: "t₂g⁶ to'liq to'lgan, sferik simmetrik → ΔE_Q = 0 (singlet). Fe²⁺ bo'lsa ham LS → δ past.",
      sababi: "Fe²⁺ LS — t₂g⁶ sferik simmetrik, EFG = 0",
      alternativ: "NMR (¹³C, ¹H), UV-Vis",
      href: "/ilmiy/tahlil/mossbauer/birikmalar/k4-fe-cn6",
      rang: "yellow"
    },
    {
      id: "fe-h2o6-2",
      formula: "[Fe(H₂O)₆]²⁺",
      iupac: "geksaakvatemir(II) ioni",
      tarixiy: "",
      ion: "Fe²⁺",
      oksidlanish: "+2",
      config: "d⁶ (HS, t₂g⁴ e_g²)",
      spin: "HS (S=2)",
      magnit: "Paramagnit",
      delta: "1.20",
      deltaQ: "3.00",
      H: "0",
      spektr: "Dublet (katta ΔE_Q)",
      izoh: "Kuchsiz maydon ligandlari (H₂O) → HS holat. t₂g⁴ e_g² asimmetrik → juda katta ΔE_Q. Fe²⁺ HS ning klassik namunasi.",
      sababi: "Fe²⁺ HS — t₂g⁴ e_g² asimmetrik, katta EFG",
      alternativ: "EPR (keng signal), UV-Vis (λ≈1000 nm)",
      href: "/ilmiy/tahlil/mossbauer/birikmalar/fe-h2o6-2",
      rang: "green"
    },
    {
      id: "fe-h2o6-3",
      formula: "[Fe(H₂O)₆]³⁺",
      iupac: "geksaakvatemir(III) ioni",
      tarixiy: "",
      ion: "Fe³⁺",
      oksidlanish: "+3",
      config: "d⁵ (HS, t₂g³ e_g²)",
      spin: "HS (S=5/2)",
      magnit: "Paramagnit",
      delta: "0.40",
      deltaQ: "0.20",
      H: "0",
      spektr: "Dublet (kichik ΔE_Q)",
      izoh: "HS Fe³⁺ — d⁵ yarim to'lgan, deyarli sferik simmetrik → kichik ΔE_Q. Fe³⁺ HS ning klassik namunasi.",
      sababi: "Fe³⁺ HS — d⁵ sferik simmetrik, kichik EFG",
      alternativ: "EPR (g≈2.0, keng), UV-Vis",
      href: "/ilmiy/tahlil/mossbauer/birikmalar/fe-h2o6-3",
      rang: "orange"
    },
    {
      id: "fe-co5",
      formula: "[Fe(CO)₅]",
      iupac: "pentakarboniltemir(0)",
      tarixiy: "",
      ion: "Fe⁰",
      oksidlanish: "0",
      config: "d⁸ (18e⁻)",
      spin: "S=0",
      magnit: "Diamagnit",
      delta: "−0.09",
      deltaQ: "0.00",
      H: "0",
      spektr: "Singlet",
      izoh: "Fe⁰ — nol oksidlanish. CO kuchli π-akseptor → s-elektron zichligi yuqori → δ juda past. Trigonal bipyramidal simmetrik → ΔE_Q = 0.",
      sababi: "Fe⁰ — kuchli π-back-bonding, simmetrik",
      alternativ: "IR (νCO ≈ 2022, 2000 cm⁻¹), ¹³C NMR",
      href: "/ilmiy/tahlil/mossbauer/birikmalar/fe-co5",
      rang: "amber"
    },
    {
      id: "fe3o4",
      formula: "Fe₃O₄",
      iupac: "temir(II,III) oksidi",
      tarixiy: "Magnetit",
      ion: "Fe²⁺/Fe³⁺",
      oksidlanish: "+2, +3",
      config: "Fe³⁺(A) + Fe²⁺(B) + Fe³⁺(B)",
      spin: "Aralash",
      magnit: "Ferrimagnit",
      delta: "0.67 / 0.27",
      deltaQ: "0.02 / 0.01",
      H: "46",
      spektr: "Sekstet (2 ta)",
      izoh: "Aralash valentli — ikki xil Fe mavjud. Tetraedrik (A) Fe³⁺ va oktaedrik (B) Fe²⁺/Fe³⁺. Verwey o'tishi (120 K) — elektron tartib o'zgaradi.",
      sababi: "Fe²⁺/Fe³⁺ aralash — ikki xil kristallografik pozitsiya",
      alternativ: "XRD, Magnitometriya",
      href: "/ilmiy/tahlil/mossbauer/birikmalar/fe3o4",
      rang: "purple"
    },
  ]

  // Filter va qidiruv
  const filtered = useMemo(() => {
    let results = birikmalar

    if (filter !== "hammasi") {
      if (filter === "fe2") results = results.filter(b => b.ion === "Fe²⁺")
      else if (filter === "fe3") results = results.filter(b => b.ion === "Fe³⁺")
      else if (filter === "fe0") results = results.filter(b => b.ion === "Fe⁰")
      else if (filter === "aralash") results = results.filter(b => b.ion.includes("/"))
      else if (filter === "ls") results = results.filter(b => b.spin.includes("LS"))
      else if (filter === "hs") results = results.filter(b => b.spin.includes("HS"))
    }

    if (qidiruv.trim()) {
      const q = qidiruv.toLowerCase()
      results = results.filter(b => {
        const formulaClean = b.formula
          .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, m => '₀₁₂₃₄₅₆₇₈₉'.indexOf(m))
          .replace(/[\[\]\(\)\s]/g, '')
          .toLowerCase()
        
        return (
          b.formula.toLowerCase().includes(q) ||
          formulaClean.includes(q) ||
          b.iupac.toLowerCase().includes(q) ||
          (b.tarixiy && b.tarixiy.toLowerCase().includes(q)) ||
          b.ion.toLowerCase().includes(q) ||
          b.config.toLowerCase().includes(q)
        )
      })
    }

    return results
  }, [qidiruv, filter])

  // Statistika
  const fe2Count = birikmalar.filter(b => b.ion === "Fe²⁺").length
  const fe3Count = birikmalar.filter(b => b.ion === "Fe³⁺").length
  const lsCount = birikmalar.filter(b => b.spin.includes("LS")).length
  const hsCount = birikmalar.filter(b => b.spin.includes("HS")).length

  // Ranglar xaritasi
  const rangMap = {
    red: "border-red-500/50 hover:border-red-400",
    yellow: "border-yellow-500/50 hover:border-yellow-400",
    green: "border-green-500/50 hover:border-green-400",
    orange: "border-orange-500/50 hover:border-orange-400",
    amber: "border-amber-500/50 hover:border-amber-400",
    purple: "border-purple-500/50 hover:border-purple-400",
  }

  const textColorMap = {
    red: "text-red-400",
    yellow: "text-yellow-400",
    green: "text-green-400",
    orange: "text-orange-400",
    amber: "text-amber-400",
    purple: "text-purple-400",
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/mossbauer" className="text-purple-400 hover:text-purple-300 text-lg">← Mössbauer spektroskopiya</Link>
        <div>
          <h1 className="text-2xl font-bold text-teal-400">⚛️ Birikmalarning Mössbauer tahlili</h1>
          <p className="text-purple-400 text-sm">δ (izomer siljish) • ΔE<sub>Q</sub> (kvadrupol) • H (magnit maydon)</p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        
        {/* STATISTIKA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-yellow-400">{birikmalar.length}</div>
              <div className="text-purple-400 text-xs">jami birikma</div>
            </div>
            <div className="bg-green-600/20 border border-green-600/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-green-400">{fe2Count}</div>
              <div className="text-purple-400 text-xs">Fe²⁺ kompleks</div>
            </div>
            <div className="bg-red-600/20 border border-red-600/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-red-400">{fe3Count}</div>
              <div className="text-purple-400 text-xs">Fe³⁺ kompleks</div>
            </div>
            <div className="bg-blue-600/20 border border-blue-600/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-blue-400">{lsCount}</div>
              <div className="text-purple-400 text-xs">LS (quyi spin)</div>
            </div>
            <div className="bg-orange-600/20 border border-orange-600/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-orange-400">{hsCount}</div>
              <div className="text-purple-400 text-xs">HS (yuqori spin)</div>
            </div>
          </div>
        </div>

        {/* δ vs ΔE_Q DIAGRAMMASI */}
        <div className="bg-gradient-to-br from-teal-900/30 to-purple-900/30 border border-teal-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">📊 δ vs ΔE<sub>Q</sub> diagrammasi — holatlarni joylashtirish</h2>
          <p className="text-purple-300 text-sm mb-4">
            Har bir nuqta birikmani ifodalaydi. O'q o'qlarini bosib batafsil ma'lumot ko'ring.
          </p>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <svg viewBox="0 0 500 400" className="w-full h-96">
              {/* O'qlar */}
              <line x1="50" y1="350" x2="480" y2="350" stroke="#4c1d95" strokeWidth="1" />
              <line x1="50" y1="350" x2="50" y2="20" stroke="#4c1d95" strokeWidth="1" />
              
              {/* Grid */}
              {[-0.2, 0, 0.4, 0.8, 1.2, 1.6].map((v, i) => {
                const x = 50 + ((v + 0.2) / 1.8) * 430
                return (
                  <g key={`x-${i}`}>
                    <line x1={x} y1="350" x2={x} y2="345" stroke="#a78bfa" strokeWidth="1" />
                    <text x={x} y="365" fill="#a78bfa" fontSize="10" textAnchor="middle">{v}</text>
                  </g>
                )
              })}
              {[0, 1, 2, 3, 4].map((v, i) => {
                const y = 350 - (v / 4) * 330
                return (
                  <g key={`y-${i}`}>
                    <line x1="50" y1={y} x2="55" y2={y} stroke="#a78bfa" strokeWidth="1" />
                    <text x="45" y={y + 4} fill="#a78bfa" fontSize="10" textAnchor="end">{v}</text>
                  </g>
                )
              })}

              <text x="265" y="390" fill="#c4b5fd" fontSize="11" textAnchor="middle">δ (mm/s) — izomer siljish</text>
              <text x="20" y="185" fill="#c4b5fd" fontSize="11" textAnchor="middle" transform="rotate(-90, 20, 185)">ΔE_Q (mm/s)</text>

              {/* Mintaqalar */}
              <rect x="50" y="20" width="130" height="80" fill="#ef4444" opacity="0.1" />
              <text x="115" y="50" fill="#ef4444" fontSize="10" textAnchor="middle" fontWeight="bold">Fe³⁺ LS</text>
              
              <rect x="50" y="100" width="180" height="100" fill="#f97316" opacity="0.1" />
              <text x="140" y="140" fill="#f97316" fontSize="10" textAnchor="middle" fontWeight="bold">Fe³⁺ HS</text>
              
              <rect x="180" y="20" width="130" height="100" fill="#eab308" opacity="0.1" />
              <text x="245" y="60" fill="#eab308" fontSize="10" textAnchor="middle" fontWeight="bold">Fe²⁺ LS</text>
              
              <rect x="230" y="200" width="250" height="150" fill="#22c55e" opacity="0.1" />
              <text x="355" y="280" fill="#22c55e" fontSize="10" textAnchor="middle" fontWeight="bold">Fe²⁺ HS</text>

              {/* Birikmalar nuqtalari */}
              {birikmalar.map((b, i) => {
  // Unicode minusni ASCII minusga almashtirish
  const delta = parseFloat(b.delta.replace('−', '-').split('/')[0])
  const deltaQ = parseFloat(b.deltaQ.replace('−', '-').split('/')[0])
  
  // NaN tekshiruvi
  if (isNaN(delta) || isNaN(deltaQ)) return null
  
  const x = 50 + ((delta + 0.2) / 1.8) * 430
  const y = 350 - (deltaQ / 4) * 330
  const color = b.rang === "red" ? "#ef4444" : b.rang === "yellow" ? "#eab308" : 
                b.rang === "green" ? "#22c55e" : b.rang === "orange" ? "#f97316" : 
                b.rang === "amber" ? "#f59e0b" : "#a855f7"
  
  return (
    <g key={i} onClick={() => setSelectedState(b.id)} className="cursor-pointer">
      <circle cx={x} cy={y} r="8" fill={color} stroke="white" strokeWidth="2" />
      <text x={x + 10} y={y - 5} fill={color} fontSize="9" fontWeight="bold">
        {b.formula}
      </text>
    </g>
  )
})}
            </svg>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 text-xs">
            <div className="bg-red-900/20 border border-red-500/30 rounded p-2">
              <p className="text-red-400 font-bold">Fe³⁺ LS</p>
              <p className="text-purple-200">δ &lt; 0.3, ΔE<sub>Q</sub> &lt; 1</p>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded p-2">
              <p className="text-orange-400 font-bold">Fe³⁺ HS</p>
              <p className="text-purple-200">δ ≈ 0.3-0.6, ΔE<sub>Q</sub> &lt; 1</p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-2">
              <p className="text-yellow-400 font-bold">Fe²⁺ LS</p>
              <p className="text-purple-200">δ ≈ 0.2-0.5, ΔE<sub>Q</sub> &lt; 2</p>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded p-2">
              <p className="text-green-400 font-bold">Fe²⁺ HS</p>
              <p className="text-purple-200">δ ≈ 0.9-1.5, ΔE<sub>Q</sub> &gt; 2</p>
            </div>
          </div>
        </div>

        {/* QIDIRUV VA FILTER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 space-y-4">
          <div className="relative">
            <input 
              type="text"
              value={qidiruv}
              onChange={(e) => setQidiruv(e.target.value)}
              placeholder="Masalan: Fe³⁺, K₃[Fe(CN)₆], magnetit..."
              className="w-full px-6 py-4 pl-14 rounded-xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-500 focus:outline-none focus:border-teal-400 transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
            {qidiruv && (
              <button onClick={() => setQidiruv("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white text-xl">✕</button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {[
              { id: "hammasi", label: "Hammasi", count: birikmalar.length, icon: "🎯" },
              { id: "fe2", label: "Fe²⁺", count: fe2Count, icon: "🟢" },
              { id: "fe3", label: "Fe³⁺", count: fe3Count, icon: "🔴" },
              { id: "fe0", label: "Fe⁰", count: 1, icon: "🟡" },
              { id: "ls", label: "LS (quyi spin)", count: lsCount, icon: "🔵" },
              { id: "hs", label: "HS (yuqori spin)", count: hsCount, icon: "🟠" },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  filter === f.id
                    ? "bg-teal-600/80 text-white shadow-lg"
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}
              >
                {f.icon} {f.label} <span className="opacity-70">({f.count})</span>
              </button>
            ))}
          </div>

          {qidiruv && (
            <p className="text-purple-300 text-sm">
              <span className="text-white font-bold">{filtered.length}</span> ta birikma topildi
            </p>
          )}
        </div>

        {/* BIRIKMALAR GRID */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-7xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-white mb-2">Birikma topilmadi</h3>
            <p className="text-purple-300">Qidiruv so'zini yoki filtrni o'zgartirib ko'ring</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((b) => (
              <Link key={b.id} href={b.href} 
                className={`group bg-purple-900/40 border-2 ${rangMap[b.rang]} rounded-2xl p-6 hover:bg-purple-800/60 transition-all transform hover:-translate-y-1`}>
                
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold font-mono ${textColorMap[b.rang]} group-hover:brightness-125 transition-all`}>
                      {b.formula}
                    </h3>
                    <p className="text-white font-semibold text-sm mt-1">{b.iupac}</p>
                    {b.tarixiy && <p className="text-purple-400 text-xs italic mt-1">"{b.tarixiy}"</p>}
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-teal-600/20 text-teal-400 border border-teal-600/30">
                    ⚛️ {b.spektr}
                  </span>
                </div>

                {/* Ion va konfiguratsiya */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-purple-800/50 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs text-purple-300">
                    {b.ion}
                  </span>
                  <span className="bg-purple-800/50 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs text-purple-300">
                    {b.config}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    b.spin.includes("LS") 
                      ? "bg-blue-600/20 text-blue-400 border border-blue-600/30" 
                      : b.spin.includes("HS")
                      ? "bg-orange-600/20 text-orange-400 border border-orange-600/30"
                      : "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                  }`}>
                    {b.spin}
                  </span>
                </div>

                {/* Mössbauer parametrlari */}
                <div className="mt-4 pt-4 border-t border-purple-700/30 space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-xs text-center">
                    <div className="bg-teal-900/30 border border-teal-500/30 rounded p-2">
                      <p className="text-teal-400 text-[10px]">δ</p>
                      <p className="text-white font-mono font-bold">{b.delta}</p>
                      <p className="text-purple-400 text-[9px]">mm/s</p>
                    </div>
                    <div className="bg-yellow-900/30 border border-yellow-500/30 rounded p-2">
                      <p className="text-yellow-400 text-[10px]">ΔE<sub>Q</sub></p>
                      <p className="text-white font-mono font-bold">{b.deltaQ}</p>
                      <p className="text-purple-400 text-[9px]">mm/s</p>
                    </div>
                    <div className="bg-red-900/30 border border-red-500/30 rounded p-2">
                      <p className="text-red-400 text-[10px]">H</p>
                      <p className="text-white font-mono font-bold">{b.H}</p>
                      <p className="text-purple-400 text-[9px]">Tesla</p>
                    </div>
                  </div>
                  <p className="text-purple-300 text-[10px] italic">{b.izoh}</p>
                  <div className="mt-2 pt-2 border-t border-purple-700/30">
                    <span className="text-[10px] text-purple-400">→ Batafsil Mössbauer tahlili</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* MÖSSBAUER PARAMETRLARI QANDAY TALQIN QILINADI */}
        <div className="bg-gradient-to-br from-teal-900/30 to-purple-900/30 border border-teal-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">📐 Mössbauer parametrlarini talqin qilish</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-teal-600/10 border border-teal-500/30 rounded-xl p-5">
              <h3 className="text-teal-400 font-bold mb-2">δ (izomer siljish)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>✓ <strong>Yuqori δ</strong> → past oksidlanish (Fe²⁺)</li>
                <li>✓ <strong>Past δ</strong> → yuqori oksidlanish (Fe³⁺)</li>
                <li>✓ <strong>HS → LS</strong> → δ kamayadi</li>
                <li>✓ <strong>π-akseptor</strong> → δ kamayadi</li>
              </ul>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-2">ΔE<sub>Q</sub> (kvadrupol)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>✓ <strong>Katta ΔE<sub>Q</sub></strong> → past simmetriya</li>
                <li>✓ <strong>Fe²⁺ HS</strong> → ΔE<sub>Q</sub> ≈ 2-3 mm/s</li>
                <li>✓ <strong>Fe³⁺ HS</strong> → ΔE<sub>Q</sub> ≈ 0-0.5 mm/s</li>
                <li>✓ <strong>LS holatlar</strong> → kichik ΔE<sub>Q</sub></li>
              </ul>
            </div>

            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">H (magnit maydon)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>✓ <strong>H = 0</strong> → paramagnit (T &gt; T<sub>N</sub>)</li>
                <li>✓ <strong>H &gt; 0</strong> → magnit tartiblangan</li>
                <li>✓ <strong>Sekstet</strong> → 6 chiziq (3:2:1:1:2:3)</li>
                <li>✓ <strong>Fe₃O₄</strong> → H ≈ 46 T</li>
              </ul>
            </div>
          </div>
        </div>

        {/* TO'LIQ SOLISHTIRISH JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">📋 To'liq solishtirish jadvali</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="text-left py-3 px-2 text-yellow-400">Birikma</th>
                  <th className="text-center py-3 px-2 text-yellow-400">Ion</th>
                  <th className="text-center py-3 px-2 text-yellow-400">Spin</th>
                  <th className="text-center py-3 px-2 text-yellow-400">δ</th>
                  <th className="text-center py-3 px-2 text-yellow-400">ΔE<sub>Q</sub></th>
                  <th className="text-center py-3 px-2 text-yellow-400">H</th>
                  <th className="text-center py-3 px-2 text-yellow-400">Spektr</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {birikmalar.map((b, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className={`py-2 px-2 font-bold ${textColorMap[b.rang]}`}>{b.formula}</td>
                    <td className="py-2 px-2 text-center">{b.ion}</td>
                    <td className="py-2 px-2 text-center text-[10px]">{b.spin}</td>
                    <td className="py-2 px-2 text-center font-mono text-teal-400">{b.delta}</td>
                    <td className="py-2 px-2 text-center font-mono text-yellow-400">{b.deltaQ}</td>
                    <td className="py-2 px-2 text-center font-mono text-red-400">{b.H}</td>
                    <td className="py-2 px-2 text-center text-[10px]">{b.spektr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-teal-600/10 to-purple-600/10 border border-teal-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>6 ta Fe birikma — <strong className="text-teal-400">Fe⁰, Fe²⁺, Fe³⁺</strong> holatlari</li>
            <li><strong className="text-teal-400">δ</strong> — oksidlanish darajasi va spin holati ko'rsatkichi</li>
            <li><strong className="text-teal-400">ΔE<sub>Q</sub></strong> — koordinatsion simmetriya ko'rsatkichi</li>
            <li><strong className="text-teal-400">H</strong> — ichki magnit maydon (sekstet uchun)</li>
            <li>K₃[Fe(CN)₆] (Fe³⁺ LS) → δ = −0.12, ΔE<sub>Q</sub> = 0.38, dublet</li>
            <li>K₄[Fe(CN)₆] (Fe²⁺ LS) → δ = −0.06, ΔE<sub>Q</sub> = 0.00, singlet</li>
            <li>[Fe(H₂O)₆]²⁺ (Fe²⁺ HS) → δ = 1.20, ΔE<sub>Q</sub> = 3.00, katta dublet</li>
            <li>Fe₃O₄ (aralash valentli) → ikki xil Fe, H = 46 T, sekstet</li>
            <li>Mössbauer — <strong>Fe komplekslari uchun eng aniq usul</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/mossbauer" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← Mössbauer spektroskopiya
          </Link>
          <Link href="/ilmiy/tahlil/fluoressensiya" className="px-6 py-3 bg-teal-600/80 rounded-xl hover:bg-teal-500 text-white font-semibold">
            Fluoressensiya →
          </Link>
        </div>

      </section>
    </main>
  )
}