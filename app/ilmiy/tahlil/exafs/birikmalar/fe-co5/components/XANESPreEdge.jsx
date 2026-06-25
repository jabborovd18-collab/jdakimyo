"use client"

import { useState } from "react"
import { xanesParametrlar } from "../data/fe-co5-data"

const comparisons = {
  fe2: {
    name: "K₄[Fe(CN)₆] — Fe²⁺ (LS, oktaedrik)",
    preEdge: "7111.8 eV",
    intensity: "~0.02−0.05",
    e0: "7126.0 eV",
    note: "Fe²⁺ (d⁶) — E₀ +11.5 eV (Fe⁰ ga nisbatan). Pre-edge kuchsiz (O_h simmetriya). Oq chiziq kuchli.",
    color: "text-yellow-400"
  },
  fe3: {
    name: "K₃[Fe(CN)₆] — Fe³⁺ (LS, oktaedrik)",
    preEdge: "7113.0 eV",
    intensity: "~0.18−0.25",
    e0: "7127.5 eV",
    note: "Fe³⁺ (d⁵) — E₀ +13 eV. Pre-edge kuchli (bo'sh t₂g o'rni). Oq chiziq juda kuchli.",
    color: "text-red-400"
  },
  ferrosen: {
    name: "[Fe(C₅H₅)₂] — Fe²⁺ (sendvich)",
    preEdge: "7111.5 eV",
    intensity: "~0.04−0.06",
    e0: "7124.5 eV",
    note: "Fe²⁺ — lekin Fe⁰ ga yaqin E₀ (+10 eV). Cp⁻ kuchli donor — Fe elektron zichligi yuqori. Pre-edge o'rtacha.",
    color: "text-orange-400"
  }
}

export default function XANESPreEdge() {
  const [compareWith, setCompareWith] = useState("fe2")
  const c = comparisons[compareWith]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 XANES tahlili — Fe⁰ (Fe(CO)₅)</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Fe K-chegara XANES</strong> — 
          [Fe(CO)₅] (Fe⁰, d⁸) da E₀ = <strong>7114.5 eV</strong> — 
          <strong> eng past</strong> Fe oksidlanish darajalari orasida.
          CO kuchli π-akseptor — Fe elektron zichligini tortib oladi, 
          lekin Fe⁰ baribir Fe²⁺/Fe³⁺ dan pastroq E₀ ga ega.
          Oq chiziq minimal — Fe elektron kambag'al.
        </p>

        <div className="grid grid-cols-3 gap-3 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">[Fe(CO)₅]</p>
            <p className="text-yellow-400 font-bold">Fe⁰ (d⁸)</p>
            <p className="text-emerald-400 font-mono mt-1">{xanesParametrlar.e0.value}</p>
            <p className="text-yellow-400">{xanesParametrlar.whiteLine.intensity}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">CO ta'siri</p>
            <div className="text-3xl mt-2">🔄</div>
            <p className="text-purple-300 mt-1">Kuchli π-akseptor</p>
            <p className="text-purple-400 text-xs mt-1">Fe elektron kambag'al</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">18 elektron</p>
            <div className="text-3xl mt-2">⭐</div>
            <p className="text-purple-300 mt-1">Barqaror qobiq</p>
            <p className="text-purple-400 text-xs mt-1">Fe(0) 8e⁻ + 5CO 10e⁻</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-xs mb-4">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Fe⁰ E₀ eng past?</p>
          <p className="text-purple-200">
            Fe⁰ da yadro zaryadi <strong>samarali pastroq</strong> — 1s elektron 
            <strong> kuchsizroq bog'langan</strong>. E₀ = 7114.5 eV.
            Fe²⁺ da +11.5 eV, Fe³⁺ da +13 eV siljish.
            CO π-akseptor bo'lsa ham, <strong>oksidlanish darajasi asosiy omil</strong>.
            E₀ siljishi — oksidlanish darajasining eng ishonchli XANES indikatori.
          </p>
        </div>

        <div>
          <p className="text-purple-400 text-xs mb-2">Boshqa Fe komplekslari bilan solishtiring:</p>
          <div className="flex gap-2 mb-3 flex-wrap">
            <button onClick={() => setCompareWith("fe2")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "fe2" ? "bg-yellow-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs Fe²⁺ K₄[Fe(CN)₆]
            </button>
            <button onClick={() => setCompareWith("fe3")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "fe3" ? "bg-red-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs Fe³⁺ K₃[Fe(CN)₆]
            </button>
            <button onClick={() => setCompareWith("ferrosen")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "ferrosen" ? "bg-orange-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs Ferrosen Fe²⁺
            </button>
          </div>

          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700/30">
            <h4 className={`font-bold text-sm mb-2 ${c.color}`}>{c.name}</h4>
            <div className="grid grid-cols-3 gap-3 text-xs text-center mb-3">
              <div className="bg-purple-800/30 rounded p-2"><p className="text-purple-400">Pre-edge</p><p className="text-emerald-400 font-mono">{c.preEdge}</p></div>
              <div className="bg-purple-800/30 rounded p-2"><p className="text-purple-400">Intensivlik</p><p className={c.color}>{c.intensity}</p></div>
              <div className="bg-purple-800/30 rounded p-2"><p className="text-purple-400">E₀</p><p className="text-blue-400 font-mono">{c.e0}</p></div>
            </div>
            <p className="text-purple-200 text-xs">{c.note}</p>
          </div>
        </div>
      </div>
    </div>
  )
}