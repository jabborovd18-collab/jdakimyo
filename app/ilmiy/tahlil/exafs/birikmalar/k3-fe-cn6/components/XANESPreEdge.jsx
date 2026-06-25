"use client"

import { useState } from "react"
import { xanesParametrlar } from "../data/k3-fe-cn6-data"

const comparisons = {
  k4: {
    name: "K₄[Fe(CN)₆] — Fe²⁺ (LS, d⁶)",
    preEdge: "7111.8 eV",
    intensity: "~0.02−0.05 (juda kuchsiz)",
    e0: "7126.0 eV",
    note: "Fe²⁺ da t₂g to'liq to'lgan (t₂g⁶) — 1s→3d o'tish uchun bo'sh o'rin yo'q. Pre-edge deyarli ko'rinmaydi. Dipol taqiqi to'liq kuchda.",
    color: "text-yellow-400"
  },
  fecl4: {
    name: "[FeCl₄]²⁻ — Fe²⁺ (HS, d⁶)",
    preEdge: "7112.5 eV",
    intensity: "~0.25 (juda kuchli)",
    e0: "7123.0 eV",
    note: "Tetraedrik kompleks — markaziy simmetriya yo'q. p-d aralashuvi tufayli dipol taqiqi butunlay yo'qolgan. Pre-edge K₃[Fe(CN)₆] dan ~2 marta intensivroq.",
    color: "text-orange-400"
  }
}

export default function XANESPreEdge() {
  const [compareWith, setCompareWith] = useState("k4")

  const c = comparisons[compareWith]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 XANES pre-edge tahlili</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Pre-edge pik</strong> — yutilish chegarasidan oldingi kuchsiz signal.
          1s → 3d o'tish. Oktaedrik komplekslarda <strong>dipol bo'yicha taqiqlangan</strong> (Δl=2),
          lekin <strong>kvadrupol ruxsati</strong> va <strong>p-d aralashuvi</strong> tufayli zaif kuzatiladi.
        </p>

        <div className="grid grid-cols-3 gap-3 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">K₃[Fe(CN)₆]</p>
            <p className="text-red-400 font-bold">Fe³⁺ (t₂g⁵)</p>
            <p className="text-emerald-400 font-mono mt-1">{xanesParametrlar.preEdge.energy}</p>
            <p className="text-yellow-400">{xanesParametrlar.preEdge.intensity}</p>
          </div>

          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Bo'sh t₂g o'rni</p>
            <div className="text-3xl mt-2">🎯</div>
            <p className="text-purple-300 mt-1">1 ta bo'sh o'rin</p>
            <p className="text-purple-400 text-xs mt-1">1s→3d o'tish uchun qulay</p>
          </div>

          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Simmetriya</p>
            <div className="text-3xl mt-2">📐</div>
            <p className="text-purple-300 mt-1">Oktaedrik (O_h)</p>
            <p className="text-purple-400 text-xs mt-1">Dipol taqiqi qisman</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-xs mb-4">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Fe³⁺ pre-edge kuchliroq?</p>
          <p className="text-purple-200">
            Fe³⁺ (t₂g⁵) da <strong>1 ta bo'sh t₂g o'rin</strong> mavjud — 1s elektron 3d ga o'tishi mumkin.
            Fe²⁺ (t₂g⁶) da <strong>bo'sh o'rin yo'q</strong> — Pauli prinsipi taqiqlaydi.
            Shuning uchun Fe³⁺ pre-edge intensivligi Fe²⁺ ga nisbatan <strong>5-10 marta kuchliroq</strong>.
            Bu — oksidlanish darajasini aniqlashning eng ishonchli XANES usuli.
          </p>
        </div>

        {/* Solishtirish */}
        <div>
          <p className="text-purple-400 text-xs mb-2">Boshqa komplekslar bilan solishtiring:</p>
          <div className="flex gap-2 mb-3">
            <button onClick={() => setCompareWith("k4")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "k4" ? "bg-yellow-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs K₄[Fe(CN)₆]
            </button>
            <button onClick={() => setCompareWith("fecl4")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "fecl4" ? "bg-orange-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs [FeCl₄]²⁻
            </button>
          </div>

          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700/30">
            <h4 className={`font-bold text-sm mb-2 ${c.color}`}>{c.name}</h4>
            <div className="grid grid-cols-3 gap-3 text-xs text-center mb-3">
              <div className="bg-purple-800/30 rounded p-2">
                <p className="text-purple-400">Pre-edge</p>
                <p className="text-emerald-400 font-mono">{c.preEdge}</p>
              </div>
              <div className="bg-purple-800/30 rounded p-2">
                <p className="text-purple-400">Intensivlik</p>
                <p className={c.color}>{c.intensity}</p>
              </div>
              <div className="bg-purple-800/30 rounded p-2">
                <p className="text-purple-400">E₀</p>
                <p className="text-blue-400 font-mono">{c.e0}</p>
              </div>
            </div>
            <p className="text-purple-200 text-xs">{c.note}</p>
          </div>
        </div>
      </div>
    </div>
  )
}