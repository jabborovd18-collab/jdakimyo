"use client"

import { useState } from "react"
import { xanesParametrlar } from "../data/sisplatin-data"

const comparisons = {
  pto: {
    name: "Pt⁰ — metall platina",
    e0: "11564 eV",
    whiteLine: "Minimal (d¹⁰ — to'liq to'lgan)",
    note: "Pt⁰ (d¹⁰) da 5d orbitallar to'liq to'lgan — oq chiziq deyarli yo'q. L₃-chegara yutilishi minimal. Oksidlanish darajasi 0.",
    color: "text-gray-400"
  },
  pt4: {
    name: "K₂[PtCl₆] — Pt⁴⁺ (d⁶)",
    e0: "11570 eV",
    whiteLine: "Juda kuchli (d⁶ — ko'p bo'sh 5d o'rin)",
    note: "Pt⁴⁺ (d⁶, oktaedrik) da 5d orbitallar ko'p bo'sh — oq chiziq maksimal. E₀ Pt²⁺ ga nisbatan +3 eV siljigan.",
    color: "text-red-400"
  },
  karboplatin: {
    name: "Karboplatin — Pt²⁺ (d⁸)",
    e0: "11567 eV",
    whiteLine: "Kuchli (sisplatin bilan bir xil)",
    note: "Pt²⁺ (d⁸) — sisplatin bilan bir xil oksidlanish darajasi. XANES spektri deyarli bir xil. Farqi faqat EXAFS da (Pt−O vs Pt−Cl).",
    color: "text-blue-400"
  }
}

export default function XANESPreEdge() {
  const [compareWith, setCompareWith] = useState("pto")
  const c = comparisons[compareWith]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 XANES tahlili — Pt L₃-chegara</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Pt L₃-chegara (2p₃/₂ → 5d)</strong> — 
          sisplatin uchun eng informativ XANES sohasi. L₃-chegarada pre-edge kuzatilmaydi 
          (dipol ruxsat etilgan, Δl=1). <strong className="text-yellow-400">Oq chiziq intensivligi</strong> 
          bevosita 5d bo'sh orbitallar soniga bog'liq. Pt²⁺ (d⁸) da oq chiziq kuchli,
          Pt⁰ (d¹⁰) da minimal.
        </p>

        <div className="grid grid-cols-3 gap-3 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Sisplatin</p>
            <p className="text-yellow-400 font-bold">Pt²⁺ (d⁸)</p>
            <p className="text-emerald-400 font-mono mt-1">{xanesParametrlar.e0.value}</p>
            <p className="text-yellow-400">{xanesParametrlar.whiteLine.intensity}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">5d orbitallar</p>
            <div className="text-3xl mt-2">🎯</div>
            <p className="text-purple-300 mt-1">d⁸ — 2 ta bo'sh o'rin</p>
            <p className="text-purple-400 text-xs mt-1">2p→5d o'tish uchun qulay</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">L₃-chegara</p>
            <div className="text-3xl mt-2">⚡</div>
            <p className="text-purple-300 mt-1">Dipol ruxsat etilgan</p>
            <p className="text-purple-400 text-xs mt-1">Δl=1 (2p→5d)</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-xs mb-4">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Pt L₃-chegara muhim?</p>
          <p className="text-purple-200">
            Pt L₃-chegara oq chizig'i <strong>5d bo'sh orbitallar soniga proporsional</strong>.
            Pt²⁺ (d⁸): 2 ta bo'sh o'rin → oq chiziq kuchli.
            Pt⁰ (d¹⁰): bo'sh o'rin yo'q → oq chiziq minimal.
            Pt⁴⁺ (d⁶): 4 ta bo'sh o'rin → oq chiziq juda kuchli.
            Bu — <strong>oksidlanish darajasining bevosita indikatori</strong>.
          </p>
        </div>

        <div>
          <p className="text-purple-400 text-xs mb-2">Boshqa Pt komplekslari bilan solishtiring:</p>
          <div className="flex gap-2 mb-3 flex-wrap">
            <button onClick={() => setCompareWith("pto")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "pto" ? "bg-gray-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs Pt⁰ (metall)
            </button>
            <button onClick={() => setCompareWith("pt4")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "pt4" ? "bg-red-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs Pt⁴⁺ (K₂[PtCl₆])
            </button>
            <button onClick={() => setCompareWith("karboplatin")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "karboplatin" ? "bg-blue-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs Karboplatin
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