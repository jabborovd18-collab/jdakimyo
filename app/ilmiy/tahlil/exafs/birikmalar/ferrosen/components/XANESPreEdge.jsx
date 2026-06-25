"use client"

import { useState } from "react"
import { xanesParametrlar } from "../data/ferrosen-data"

const comparisons = {
  k4: {
    name: "K₄[Fe(CN)₆] — Fe²⁺ (LS, oktaedrik)",
    preEdge: "7111.8 eV",
    intensity: "~0.02−0.05 (juda kuchsiz)",
    e0: "7126.0 eV",
    note: "Oktaedrik simmetriya — dipol taqiqi kuchli. Pre-edge deyarli yo'q. Ferrosenga nisbatan E₀ +1.5 eV yuqori — CN⁻ kuchli π-akseptor.",
    color: "text-yellow-400"
  },
  ferrosenium: {
    name: "[Fe(C₅H₅)₂]⁺ — Ferrosenium (Fe³⁺)",
    preEdge: "7112.5 eV",
    intensity: "~0.10−0.15 (kuchliroq)",
    e0: "7126.5 eV",
    note: "Fe³⁺ (d⁵, LS) — 1 ta bo'sh t₂g o'rin. Pre-edge ferrosenga nisbatan 2-3 marta kuchliroq. E₀ +2 eV siljigan.",
    color: "text-blue-400"
  },
  fecl4: {
    name: "[FeCl₄]²⁻ — Fe²⁺ (HS, tetraedrik)",
    preEdge: "7112.5 eV",
    intensity: "~0.25 (juda kuchli)",
    e0: "7123.0 eV",
    note: "Tetraedrik — p-d aralashuvi tufayli pre-edge eng kuchli. Ferrosenga nisbatan 5 marta intensivroq. Geometriya farqi yaqqol ko'rinadi.",
    color: "text-orange-400"
  }
}

export default function XANESPreEdge() {
  const [compareWith, setCompareWith] = useState("k4")
  const c = comparisons[compareWith]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 XANES pre-edge tahlili — Ferrosen</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Pre-edge pik</strong> — Ferrosenda (Fe²⁺, LS, d⁶) 
          <strong className="text-yellow-400"> kuchsiz-o'rtacha</strong> (~0.04−0.06).
          Oktaedrik simmetriya yo'q (D₅d/D₅h) — <strong>dipol taqiqi zaifroq</strong>.
          t₂g to'lgan, e_g bo'sh — 1s→e_g o'tish qisman ruxsat etilgan.
        </p>

        <div className="grid grid-cols-3 gap-3 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Ferrosen</p>
            <p className="text-orange-400 font-bold">Fe²⁺ (d⁶, LS)</p>
            <p className="text-emerald-400 font-mono mt-1">{xanesParametrlar.preEdge.energy}</p>
            <p className="text-yellow-400">{xanesParametrlar.preEdge.intensity}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Simmetriya</p>
            <div className="text-3xl mt-2">🥪</div>
            <p className="text-purple-300 mt-1">Sendvich (D₅d)</p>
            <p className="text-purple-400 text-xs mt-1">Dipol taqiqi zaif</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">18 elektron</p>
            <div className="text-3xl mt-2">⭐</div>
            <p className="text-purple-300 mt-1">Barqaror qobiq</p>
            <p className="text-purple-400 text-xs mt-1">Termodinamik barqaror</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-xs mb-4">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun ferrosen pre-edge oktaedrik Fe²⁺ dan kuchliroq?</p>
          <p className="text-purple-200">
            Ferrosenda <strong>markaziy simmetriya yo'q</strong> (D₅d/D₅h) — 
            dipol taqiqi oktaedrik (O_h) ga nisbatan zaifroq. Shuning uchun pre-edge 
            intensivligi <strong>K₄[Fe(CN)₆] (~0.02−0.05) dan yuqori</strong> (~0.04−0.06).
            Bu — <strong>geometriyani aniqlashning XANES usuli</strong>.
          </p>
        </div>

        <div>
          <p className="text-purple-400 text-xs mb-2">Boshqa Fe komplekslari bilan solishtiring:</p>
          <div className="flex gap-2 mb-3 flex-wrap">
            <button onClick={() => setCompareWith("k4")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "k4" ? "bg-yellow-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs K₄[Fe(CN)₆]
            </button>
            <button onClick={() => setCompareWith("ferrosenium")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "ferrosenium" ? "bg-blue-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs Ferrosenium
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