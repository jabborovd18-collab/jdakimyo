"use client"

import { useState } from "react"

const methods = {
  chegara: {
    title: "Co K-chegara siljishi (E₀)",
    icon: "📏",
    desc: "Co K-chegara energiyasi oksidlanish darajasiga bog'liq. Co²⁺ da E₀ Co⁰ ga nisbatan +15.5 eV siljigan.",
    data: [
      { ion: "Co⁰ (metall)", e0: "7709 eV", note: "d⁷s² — metall" },
      { ion: "Co²⁺ ([CoCl₄]²⁻, T_d)", e0: "7724.5 eV", note: "d⁷, HS, tetraedrik" },
      { ion: "Co²⁺ ([Co(H₂O)₆]²⁺, O_h)", e0: "7725.5 eV", note: "d⁷, HS, oktaedrik" },
      { ion: "Co³⁺ ([Co(NH₃)₆]³⁺)", e0: "7727.5 eV", note: "d⁶, LS, +18.5 eV" },
    ],
    key: "Co²⁺ da +15.5−16.5 eV (Co⁰ ga nisbatan). Geometriya E₀ ga kam ta'sir qiladi.",
    color: "text-blue-400",
    bg: "bg-blue-600/10 border-blue-500/30"
  },
  preedge: {
    title: "Pre-edge — geometriya indikatori",
    icon: "🎯",
    desc: "Pre-edge intensivligi simmetriyaga kuchli bog'liq. T_d da kuchli, O_h da kuchsiz.",
    data: [
      { ion: "[CoCl₄]²⁻ (T_d)", intensity: "~0.15−0.25", note: "Dipol taqiqi yo'q — eng kuchli" },
      { ion: "[Co(H₂O)₆]²⁺ (O_h)", intensity: "~0.03−0.05", note: "Dipol taqiqi bor — 5-8× kuchsizroq" },
      { ion: "[Co(NH₃)₆]³⁺ (O_h, LS)", intensity: "~0.02−0.03", note: "t₂g to'lgan — eng kuchsiz" },
    ],
    key: "Pre-edge: O_h (LS) {'<'} O_h (HS) {'<'} T_d. Simmetriya asosiy omil.",
    color: "text-emerald-400",
    bg: "bg-emerald-600/10 border-emerald-500/30"
  },
  rang: {
    title: "Rang — geometriya indikatori",
    icon: "🎨",
    desc: "Co²⁺ komplekslarining rangi geometriyaga bog'liq: tetraedrik — ko'k, oktaedrik — pushti.",
    data: [
      { ion: "[CoCl₄]²⁻ (T_d)", rang: "Ko'k", note: "Δ_t kichik (~3 100 sm⁻¹) — qizil yutilish" },
      { ion: "[Co(H₂O)₆]²⁺ (O_h)", rang: "Pushti", note: "Δ₀ kattaroq (~9 300 sm⁻¹)" },
    ],
    key: "Rang — geometriyani aniqlashning eng oddiy usuli. Ko'k = tetraedrik, pushti = oktaedrik.",
    color: "text-purple-400",
    bg: "bg-purple-600/10 border-purple-500/30"
  }
}

export default function OksidlanishKalkulyatori() {
  const [method, setMethod] = useState("chegara")
  const m = methods[method]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Oksidlanish darajasi va geometriya</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Co K-chegara XANES</strong> — 
          Co²⁺/Co³⁺ farqlash va geometriyani aniqlash uchun ishlatiladi.
          Tetraedrik [CoCl₄]²⁻ pre-edge intensivligi bilan ajralib turadi.
        </p>

        <div className="flex gap-2 flex-wrap mb-4">
          {Object.entries(methods).map(([key, val]) => (
            <button key={key} onClick={() => setMethod(key)} className={`px-3 py-2 rounded-lg text-xs font-semibold ${method === key ? `${val.bg} ${val.color}` : "bg-purple-800/40 text-purple-300"}`}>
              {val.icon} {val.title.split("(")[0].trim()}
            </button>
          ))}
        </div>

        <div className={`rounded-lg p-4 border ${m.bg}`}>
          <h4 className={`font-bold text-sm mb-2 ${m.color}`}>{m.icon} {m.title}</h4>
          <p className="text-purple-200 text-xs mb-4">{m.desc}</p>

          <div className="overflow-x-auto mb-3">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="text-left py-2 px-3 text-yellow-400">Birikma</th>
                  {method === "chegara" && <th className="text-left py-2 px-3 text-yellow-400">E₀</th>}
                  {method === "preedge" && <th className="text-left py-2 px-3 text-yellow-400">Intensivlik</th>}
                  {method === "rang" && <th className="text-left py-2 px-3 text-yellow-400">Rang</th>}
                  <th className="text-left py-2 px-3 text-yellow-400">Izoh</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {m.data.map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30">
                    <td className="py-2 px-3 font-bold">{row.ion}</td>
                    {method === "chegara" && <td className="py-2 px-3 text-blue-400 font-mono">{row.e0}</td>}
                    {method === "preedge" && <td className="py-2 px-3">{row.intensity}</td>}
                    {method === "rang" && <td className="py-2 px-3">{row.rang}</td>}
                    <td className="py-2 px-3 text-purple-400">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
            <p className="text-yellow-400 font-bold mb-1">🔑 Asosiy qoida:</p>
            <p className="text-purple-200">{m.key}</p>
          </div>
        </div>
      </div>
    </div>
  )
}