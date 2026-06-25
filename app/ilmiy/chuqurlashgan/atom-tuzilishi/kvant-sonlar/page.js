"use client"

import Link from "next/link"
import { useState } from "react"

// ============================================================================
// INTERAKTIV KVANT SONLAR SLAYDERI
// ============================================================================
function KvantSonSlayder() {
  const [tab, setTab] = useState("n")
  const [value, setValue] = useState(3)
  
  const kvantSonlar = {
    n: {
      name: "Bosh kvant soni (n)",
      symbol: "n",
      range: [1, 7],
      step: 1,
      values: "1, 2, 3, 4, 5, 6, 7",
      meaning: "Elektron qavatini (energetik darajani) belgilaydi. n qancha katta bo'lsa, elektron yadrodan shuncha uzoq va energiyasi shuncha yuqori.",
      formula: "E_n = −13.6 eV / n² (vodorod uchun)",
      complexRole: "3d metallar: n=3; 4d: n=4; 5d: n=5. n ortishi bilan ion radiusi va KS ortadi.",
      color: "text-red-400",
      bg: "bg-red-600/10 border-red-500/30"
    },
    l: {
      name: "Orbital kvant soni (l)",
      symbol: "l",
      range: [0, 3],
      step: 1,
      values: "0 (s), 1 (p), 2 (d), 3 (f)",
      meaning: "Orbitalning shaklini belgilaydi. l=0 (sharsimon), l=1 (gantel), l=2 (murakkab — d-orbitallar), l=3 (juda murakkab — f-orbitallar).",
      formula: "l = 0, 1, 2, ..., (n−1)",
      complexRole: "d-orbitallar uchun l=2. Barcha o'tish metallarida l=2. l=2 da 5 ta orbital mavjud (mₗ = −2,...,+2).",
      color: "text-green-400",
      bg: "bg-green-600/10 border-green-500/30"
    },
    ml: {
      name: "Magnit kvant soni (mₗ)",
      symbol: "mₗ",
      range: [-2, 2],
      step: 1,
      values: "−l, ..., 0, ..., +l (jami 2l+1 ta)",
      meaning: "Orbitalning fazoviy yo'nalishini belgilaydi. Magnit maydonda har bir mₗ qiymati har xil energiyaga ega (Zeeman effekti).",
      formula: "mₗ = −l, −l+1, ..., 0, ..., l−1, l",
      complexRole: "d-orbitallar (l=2) uchun mₗ = −2 (dxy), −1 (dyz), 0 (dz²), +1 (dxz), +2 (dx²−y²). Kristall maydonda energetik ajralish.",
      color: "text-blue-400",
      bg: "bg-blue-600/10 border-blue-500/30"
    },
    ms: {
      name: "Spin kvant soni (mₛ)",
      symbol: "mₛ",
      range: [-0.5, 0.5],
      step: 0.5,
      values: "+½ (↑) yoki −½ (↓)",
      meaning: "Elektronning xususiy burchak momenti (spin). Har bir orbitalda ko'pi bilan 2 ta elektron (Pauli prinsipi). Spin — magnit xossalar asosi.",
      formula: "mₛ = ±½",
      complexRole: "Yuqori spin (HS): elektronlar juftlashmaydi. Quyi spin (LS): elektronlar juftlashadi. Magnit moment: μ = √(n(n+2)) μB.",
      color: "text-purple-400",
      bg: "bg-purple-600/10 border-purple-500/30"
    }
  }

  const current = kvantSonlar[tab]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🎚️ Kvant sonlar — interaktiv o'rganish</h3>
      
      <div className="flex gap-2 flex-wrap">
        {Object.entries(kvantSonlar).map(([key, val]) => (
          <button
            key={key}
            onClick={() => { setTab(key); setValue(key === "n" ? 3 : key === "l" ? 2 : key === "ml" ? 0 : 0.5) }}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              tab === key 
                ? `${val.bg} ${val.color}` 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}
          >
            {val.symbol}
          </button>
        ))}
      </div>

      <div className={`rounded-xl p-5 border ${current.bg}`}>
        <h4 className={`font-bold text-xl mb-2 ${current.color}`}>{current.name}</h4>
        
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs text-purple-400">{current.range[0]}</span>
          <input 
            type="range" 
            min={current.range[0]} max={current.range[1]} step={current.step}
            value={value} 
            onChange={(e) => setValue(+e.target.value)}
            className="flex-1 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg appearance-none cursor-pointer"
          />
          <span className={`text-lg font-bold ${current.color}`}>
            {tab === "ms" ? (value > 0 ? "+½ ↑" : "−½ ↓") : value}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Qabul qiladigan qiymatlar:</p>
              <p className="text-purple-200 font-mono">{current.values}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Fizik ma'nosi:</p>
              <p className="text-purple-200">{current.meaning}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Matematik formula:</p>
              <p className="text-purple-200 font-mono">{current.formula}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Komplekslar uchun ahamiyati:</p>
              <p className="text-purple-200">{current.complexRole}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// PAULI VA XUND QOIDALARI
// ============================================================================
function PauliXund() {
  const [electrons, setElectrons] = useState(3)
  
  const t2gSlots = [
    electrons >= 1 ? (electrons >= 4 ? "↑↓" : "↑") : "",
    electrons >= 2 ? (electrons >= 5 ? "↑↓" : "↑") : "",
    electrons >= 3 ? (electrons >= 6 ? "↑↓" : "↑") : "",
  ]
  
  const egSlots = [
    electrons >= 4 && electrons < 7 ? "↑" : electrons >= 7 ? (electrons >= 9 ? "↑↓" : "↑") : "",
    electrons >= 5 && electrons < 7 ? "↑" : electrons >= 8 ? (electrons >= 10 ? "↑↓" : "↑") : "",
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Pauli prinsipi va Xund qoidasi — vizual</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Oktaedrik maydonda d-elektronlarning joylashishi.</strong>
          Elektronlar sonini tanlang va Xund qoidasi bo'yicha joylashishni ko'ring.
        </p>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-purple-400">d¹</span>
          <input type="range" min="1" max="10" value={electrons} onChange={(e) => setElectrons(+e.target.value)}
            className="flex-1 h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-gray-500 rounded-lg cursor-pointer" />
          <span className="text-xs text-purple-400">d¹⁰</span>
          <span className="text-yellow-400 font-bold text-lg">d{electrons}</span>
        </div>

        <div className="grid grid-cols-2 gap-6 text-center">
          <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 font-bold text-sm mb-3">e_g (+0.6Δ₀)</p>
            <div className="flex justify-center gap-4 text-2xl font-mono">
              {egSlots.map((s, i) => (
                <div key={i} className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center">
                  <span className={s.includes("↓") ? "text-red-400" : "text-red-300"}>{s || "—"}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 font-bold text-sm mb-3">t₂g (−0.4Δ₀)</p>
            <div className="flex justify-center gap-4 text-2xl font-mono">
              {t2gSlots.map((s, i) => (
                <div key={i} className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center">
                  <span className={s.includes("↓") ? "text-green-400" : "text-green-300"}>{s || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 text-xs text-center">
          <div className="bg-blue-600/10 border border-blue-500/30 rounded p-2">
            <p className="text-blue-400 font-bold">Pauli prinsipi</p>
            <p className="text-purple-300">Bir orbitalda ↑↓ (2 ta e⁻ maks)</p>
          </div>
          <div className="bg-green-600/10 border border-green-500/30 rounded p-2">
            <p className="text-green-400 font-bold">Xund qoidasi</p>
            <p className="text-purple-300">Avval parallel spinli, keyin juft</p>
          </div>
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-2">
            <p className="text-yellow-400 font-bold">Energiya min</p>
            <p className="text-purple-300">Avval t₂g, keyin e_g</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// TO'LQIN FUNKSIYASI
// ============================================================================
function TolqinFunksiyasi() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌊 To'lqin funksiyasi va kvant sonlar</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Shredinger tenglamasi</strong> yechimi — 
          to'lqin funksiyasi ψ(r,θ,φ). U uch qismga ajraladi:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center">
          <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 font-bold text-sm mb-2">Radial qism — R(r)</p>
            <p className="text-purple-300">n ga bog'liq</p>
            <p className="text-purple-400 mt-2">Elektronning yadrodan uzoqligini belgilaydi</p>
            <p className="text-purple-400">Tugunlar soni: n−l−1</p>
          </div>
          <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 font-bold text-sm mb-2">Burchak qism — Θ(θ)</p>
            <p className="text-purple-300">l va mₗ ga bog'liq</p>
            <p className="text-purple-400 mt-2">Orbital shaklini belgilaydi</p>
            <p className="text-purple-400">Tugunlar soni: l−|mₗ|</p>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400 font-bold text-sm mb-2">Azimutal qism — Φ(φ)</p>
            <p className="text-purple-300">mₗ ga bog'liq</p>
            <p className="text-purple-400 mt-2">Fazoviy yo'nalishni belgilaydi</p>
            <p className="text-purple-400">Φ ∝ e^(imₗφ)</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 mt-4 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 d-orbitallar uchun:</p>
          <p className="text-purple-200">
            Radial tugunlar soni = n−l−1 = n−2−1 = <strong>n−3</strong>. 
            3d uchun: 3−3 = <strong>0</strong> (radial tugun yo'q).
            4d uchun: 4−3 = <strong>1</strong> (1 ta radial tugun).
            Burchak tugunlari soni = <strong>l = 2</strong> (barcha d-orbitallar uchun).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function KvantSonlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300">Chuqurlashgan</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="text-purple-400 hover:text-purple-300">Atom tuzilishi</Link>
          <span className="text-purple-600">›</span>
          <span className="text-green-400">Kvant sonlar</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-green-400">📐 Kvant sonlar</h1>
          <p className="text-purple-400 text-sm">n, l, mₗ, mₛ — 4 ta kvant son • Pauli • Xund • To'lqin funksiyasi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Kvant sonlar — elektronning "pasporti"</h2>
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Kvant sonlar</strong> — atomdagi har bir elektronning holatini 
              <strong> to'liq va bir qiymatli</strong> tavsiflovchi 4 ta son. Ular Shredinger tenglamasini 
              yechish natijasida kelib chiqadi. Kompleks birikmalarda 
              <strong className="text-yellow-400">d-orbitallar</strong> asosiy rol o'ynagani uchun,
              aynan d-elektronlar uchun kvant sonlar muhim ahamiyatga ega.
              <strong> Pauli prinsipi</strong> va <strong>Xund qoidasi</strong> 
              elektronlarning orbitallarga joylashishini belgilaydi.
            </p>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <KvantSonSlayder />
        </div>

        {/* PAULI VA XUND */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <PauliXund />
        </div>

        {/* TO'LQIN FUNKSIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TolqinFunksiyasi />
        </div>

        {/* d-ORBITALLAR UCHUN JADVAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 d-orbitallar — kvant sonlar va energetik ajralish</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="text-left py-3 px-3 text-yellow-400">Orbital</th>
                  <th className="text-left py-3 px-3 text-yellow-400">n</th>
                  <th className="text-left py-3 px-3 text-yellow-400">l</th>
                  <th className="text-left py-3 px-3 text-yellow-400">mₗ</th>
                  <th className="text-left py-3 px-3 text-yellow-400">Oktaedrik guruh</th>
                  <th className="text-left py-3 px-3 text-yellow-400">Energiya (O_h)</th>
                  <th className="text-left py-3 px-3 text-yellow-400">Tugunlar</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  ["dxy", "≥3", "2", "±2", "t₂g", "−0.4Δ₀", "2 burchak (xz, yz)"],
                  ["dxz", "≥3", "2", "±1", "t₂g", "−0.4Δ₀", "2 burchak (xy, yz)"],
                  ["dyz", "≥3", "2", "±1", "t₂g", "−0.4Δ₀", "2 burchak (xy, xz)"],
                  ["dz²", "≥3", "2", "0", "e_g", "+0.6Δ₀", "2 konus (54.7°)"],
                  ["dx²−y²", "≥3", "2", "±2", "e_g", "+0.6Δ₀", "2 burchak (diag.)"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 font-mono font-bold text-green-400">{row[0]}</td>
                    <td className="py-2 px-3">{row[1]}</td>
                    <td className="py-2 px-3">{row[2]}</td>
                    <td className="py-2 px-3 text-yellow-400">{row[3]}</td>
                    <td className="py-2 px-3">{row[4] === "t₂g" ? <span className="text-green-400">{row[4]}</span> : <span className="text-red-400">{row[4]}</span>}</td>
                    <td className="py-2 px-3">{row[5]}</td>
                    <td className="py-2 px-3 text-purple-400">{row[6]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3D METALLAR UCHUN JADVAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 3d metallar uchun kvant sonlar</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Element</th>
                  <th className="py-3 px-4 text-purple-300">Ion</th>
                  <th className="py-3 px-4 text-purple-300">dⁿ</th>
                  <th className="py-3 px-4 text-purple-300">n</th>
                  <th className="py-3 px-4 text-purple-300">l</th>
                  <th className="py-3 px-4 text-purple-300">Toq e⁻ (HS/LS)</th>
                  <th className="py-3 px-4 text-purple-300">μ_s (HS) μB</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  ["Ti", "Ti³⁺", "d¹", "3", "2", "1 / —", "1.73"],
                  ["V", "V³⁺", "d²", "3", "2", "2 / —", "2.83"],
                  ["Cr", "Cr³⁺", "d³", "3", "2", "3 / —", "3.87"],
                  ["Mn", "Mn²⁺", "d⁵", "3", "2", "5 / 1", "5.92 / 1.73"],
                  ["Fe", "Fe²⁺", "d⁶", "3", "2", "4 / 0", "4.90 / 0"],
                  ["Fe", "Fe³⁺", "d⁵", "3", "2", "5 / 1", "5.92 / 1.73"],
                  ["Co", "Co²⁺", "d⁷", "3", "2", "3 / 1", "3.87 / 1.73"],
                  ["Ni", "Ni²⁺", "d⁸", "3", "2", "2 / —", "2.83"],
                  ["Cu", "Cu²⁺", "d⁹", "3", "2", "1 / —", "1.73"],
                  ["Zn", "Zn²⁺", "d¹⁰", "3", "2", "0 / —", "0"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    {r.map((c, j) => (
                      <td key={j} className={`py-3 px-4 ${j===2 ? "text-yellow-400 font-bold" : ""} text-sm`}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>4 ta kvant son (n, l, mₗ, mₛ) — <strong className="text-yellow-400">elektron holatini to'liq tavsiflaydi</strong></li>
            <li>d-orbitallar uchun: <strong className="text-green-400">n ≥ 3, l = 2, mₗ = −2...+2, mₛ = ±½</strong></li>
            <li><strong className="text-green-400">Pauli prinsipi:</strong> bir orbitalda ↑↓ maksimum. <strong className="text-green-400">Xund qoidasi:</strong> avval parallel spin</li>
            <li>Radial tugunlar = n−l−1, burchak tugunlari = l. 3d uchun: 0 radial + 2 burchak = 2 tugun</li>
            <li>Spin kvant soni — <strong className="text-green-400">yuqori/quyi spin va magnit xossalarini</strong> belgilaydi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/modellar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Atom modellari</Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">d-orbital shakli →</Link>
        </div>

      </section>
    </main>
  )
}