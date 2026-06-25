"use client"

import { useState } from "react"
import { xanesParametrlar } from "../data/ag-nh3-2-data"

const comparisons = {
  ag0: {
    name: "Ag⁰ — metall kumush",
    e0: "25514 eV",
    whiteLine: "Minimal (d¹⁰ — to'liq to'lgan)",
    note: "Ag⁰ (d¹⁰) — 4d orbitallar to'liq to'lgan. Oq chiziq deyarli yo'q. E₀ eng past.",
    color: "text-gray-300"
  },
  ag2: {
    name: "AgO — Ag²⁺ (d⁹, kam uchraydi)",
    e0: "25520 eV",
    whiteLine: "Kuchli (d⁹ — 1 ta bo'sh 4d o'rin)",
    note: "Ag²⁺ (d⁹) — 4d da 1 ta bo'sh o'rin. Oq chiziq Ag⁺ ga nisbatan ancha kuchli. E₀ +3 eV (Ag⁺ ga nisbatan). Kam uchraydi — kuchli oksidlovchi.",
    color: "text-red-400"
  },
  cu1: {
    name: "[Cu(NH₃)₂]⁺ — Cu⁺ (d¹⁰, chiziqli)",
    e0: "8982 eV",
    whiteLine: "Minimal (d¹⁰ — to'liq to'lgan)",
    note: "Cu⁺ (d¹⁰) — Ag⁺ bilan izoelektronik. Ikkalasi ham chiziqli, rangsiz, d¹⁰. Oq chiziq ikkalasida ham minimal.",
    color: "text-yellow-400"
  }
}

export default function XANESPreEdge() {
  const [compareWith, setCompareWith] = useState("ag0")
  const c = comparisons[compareWith]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 XANES tahlili — Ag K-chegara</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Ag K-chegara (1s → 5p)</strong> — 
          [Ag(NH₃)₂]⁺ (Ag⁺, d¹⁰) da oq chiziq <strong>minimal</strong>.
          d¹⁰ konfiguratsiya — 4d orbitallar to'liq to'lgan. 
          Oq chiziqning kuchsizligi <strong>d¹⁰ ning xarakterli belgisi</strong>.
          Pre-edge K-chegarada kuzatilmaydi (dipol ruxsat etilgan).
        </p>

        <div className="grid grid-cols-3 gap-3 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">[Ag(NH₃)₂]⁺</p>
            <p className="text-gray-300 font-bold">Ag⁺ (d¹⁰)</p>
            <p className="text-emerald-400 font-mono mt-1">{xanesParametrlar.e0.value}</p>
            <p className="text-yellow-400">{xanesParametrlar.whiteLine.intensity}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">4d orbitallar</p>
            <div className="text-3xl mt-2">✅</div>
            <p className="text-purple-300 mt-1">To'liq to'lgan</p>
            <p className="text-purple-400 text-xs mt-1">Bo'sh o'rin yo'q</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Geometriya</p>
            <div className="text-3xl mt-2">📏</div>
            <p className="text-purple-300 mt-1">Chiziqli (D∞h)</p>
            <p className="text-purple-400 text-xs mt-1">sp-gibridlanish</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-xs mb-4">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Ag⁺ oq chiziq minimal?</p>
          <p className="text-purple-200">
            Ag⁺ (d¹⁰) da <strong>barcha 4d orbitallar to'lgan</strong> — 
            5p orbitallarga elektron o'tishi uchun to'siq yo'q, lekin 
            <strong> 4d→5p ekranlashuvi</strong> tufayli 1s→5p o'tish ehtimoli 
            <strong> nisbatan past</strong>. d¹⁰ konfiguratsiyada oq chiziq 
            har doim d⁹ yoki d⁸ ga nisbatan kuchsizroq.
          </p>
        </div>

        <div>
          <p className="text-purple-400 text-xs mb-2">Boshqa holatlar bilan solishtiring:</p>
          <div className="flex gap-2 mb-3 flex-wrap">
            <button onClick={() => setCompareWith("ag0")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "ag0" ? "bg-gray-400/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs Ag⁰ (metall)
            </button>
            <button onClick={() => setCompareWith("ag2")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "ag2" ? "bg-red-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs Ag²⁺ (AgO)
            </button>
            <button onClick={() => setCompareWith("cu1")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "cu1" ? "bg-yellow-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs Cu⁺ [Cu(NH₃)₂]⁺
            </button>
          </div>

          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700/30">
            <h4 className={`font-bold text-sm mb-2 ${c.color}`}>{c.name}</h4>
            <div className="grid grid-cols-2 gap-3 text-xs text-center mb-3">
              <div className="bg-purple-800/30 rounded p-2">
                <p className="text-purple-400">E₀</p>
                <p className="text-blue-400 font-mono">{c.e0}</p>
              </div>
              <div className="bg-purple-800/30 rounded p-2">
                <p className="text-purple-400">Oq chiziq</p>
                <p className={c.color}>{c.whiteLine}</p>
              </div>
            </div>
            <p className="text-purple-200 text-xs">{c.note}</p>
          </div>
        </div>
      </div>
    </div>
  )
}