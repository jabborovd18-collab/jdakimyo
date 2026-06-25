"use client"

import { useState } from "react"
import { xanesParametrlar } from "../data/zn-oh4-data"

const comparisons = {
  zn0: {
    name: "Zn⁰ — metall rux",
    e0: "9659 eV",
    whiteLine: "Minimal (d¹⁰s² — metall)",
    note: "Zn⁰ — metall holat. E₀ eng past. Oq chiziq zaif — metall bog'lanish tufayli.",
    color: "text-gray-300"
  },
  zno: {
    name: "ZnO — rux oksidi (Zn²⁺, oktaedrik)",
    e0: "9666 eV",
    whiteLine: "Kuchli (Zn²⁺, O_h)",
    note: "ZnO da Zn²⁺ oktaedrik muhitda. Oq chiziq [Zn(OH)₄]²⁻ ga o'xshash kuchli. E₀ +1 eV (T_d ga nisbatan).",
    color: "text-yellow-400"
  },
  cu1: {
    name: "[Cu(NH₃)₂]⁺ — Cu⁺ (d¹⁰, chiziqli)",
    e0: "8982 eV",
    whiteLine: "Minimal (d¹⁰)",
    note: "Cu⁺ (d¹⁰) — Zn²⁺ bilan izoelektronik emas (Cu⁺: 3d¹⁰, Zn²⁺: 3d¹⁰). Ikkalasi ham d¹⁰, lekin Zn²⁺ da oq chiziq kuchliroq — yadro zaryadi yuqori.",
    color: "text-orange-400"
  }
}

export default function XANESPreEdge() {
  const [compareWith, setCompareWith] = useState("zn0")
  const c = comparisons[compareWith]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 XANES tahlili — Zn K-chegara</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Zn K-chegara (1s → 4p)</strong> — 
          [Zn(OH)₄]²⁻ (Zn²⁺, d¹⁰, T_d) da <strong>oq chiziq kuchli</strong>.
          d¹⁰ konfiguratsiya — 3d orbitallar to'liq to'lgan, lekin 
          <strong> 4p orbitallar bo'sh</strong> — 1s→4p o'tish yuqori ehtimollikka ega.
          Pre-edge K-chegarada kuzatilmaydi.
        </p>

        <div className="grid grid-cols-3 gap-3 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">[Zn(OH)₄]²⁻</p>
            <p className="text-blue-400 font-bold">Zn²⁺ (d¹⁰, T_d)</p>
            <p className="text-emerald-400 font-mono mt-1">{xanesParametrlar.e0.value}</p>
            <p className="text-yellow-400">{xanesParametrlar.whiteLine.intensity}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">4p orbitallar</p>
            <div className="text-3xl mt-2">🕳️</div>
            <p className="text-purple-300 mt-1">To'liq bo'sh</p>
            <p className="text-purple-400 text-xs mt-1">1s→4p kuchli</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">d¹⁰ konfiguratsiya</p>
            <div className="text-3xl mt-2">✅</div>
            <p className="text-purple-300 mt-1">3d to'liq to'lgan</p>
            <p className="text-purple-400 text-xs mt-1">CFSE = 0</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-xs mb-4">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Zn²⁺ oq chiziq kuchli?</p>
          <p className="text-purple-200">
            Zn²⁺ (d¹⁰) da <strong>3d orbitallar to'liq to'lgan</strong> — 
            lekin <strong>4p orbitallar butunlay bo'sh</strong>. 1s→4p o'tish 
            <strong> dipol ruxsat etilgan</strong> (Δl=1) va yuqori ehtimollikka ega.
            Zn²⁺ yadro zaryadi Cu⁺ dan yuqori — 4p orbitallar pastroq energiyada,
            o'tish ehtimoli yuqoriroq.
          </p>
        </div>

        <div>
          <p className="text-purple-400 text-xs mb-2">Boshqa holatlar bilan solishtiring:</p>
          <div className="flex gap-2 mb-3 flex-wrap">
            <button onClick={() => setCompareWith("zn0")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "zn0" ? "bg-gray-400/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>vs Zn⁰</button>
            <button onClick={() => setCompareWith("zno")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "zno" ? "bg-yellow-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>vs ZnO</button>
            <button onClick={() => setCompareWith("cu1")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "cu1" ? "bg-orange-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>vs Cu⁺</button>
          </div>

          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700/30">
            <h4 className={`font-bold text-sm mb-2 ${c.color}`}>{c.name}</h4>
            <div className="grid grid-cols-2 gap-3 text-xs text-center mb-3">
              <div className="bg-purple-800/30 rounded p-2"><p className="text-purple-400">E₀</p><p className="text-blue-400 font-mono">{c.e0}</p></div>
              <div className="bg-purple-800/30 rounded p-2"><p className="text-purple-400">Oq chiziq</p><p className={c.color}>{c.whiteLine}</p></div>
            </div>
            <p className="text-purple-200 text-xs">{c.note}</p>
          </div>
        </div>
      </div>
    </div>
  )
}