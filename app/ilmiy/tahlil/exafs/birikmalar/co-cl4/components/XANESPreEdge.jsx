"use client"

import { useState } from "react"
import { xanesParametrlar } from "../data/co-cl4-data"

const comparisons = {
  co2okta: {
    name: "[Co(H₂O)₆]²⁺ — Co²⁺ (HS, oktaedrik)",
    preEdge: "7712.5 eV",
    intensity: "~0.03−0.05 (kuchsiz)",
    e0: "7725.5 eV",
    note: "Oktaedrik simmetriya (O_h) — dipol taqiqi kuchli. Pre-edge [CoCl₄]²⁻ ga nisbatan 5-8 marta kuchsizroq. Bu — geometriyani aniqlashning eng ishonchli XANES usuli.",
    color: "text-pink-400"
  },
  co3: {
    name: "[Co(NH₃)₆]Cl₃ — Co³⁺ (LS, oktaedrik)",
    preEdge: "7713.5 eV",
    intensity: "~0.02−0.03 (juda kuchsiz)",
    e0: "7727.5 eV",
    note: "Co³⁺ (LS, t₂g⁶) — barcha t₂g orbitallar to'lgan. Oktaedrik simmetriya. Pre-edge deyarli ko'rinmaydi. Eng kuchsiz pre-edge.",
    color: "text-yellow-400"
  },
  fecl4: {
    name: "[FeCl₄]⁻ — Fe³⁺ (HS, tetraedrik)",
    preEdge: "7113.0 eV",
    intensity: "~0.25 (juda kuchli)",
    e0: "7128 eV",
    note: "Fe³⁺ (T_d) — [CoCl₄]²⁻ bilan bir xil geometriya. Pre-edge intensivligi o'xshash (~0.25). Tetraedrik komplekslarda pre-edge har doim kuchli.",
    color: "text-red-400"
  }
}

export default function XANESPreEdge() {
  const [compareWith, setCompareWith] = useState("co2okta")
  const c = comparisons[compareWith]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 XANES pre-edge tahlili — [CoCl₄]²⁻</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Pre-edge pik</strong> — [CoCl₄]²⁻ (Co²⁺, HS, d⁷, T_d) da 
          <strong className="text-yellow-400"> juda kuchli</strong> (~0.15−0.25).
          Tetraedrik simmetriya (T_d) — <strong>markaziy simmetriya yo'q</strong>, 
          dipol taqiqi butunlay yo'qolgan. p-d aralashuvi tufayli 1s→3d o'tish 
          <strong> to'liq ruxsat etilgan</strong>. Bu — tetraedrik geometriyaning eng ishonchli XANES dalili.
        </p>

        <div className="grid grid-cols-3 gap-3 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">[CoCl₄]²⁻</p>
            <p className="text-blue-400 font-bold">Co²⁺ (d⁷, T_d)</p>
            <p className="text-emerald-400 font-mono mt-1">{xanesParametrlar.preEdge.energy}</p>
            <p className="text-yellow-400">{xanesParametrlar.preEdge.intensity}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Simmetriya</p>
            <div className="text-3xl mt-2">🔺</div>
            <p className="text-purple-300 mt-1">Tetraedrik (T_d)</p>
            <p className="text-purple-400 text-xs mt-1">Dipol taqiqi YO'Q</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">p-d aralashuvi</p>
            <div className="text-3xl mt-2">🔄</div>
            <p className="text-purple-300 mt-1">Kuchli aralashuv</p>
            <p className="text-purple-400 text-xs mt-1">1s→3d ruxsat etilgan</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-xs mb-4">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun tetraedrik pre-edge oktaedrikdan kuchli?</p>
          <p className="text-purple-200">
            <strong>Oktaedrik (O_h):</strong> markaziy simmetriya mavjud — d-orbitallar juft (gerade).
            d→d o'tish Laporte taqiqlangan. Pre-edge faqat kvadrupol yoki vibronik ruxsat orqali.
            <strong>Tetraedrik (T_d):</strong> markaziy simmetriya yo'q — d va p orbitallar aralashadi.
            p→d o'tish ruxsat etilgan. <strong>Natija:</strong> T_d da pre-edge O_h ga nisbatan 
            <strong> 5-10 marta kuchliroq</strong>. Bu — EXAFS/XANES yordamida geometriyani aniqlashning klassik usuli.
          </p>
        </div>

        <div>
          <p className="text-purple-400 text-xs mb-2">Boshqa Co komplekslari bilan solishtiring:</p>
          <div className="flex gap-2 mb-3 flex-wrap">
            <button onClick={() => setCompareWith("co2okta")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "co2okta" ? "bg-pink-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs [Co(H₂O)₆]²⁺ (O_h)
            </button>
            <button onClick={() => setCompareWith("co3")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "co3" ? "bg-yellow-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs [Co(NH₃)₆]³⁺ (O_h)
            </button>
            <button onClick={() => setCompareWith("fecl4")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${compareWith === "fecl4" ? "bg-red-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
              vs [FeCl₄]⁻ (T_d)
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