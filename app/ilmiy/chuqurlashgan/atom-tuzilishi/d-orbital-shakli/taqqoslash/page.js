"use client"

import Link from "next/link"
import { useState } from "react"

const orbitallar = [
  {
    nomi: "dxy", color: "text-red-400", bg: "bg-red-600/10", border: "border-red-500/30",
    shape: "4 ta bo'lak — o'qlar orasida (45° da)", tekislik: "XY", tugun: "xz, yz",
    guruh: "t₂g", energiya: "−0.4Δ₀ (stabillashgan)", ml: "±2", formula: "xy",
    sferik: "sin²θ·sin(2φ)", maksimum: "θ=90°, φ=45°,135°,225°,315°",
    kbRoli: "π-bog'lanish. Ligandlardan uzoqda — stabillashgan. d⁶ (LS) da to'liq to'ldirilgan."
  },
  {
    nomi: "dxz", color: "text-green-400", bg: "bg-green-600/10", border: "border-green-500/30",
    shape: "4 ta bo'lak — o'qlar orasida (45° da)", tekislik: "XZ", tugun: "xy, yz",
    guruh: "t₂g", energiya: "−0.4Δ₀ (stabillashgan)", ml: "±1", formula: "xz",
    sferik: "sinθ·cosθ·cosφ", maksimum: "θ=45°, φ=0°,180°",
    kbRoli: "dyz bilan degenerat. π-bog'lanishda dyz bilan birgalikda ishtirok etadi."
  },
  {
    nomi: "dyz", color: "text-blue-400", bg: "bg-blue-600/10", border: "border-blue-500/30",
    shape: "4 ta bo'lak — o'qlar orasida (45° da)", tekislik: "YZ", tugun: "xy, xz",
    guruh: "t₂g", energiya: "−0.4Δ₀ (stabillashgan)", ml: "±1", formula: "yz",
    sferik: "sinθ·cosθ·sinφ", maksimum: "θ=45°, φ=90°,270°",
    kbRoli: "dxz bilan degenerat. t₂g guruhining uchinchi a'zosi."
  },
  {
    nomi: "dz²", color: "text-orange-400", bg: "bg-orange-600/10", border: "border-orange-500/30",
    shape: "2 bo'lak (dumbbell) + halqa (donut)", tekislik: "Z o'qi + XY (halqa)", tugun: "2 ta konus (54.7°)",
    guruh: "e_g", energiya: "+0.6Δ₀ (destabillashgan)", ml: "0", formula: "2z²−x²−y²",
    sferik: "3cos²θ−1", maksimum: "θ=0°,180°; θ=90° (halqa)",
    kbRoli: "Eng murakkab shakl. Jahn-Teller effektida muhim. 'Sehrli burchak' 54.7° — tugun konusi."
  },
  {
    nomi: "dx²−y²", color: "text-pink-400", bg: "bg-pink-600/10", border: "border-pink-500/30",
    shape: "4 ta bo'lak — o'qlar ustida", tekislik: "XY (o'qlarda)", tugun: "xz, yz (45° da)",
    guruh: "e_g", energiya: "+0.6Δ₀ (destabillashgan)", ml: "±2", formula: "x²−y²",
    sferik: "sin²θ·cos(2φ)", maksimum: "θ=90°, φ=0°,90°,180°,270°",
    kbRoli: "Eng yuqori energiyali. Ligandlar bilan to'g'ridan-to'g'ri σ-antibog'lovchi. Jahn-Teller da asosiy orbital."
  }
]

export default function Taqqoslash() {
  const [sortBy, setSortBy] = useState("default")
  const [selectedOrb, setSelectedOrb] = useState(null)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli" className="text-purple-400 hover:text-purple-300">d-orbitallar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-purple-300">Taqqoslash</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">⚖️ d-orbitallar taqqoslanishi</h1>
          <p className="text-purple-400 text-sm">5 ta orbital • Shakli • Energiyasi • Simmetriyasi • KB dagi roli</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY JADVAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 To'liq taqqoslash jadvali</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="text-left py-3 px-3 text-yellow-400">Xususiyat</th>
                  {orbitallar.map((o, i) => (
                    <th key={i} className={`text-left py-3 px-3 ${o.color}`}>{o.nomi}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  ["Shakli", ...orbitallar.map(o => o.shape)],
                  ["Tekisligi", ...orbitallar.map(o => o.tekislik)],
                  ["Tugunlari", ...orbitallar.map(o => o.tugun)],
                  ["Oktaedrik guruh", ...orbitallar.map(o => o.guruh)],
                  ["Energiyasi", ...orbitallar.map(o => o.energiya)],
                  ["Magnit kvant soni (mₗ)", ...orbitallar.map(o => o.ml)],
                  ["Dekart formulasi", ...orbitallar.map(o => o.formula)],
                  ["Sferik formulasi", ...orbitallar.map(o => o.sferik)],
                  ["Maksimum burchaklari", ...orbitallar.map(o => o.maksimum)],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3"><strong>{row[0]}</strong></td>
                    {row.slice(1).map((cell, j) => (
                      <td key={j} className={`py-2 px-3 ${orbitallar[j].color}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* INTERAKTIV KARTALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔍 Har bir orbitalni bosing — batafsil</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {orbitallar.map((o, i) => (
              <button
                key={i}
                onClick={() => setSelectedOrb(selectedOrb === i ? null : i)}
                className={`rounded-xl p-4 border transition-all text-center ${o.border} ${o.bg} ${
                  selectedOrb === i ? "scale-105 shadow-lg" : "hover:scale-105"
                }`}
              >
                <p className={`font-mono font-bold text-lg ${o.color}`}>{o.nomi}</p>
                <p className="text-purple-400 text-xs mt-1">{o.guruh}</p>
                <p className="text-purple-300 text-xs mt-1">{o.energiya.split(" ")[0]}</p>
              </button>
            ))}
          </div>

          {selectedOrb !== null && (
            <div className={`mt-4 rounded-xl p-5 border ${orbitallar[selectedOrb].border} ${orbitallar[selectedOrb].bg}`}>
              <h3 className={`font-bold text-lg mb-3 ${orbitallar[selectedOrb].color}`}>
                {orbitallar[selectedOrb].nomi} — koordinatsion birikmalarda roli
              </h3>
              <p className="text-purple-200 text-sm">{orbitallar[selectedOrb].kbRoli}</p>
              <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
                <div className="bg-purple-900/50 rounded p-2">
                  <p className="text-purple-400">Shakli</p>
                  <p className="text-purple-200">{orbitallar[selectedOrb].shape}</p>
                </div>
                <div className="bg-purple-900/50 rounded p-2">
                  <p className="text-purple-400">Tugunlari</p>
                  <p className="text-purple-200">{orbitallar[selectedOrb].tugun}</p>
                </div>
                <div className="bg-purple-900/50 rounded p-2">
                  <p className="text-purple-400">Formula</p>
                  <p className="font-mono text-purple-200">{orbitallar[selectedOrb].formula}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ENERGETIK SOLISHTIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Energetik solishtirish</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-xs">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-purple-300 font-bold mb-3">Erkin ion</p>
              <div className="space-y-1">
                {orbitallar.map((o, i) => (
                  <div key={i} className={`${o.bg} rounded p-2`}>
                    <span className={o.color}>{o.nomi}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 mt-2">Δ = 0 (barcha degenerat)</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-blue-400 font-bold mb-3">Oktaedrik maydon</p>
              <div className="space-y-1">
                <div className="bg-red-600/10 rounded p-2">
                  <p className="text-red-400">dz², dx²−y² — e_g</p>
                </div>
                <p className="text-yellow-400">Δ₀</p>
                <div className="bg-green-600/10 rounded p-2">
                  <p className="text-green-400">dxy, dxz, dyz — t₂g</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-green-400 font-bold mb-3">Tetraedrik maydon</p>
              <div className="space-y-1">
                <div className="bg-red-600/10 rounded p-2">
                  <p className="text-red-400">dxy, dxz, dyz — t₂</p>
                </div>
                <p className="text-yellow-400">Δ_t ≈ 0.44Δ₀</p>
                <div className="bg-green-600/10 rounded p-2">
                  <p className="text-green-400">dz², dx²−y² — e</p>
                </div>
              </div>
              <p className="text-yellow-400 mt-2">Teskari ajralish!</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/3d" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← 3D Model</Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/tugun-tekisliklari" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Tugun tekisliklari →</Link>
        </div>

      </section>
    </main>
  )
}