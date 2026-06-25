"use client"

import { useState } from "react"
import { xanesParametrlar } from "../data/cu-h2o6-data"

const comparisons = {
  cuo: {
    name: "Cu⁰ — metall mis",
    e0: "8979 eV",
    whiteLine: "Minimal (d¹⁰ — 3d to'liq to'lgan)",
    note: "Cu⁰ (d¹⁰) da 3d orbitallar to'liq to'lgan — oq chiziq minimal. E₀ eng past.",
    color: "text-orange-400"
  },
  cu1: {
    name: "[Cu(NH₃)₂]⁺ — Cu⁺ (d¹⁰, chiziqli)",
    e0: "8982 eV",
    whiteLine: "Minimal (d¹⁰ — to'liq to'lgan)",
    note: "Cu⁺ (d¹⁰) ham 3d to'liq to'lgan — oq chiziq Cu⁰ ga o'xshash. E₀ +3 eV (Cu⁰ ga nisbatan).",
    color: "text-yellow-400"
  },
  cu3: {
    name: "K₃[CuF₆] — Cu³⁺ (d⁸, LS)",
    e0: "8999 eV",
    whiteLine: "Juda kuchli (d⁸ — ko'p bo'sh 3d o'rin)",
    note: "Cu³⁺ (d⁸) — 3d da 2 ta bo'sh o'rin. Oq chiziq maksimal. E₀ +20 eV (Cu⁰ ga nisbatan). Kam uchraydi.",
    color: "text-red-400"
  }
}

export default function XANESPreEdge() {
  const [compareWith, setCompareWith] = useState("cu1")
  const c = comparisons[compareWith]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 XANES pre-edge tahlili — [Cu(H₂O)₆]²⁺</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Cu K-chegara XANES</strong> — 
          [Cu(H₂O)₆]²⁺ (Cu²⁺, d⁹) da pre-edge <strong>kuchsiz-o'rtacha</strong> (~0.04−0.06).
          d⁹ konfiguratsiya — 3d da 1 ta bo'sh o'rin mavjud. Oktaedrik simmetriya (O_h) 
          dipol taqiqini keltirib chiqaradi, lekin <strong>Yahn-Teller buzilishi</strong> 
          simmetriyani pasaytiradi — pre-edge biroz kuchayadi.
        </p>

        <div className="grid grid-cols-3 gap-3 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">[Cu(H₂O)₆]²⁺</p>
            <p className="text-cyan-400 font-bold">Cu²⁺ (d⁹)</p>
            <p className="text-emerald-400 font-mono mt-1">{xanesParametrlar.preEdge.energy}</p>
            <p className="text-yellow-400">{xanesParametrlar.preEdge.intensity}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">3d holati</p>
            <div className="text-3xl mt-2">🕳️</div>
            <p className="text-purple-300 mt-1">1 ta bo'sh o'rin</p>
            <p className="text-purple-400 text-xs mt-1">Yahn-Teller buzilishi</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Simmetriya</p>
            <div className="text-3xl mt-2">📐</div>
            <p className="text-purple-300 mt-1">Cho'zilgan O_h</p>
            <p className="text-purple-400 text-xs mt-1">Dipol taqiqi zaiflashgan</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-xs mb-4">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Cu²⁺ pre-edge Cu⁺ dan kuchliroq?</p>
          <p className="text-purple-200">
            Cu²⁺ (d⁹) da <strong>1 ta bo'sh 3d o'rin</strong> mavjud — 1s→3d o'tish mumkin.
            Cu⁺ (d¹⁰) da <strong>barcha 3d orbitallar to'lgan</strong> — Pauli taqiqlaydi.
            Yahn-Teller buzilishi tufayli Cu²⁺ da simmetriya O_h dan pastroq — 
            dipol taqiqi zaiflashgan, pre-edge qo'shimcha kuchayadi.
          </p>
        </div>

        <div>
          <p className="text-purple-400 text-xs mb-2">Boshqa Cu komplekslari bilan solishtiring:</p>
          <div className="flex gap-2 mb-3 flex-wrap">
            <button onClick={() => setCompareWith("cu1")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "cu1" ? "bg-yellow-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs Cu⁺ [Cu(NH₃)₂]⁺
            </button>
            <button onClick={() => setCompareWith("cuo")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "cuo" ? "bg-orange-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs Cu⁰ (metall)
            </button>
            <button onClick={() => setCompareWith("cu3")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "cu3" ? "bg-red-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs Cu³⁺ K₃[CuF₆]
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