"use client"

import { useState } from "react"
import { xanesParametrlar } from "../data/ni-cn4-data"

const comparisons = {
  nio: {
    name: "Ni⁰ — metall nikel",
    e0: "8333 eV",
    whiteLine: "Minimal (d¹⁰ — to'liq to'lgan)",
    note: "Ni⁰ (d¹⁰) da 3d orbitallar to'liq to'lgan — oq chiziq deyarli yo'q. E₀ eng past.",
    color: "text-gray-400"
  },
  nih2o: {
    name: "[Ni(H₂O)₆]²⁺ — Ni²⁺ (oktaedrik)",
    preEdge: "8332.5 eV",
    intensity: "~0.03−0.05 (kuchsiz)",
    e0: "8341 eV",
    note: "Oktaedrik simmetriya — dipol taqiqi kuchli. Pre-edge kuchsiz. [Ni(CN)₄]²⁻ ga nisbatan pre-edge 2-3 marta kuchsizroq.",
    color: "text-green-400"
  },
  nife: {
    name: "[NiFe]-gidrogenaza — Ni²⁺ (ko'p yadroli)",
    preEdge: "8333.0 eV",
    intensity: "~0.08−0.12",
    e0: "8340 eV",
    note: "Ni−Fe klasterda Ni murakkab koordinatsion muhitda. Pre-edge [Ni(CN)₄]²⁻ bilan solishtirish mumkin.",
    color: "text-purple-400"
  }
}

export default function XANESPreEdge() {
  const [compareWith, setCompareWith] = useState("nih2o")
  const c = comparisons[compareWith]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 XANES pre-edge tahlili — [Ni(CN)₄]²⁻</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Pre-edge pik</strong> — [Ni(CN)₄]²⁻ (Ni²⁺, d⁸, kvadrat tekislik) da 
          <strong className="text-yellow-400"> sezilarli</strong> (~0.06−0.10).
          dx²−y² orbital bo'sh — 1s→3d o'tish uchun qulay. Kvadrat tekislikda 
          <strong> markaziy simmetriya yo'q</strong> — dipol taqiqi zaifroq.
        </p>

        <div className="grid grid-cols-3 gap-3 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">[Ni(CN)₄]²⁻</p>
            <p className="text-blue-400 font-bold">Ni²⁺ (d⁸, D₄h)</p>
            <p className="text-emerald-400 font-mono mt-1">{xanesParametrlar.preEdge.energy}</p>
            <p className="text-yellow-400">{xanesParametrlar.preEdge.intensity}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">dx²−y²</p>
            <div className="text-3xl mt-2">🎯</div>
            <p className="text-purple-300 mt-1">Bo'sh orbital</p>
            <p className="text-purple-400 text-xs mt-1">1s→3d uchun qulay</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Simmetriya</p>
            <div className="text-3xl mt-2">◻️</div>
            <p className="text-purple-300 mt-1">Kvadrat (D₄h)</p>
            <p className="text-purple-400 text-xs mt-1">Dipol taqiqi zaif</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-xs mb-4">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun [Ni(CN)₄]²⁻ pre-edge oktaedrik Ni²⁺ dan kuchliroq?</p>
          <p className="text-purple-200">
            <strong>Kvadrat tekislik (D₄h) da markaziy simmetriya yo'q</strong> — 
            dipol taqiqi oktaedrik (O_h) ga nisbatan zaifroq. dx²−y² orbital bo'sh — 
            1s→dx²−y² o'tish qisman ruxsat etilgan. 
            <strong> Oktaedrik [Ni(H₂O)₆]²⁺</strong> da markaziy simmetriya bor — 
            pre-edge 2-3 marta kuchsizroq.
          </p>
        </div>

        <div>
          <p className="text-purple-400 text-xs mb-2">Boshqa Ni komplekslari bilan solishtiring:</p>
          <div className="flex gap-2 mb-3 flex-wrap">
            <button onClick={() => setCompareWith("nih2o")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "nih2o" ? "bg-green-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs [Ni(H₂O)₆]²⁺
            </button>
            <button onClick={() => setCompareWith("nio")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "nio" ? "bg-gray-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs Ni⁰
            </button>
            <button onClick={() => setCompareWith("nife")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "nife" ? "bg-purple-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs [NiFe]-gidrogenaza
            </button>
          </div>

          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700/30">
            <h4 className={`font-bold text-sm mb-2 ${c.color}`}>{c.name}</h4>
            <div className="grid grid-cols-3 gap-3 text-xs text-center mb-3">
              <div className="bg-purple-800/30 rounded p-2">
                <p className="text-purple-400">Pre-edge</p>
                <p className="text-emerald-400 font-mono">{c.preEdge || "—"}</p>
              </div>
              <div className="bg-purple-800/30 rounded p-2">
                <p className="text-purple-400">Intensivlik</p>
                <p className={c.color}>{c.intensity || "—"}</p>
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