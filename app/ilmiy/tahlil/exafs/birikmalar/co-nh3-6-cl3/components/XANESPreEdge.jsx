"use client"

import { useState } from "react"
import { xanesParametrlar } from "../data/co-nh3-6-cl3-data"

const comparisons = {
  co2hs: {
    name: "[Co(H₂O)₆]²⁺ — Co²⁺ (HS, d⁷)",
    preEdge: "7711.8 eV",
    intensity: "~0.08−0.15 (o'rtacha-kuchli)",
    e0: "7725.5 eV",
    note: "Co²⁺ (HS, t₂g⁵ e_g²) — 3 ta toq elektron. Bo'sh d-orbitallar mavjud emas, lekin e_g dagi bo'sh o'rinlar pre-edge uchun imkon beradi. Intensivlik Co³⁺ ga nisbatan 2-3 marta kuchliroq.",
    color: "text-pink-400"
  },
  co2ls: {
    name: "[Co(CN)₆]⁴⁻ — Co²⁺ (LS, d⁷)",
    preEdge: "7712.2 eV",
    intensity: "~0.05−0.08 (kuchsiz-o'rtacha)",
    e0: "7725.8 eV",
    note: "Co²⁺ (LS, t₂g⁶ e_g¹) — 1 ta toq elektron. e_g da 1 ta bo'sh o'rin — pre-edge Co³⁺ ga nisbatan kuchliroq, lekin HS Co²⁺ ga nisbatan kuchsizroq.",
    color: "text-purple-400"
  },
  fe3: {
    name: "K₃[Fe(CN)₆] — Fe³⁺ (LS, d⁵)",
    preEdge: "7113.0 eV",
    intensity: "~0.18−0.25 (kuchli)",
    e0: "7127.5 eV",
    note: "Taqqoslash uchun: Fe³⁺ da 1 ta bo'sh t₂g o'rin — pre-edge Co³⁺ ga nisbatan 5-8 marta kuchliroq. Co³⁺ da bo'sh o'rin umuman yo'q.",
    color: "text-red-400"
  }
}

export default function XANESPreEdge() {
  const [compareWith, setCompareWith] = useState("co2hs")
  const c = comparisons[compareWith]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 XANES pre-edge tahlili — [Co(NH₃)₆]Cl₃</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Pre-edge pik</strong> — [Co(NH₃)₆]Cl₃ (Co³⁺, LS, t₂g⁶) da 
          <strong className="text-yellow-400"> deyarli ko'rinmaydi</strong> (~0.03−0.05).
          Sababi: barcha t₂g orbitallar to'lgan, e_g bo'sh — lekin 1s→3d o'tish 
          <strong> dipol taqiqlangan</strong> (Δl=2). Oktaedrik simmetriya taqiqni kuchaytiradi.
        </p>

        <div className="grid grid-cols-3 gap-3 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">[Co(NH₃)₆]Cl₃</p>
            <p className="text-blue-400 font-bold">Co³⁺ (t₂g⁶)</p>
            <p className="text-emerald-400 font-mono mt-1">{xanesParametrlar.preEdge.energy}</p>
            <p className="text-yellow-400">{xanesParametrlar.preEdge.intensity}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Bo'sh d-orbital</p>
            <div className="text-3xl mt-2">📐</div>
            <p className="text-purple-300 mt-1">e_g bo'sh, t₂g to'lgan</p>
            <p className="text-purple-400 text-xs mt-1">Dipol taqiqi mavjud</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Simmetriya</p>
            <div className="text-3xl mt-2">🔷</div>
            <p className="text-purple-300 mt-1">Oktaedrik (O_h)</p>
            <p className="text-purple-400 text-xs mt-1">Markaziy simmetriya</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-xs mb-4">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Co³⁺ pre-edge deyarli yo'q?</p>
          <p className="text-purple-200">
            Co³⁺ (LS, t₂g⁶) da <strong>barcha t₂g orbitallar to'lgan</strong>. 
            e_g orbitallar bo'sh, lekin 1s→e_g o'tish energiyasi pre-edge sohasidan tashqarida (asosiy chegarada).
            1s→t₂g o'tish uchun esa <strong>bo'sh o'rin yo'q</strong> — Pauli prinsipi taqiqlaydi.
            Kuchsiz signal (~0.03−0.05) faqat <strong>kvadrupol ruxsati</strong> tufayli.
          </p>
        </div>

        <div>
          <p className="text-purple-400 text-xs mb-2">Boshqa komplekslar bilan solishtiring:</p>
          <div className="flex gap-2 mb-3 flex-wrap">
            <button onClick={() => setCompareWith("co2hs")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "co2hs" ? "bg-pink-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs [Co(H₂O)₆]²⁺ (HS)
            </button>
            <button onClick={() => setCompareWith("co2ls")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "co2ls" ? "bg-purple-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs [Co(CN)₆]⁴⁻ (LS)
            </button>
            <button onClick={() => setCompareWith("fe3")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "fe3" ? "bg-red-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs K₃[Fe(CN)₆]
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