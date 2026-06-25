"use client"

import { useState } from "react"
import { xanesParametrlar } from "../data/k4-fe-cn6-data"

const comparisons = {
  k3: {
    name: "K₃[Fe(CN)₆] — Fe³⁺ (LS, d⁵)",
    preEdge: "7113.0 eV",
    intensity: "~0.18−0.25 (kuchli)",
    e0: "7127.5 eV",
    note: "Fe³⁺ da t₂g⁵ — 1 ta bo'sh o'rin bor. 1s→3d o'tish uchun qulay. Pre-edge K₄[Fe(CN)₆] ga nisbatan 5-10 marta kuchliroq.",
    color: "text-red-400"
  },
  fecl4: {
    name: "[FeCl₄]²⁻ — Fe²⁺ (HS, d⁶)",
    preEdge: "7112.5 eV",
    intensity: "~0.25 (juda kuchli)",
    e0: "7123.0 eV",
    note: "Tetraedrik kompleks — p-d aralashuvi tufayli dipol taqiqi yo'qolgan. K₄[Fe(CN)₆] dan ~10 marta intensivroq. Pre-edge eng kuchli.",
    color: "text-orange-400"
  }
}

export default function XANESPreEdge() {
  const [compareWith, setCompareWith] = useState("k3")
  const c = comparisons[compareWith]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 XANES pre-edge tahlili — K₄[Fe(CN)₆]</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Pre-edge pik</strong> — K₄[Fe(CN)₆] (Fe²⁺, t₂g⁶) da 
          <strong className="text-yellow-400"> deyarli ko'rinmaydi</strong> (~0.02−0.05).
          Sababi: barcha t₂g orbitallar to'lgan — 1s→3d o'tish uchun <strong>bo'sh o'rin yo'q</strong>.
          Bu — oksidlanish darajasini aniqlashning eng ishonchli XANES usuli.
        </p>

        <div className="grid grid-cols-3 gap-3 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">K₄[Fe(CN)₆]</p>
            <p className="text-yellow-400 font-bold">Fe²⁺ (t₂g⁶)</p>
            <p className="text-emerald-400 font-mono mt-1">{xanesParametrlar.preEdge.energy}</p>
            <p className="text-yellow-400">{xanesParametrlar.preEdge.intensity}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Bo'sh t₂g o'rni</p>
            <div className="text-3xl mt-2">🚫</div>
            <p className="text-purple-300 mt-1">Bo'sh o'rin YO'Q</p>
            <p className="text-purple-400 text-xs mt-1">Pauli taqiqlaydi</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Simmetriya</p>
            <div className="text-3xl mt-2">📐</div>
            <p className="text-purple-300 mt-1">Oktaedrik (O_h)</p>
            <p className="text-purple-400 text-xs mt-1">Dipol taqiqi to'liq</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-xs mb-4">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Fe²⁺ pre-edge deyarli yo'q?</p>
          <p className="text-purple-200">
            Fe²⁺ (t₂g⁶) da <strong>barcha 3d orbitallar to'lgan</strong>. Pauli prinsipi bo'yicha 
            1s elektron 3d ga o'ta olmaydi — <strong>bo'sh o'rin yo'q</strong>. 
            Kuchsiz signal (~0.02−0.05) faqat <strong>kvadrupol ruxsati</strong> va 
            <strong> p-d aralashuvi</strong> tufayli kuzatiladi. Fe³⁺ (t₂g⁵) da esa 
            1 ta bo'sh o'rin bor — pre-edge <strong>5-10 marta kuchliroq</strong>.
          </p>
        </div>

        <div>
          <p className="text-purple-400 text-xs mb-2">Boshqa komplekslar bilan solishtiring:</p>
          <div className="flex gap-2 mb-3">
            <button onClick={() => setCompareWith("k3")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "k3" ? "bg-red-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs K₃[Fe(CN)₆]
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