"use client"

import { useState } from "react"
import { xanesParametrlar } from "../data/cr-h2o6-data"

const comparisons = {
  cr0: {
    name: "Cr⁰ — metall xrom",
    e0: "5989 eV",
    whiteLine: "Minimal (metall)",
    note: "Cr⁰ — metall holat. E₀ eng past. Oq chiziq zaif — metall bog'lanish tufayli.",
    color: "text-gray-300"
  },
  cr6: {
    name: "CrO₄²⁻ — Cr⁶⁺ (d⁰, tetraedrik)",
    preEdge: "5993 eV",
    intensity: "~0.25 (juda kuchli)",
    e0: "6010 eV",
    note: "Cr⁶⁺ (d⁰) — barcha 3d orbitallar bo'sh. Tetraedrik — dipol taqiqi yo'q. Pre-edge juda kuchli. E₀ +21 eV (Cr⁰ ga nisbatan).",
    color: "text-yellow-400"
  },
  cr2: {
    name: "[Cr(H₂O)₆]²⁺ — Cr²⁺ (d⁴, HS)",
    preEdge: "5992 eV",
    intensity: "~0.05−0.08",
    e0: "6003 eV",
    note: "Cr²⁺ (d⁴, HS) — Yahn-Teller faol. Pre-edge Cr³⁺ ga nisbatan kuchliroq (simmetriya pasaygan). E₀ +14 eV.",
    color: "text-blue-400"
  }
}

export default function XANESPreEdge() {
  const [compareWith, setCompareWith] = useState("cr6")
  const c = comparisons[compareWith]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 XANES pre-edge tahlili — [Cr(H₂O)₆]³⁺</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Pre-edge pik</strong> — [Cr(H₂O)₆]³⁺ (Cr³⁺, d³, O_h) da 
          <strong className="text-yellow-400"> kuchsiz</strong> (~0.03−0.05).
          t₂g yarim to'lgan (3 ta elektron), e_g bo'sh. Oktaedrik simmetriya — 
          <strong> dipol taqiqi kuchli</strong>. Cr⁶⁺ (T_d) bilan solishtirganda 
          pre-edge 5-8 marta kuchsizroq — bu geometriyani aniqlashning klassik usuli.
        </p>

        <div className="grid grid-cols-3 gap-3 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">[Cr(H₂O)₆]³⁺</p>
            <p className="text-emerald-400 font-bold">Cr³⁺ (d³, O_h)</p>
            <p className="text-emerald-400 font-mono mt-1">{xanesParametrlar.preEdge.energy}</p>
            <p className="text-yellow-400">{xanesParametrlar.preEdge.intensity}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">t₂g³ konfiguratsiya</p>
            <div className="text-3xl mt-2">🟢</div>
            <p className="text-purple-300 mt-1">Yarim to'lgan</p>
            <p className="text-purple-400 text-xs mt-1">Barqaror, inert</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Simmetriya</p>
            <div className="text-3xl mt-2">🔷</div>
            <p className="text-purple-300 mt-1">Oktaedrik (O_h)</p>
            <p className="text-purple-400 text-xs mt-1">Dipol taqiqi kuchli</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-xs mb-4">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Cr³⁺ pre-edge kuchsiz?</p>
          <p className="text-purple-200">
            Cr³⁺ (d³) — <strong>t₂g yarim to'lgan</strong> (3 ta elektron, har biri alohida orbitalda).
            e_g orbitallar <strong>butunlay bo'sh</strong> — 1s→e_g o'tish mumkin,
            lekin <strong>oktaedrik simmetriya</strong> (O_h) da dipol taqiqi kuchli.
            Cr⁶⁺ (d⁰, T_d) da esa dipol taqiqi yo'q — pre-edge 5-8 marta kuchliroq.
            Bu — <strong>geometriyani XANES orqali aniqlash</strong> ning klassik namunasi.
          </p>
        </div>

        <div>
          <p className="text-purple-400 text-xs mb-2">Boshqa Cr komplekslari bilan solishtiring:</p>
          <div className="flex gap-2 mb-3 flex-wrap">
            <button onClick={() => setCompareWith("cr6")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "cr6" ? "bg-yellow-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>vs Cr⁶⁺ CrO₄²⁻</button>
            <button onClick={() => setCompareWith("cr2")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "cr2" ? "bg-blue-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>vs Cr²⁺</button>
            <button onClick={() => setCompareWith("cr0")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "cr0" ? "bg-gray-400/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>vs Cr⁰</button>
          </div>

          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700/30">
            <h4 className={`font-bold text-sm mb-2 ${c.color}`}>{c.name}</h4>
            <div className="grid grid-cols-3 gap-3 text-xs text-center mb-3">
              <div className="bg-purple-800/30 rounded p-2"><p className="text-purple-400">Pre-edge</p><p className="text-emerald-400 font-mono">{c.preEdge || "—"}</p></div>
              <div className="bg-purple-800/30 rounded p-2"><p className="text-purple-400">Intensivlik</p><p className={c.color}>{c.intensity || "—"}</p></div>
              <div className="bg-purple-800/30 rounded p-2"><p className="text-purple-400">E₀</p><p className="text-blue-400 font-mono">{c.e0}</p></div>
            </div>
            <p className="text-purple-200 text-xs">{c.note}</p>
          </div>
        </div>
      </div>
    </div>
  )
}