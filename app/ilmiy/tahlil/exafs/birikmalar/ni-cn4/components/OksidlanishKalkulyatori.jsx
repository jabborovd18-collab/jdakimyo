"use client"

import { useState } from "react"

const methods = {
  chegara: {
    title: "Ni K-chegara siljishi (E₀)",
    icon: "📏",
    desc: "Ni K-chegara energiyasi oksidlanish darajasiga bog'liq. Ni²⁺ da E₀ Ni⁰ ga nisbatan +7 eV siljigan.",
    data: [
      { ion: "Ni⁰", e0: "8333 eV", note: "Metall nikel, d¹⁰" },
      { ion: "[Ni(CN)₄]²⁻ — Ni²⁺", e0: "8340 eV", note: "Kvadrat tekislik, d⁸" },
      { ion: "[Ni(H₂O)₆]²⁺ — Ni²⁺", e0: "8341 eV", note: "Oktaedrik, d⁸" },
      { ion: "Ni³⁺ (kam uchraydi)", e0: "8343 eV", note: "Kuchli oksidlovchilarda" },
    ],
    key: "Ni²⁺ da E₀ ≈ 8340−8341 eV. Ni⁰ dan +7−8 eV siljish. Geometriya E₀ ga kam ta'sir qiladi.",
    color: "text-blue-400",
    bg: "bg-blue-600/10 border-blue-500/30"
  },
  preedge: {
    title: "Pre-edge — geometriya indikatori",
    icon: "🎯",
    desc: "Pre-edge intensivligi simmetriyaga kuchli bog'liq. Kvadrat tekislik — oktaedrikka nisbatan kuchliroq pre-edge.",
    data: [
      { ion: "[Ni(H₂O)₆]²⁺ — O_h", intensity: "~0.03−0.05", note: "Markaziy simmetriya — eng kuchsiz" },
      { ion: "[Ni(CN)₄]²⁻ — D₄h", intensity: "~0.06−0.10", note: "Simmetriya pasaygan — 2-3× kuchliroq" },
    ],
    key: "Pre-edge: O_h {'<'} D₄h — simmetriya pasaygan sari intensivlik ortadi.",
    color: "text-emerald-400",
    bg: "bg-emerald-600/10 border-emerald-500/30"
  },
  oqchiziq: {
    title: "Oq chiziq — ligand ta'siri",
    icon: "⚡",
    desc: "CN⁻ kuchli π-akseptor — Ni 4p orbitallari pastlashadi, oq chiziq kuchayadi.",
    data: [
      { ion: "[Ni(H₂O)₆]²⁺", shape: "O'rtacha", note: "H₂O — kuchsiz maydon" },
      { ion: "[Ni(CN)₄]²⁻", shape: "Kuchli", note: "CN⁻ — kuchli maydon, shakedown" },
    ],
    key: "CN⁻ komplekslarida oq chiziq H₂O komplekslariga nisbatan kuchliroq.",
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
          <strong className="text-yellow-400">Ni K-chegara XANES</strong> — 
          [Ni(CN)₄]²⁻ ning elektron tuzilishini tushunish uchun muhim.
          Kvadrat tekislik geometriyasi pre-edge da yaqqol ko'rinadi.
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
                  {method === "oqchiziq" && <th className="text-left py-2 px-3 text-yellow-400">Shakli</th>}
                  <th className="text-left py-2 px-3 text-yellow-400">Izoh</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {m.data.map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30">
                    <td className="py-2 px-3 font-bold">{row.ion}</td>
                    {method === "chegara" && <td className="py-2 px-3 text-blue-400 font-mono">{row.e0}</td>}
                    {method === "preedge" && <td className="py-2 px-3">{row.intensity}</td>}
                    {method === "oqchiziq" && <td className="py-2 px-3">{row.shape}</td>}
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