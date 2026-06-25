"use client"

import { useState } from "react"

const methods = {
  chegara: {
    title: "Fe K-chegara siljishi (E₀)",
    icon: "📏",
    desc: "Fe K-chegara energiyasi oksidlanish darajasiga va ligand muhitiga bog'liq. Ferrosen — Fe²⁺, Cp⁻ donor ligandlar.",
    data: [
      { ion: "Fe⁰", e0: "7110 eV", note: "Metall temir" },
      { ion: "Ferrosen — Fe²⁺ (Cp⁻)", e0: "7124.5 eV", note: "Cp⁻ kuchli donor — E₀ pastroq" },
      { ion: "K₄[Fe(CN)₆] — Fe²⁺ (CN⁻)", e0: "7126.0 eV", note: "CN⁻ π-akseptor — E₀ yuqoriroq" },
      { ion: "K₃[Fe(CN)₆] — Fe³⁺", e0: "7127.5 eV", note: "Fe³⁺ — eng yuqori E₀" },
    ],
    key: "Ferrosenda E₀ K₄[Fe(CN)₆] dan 1.5 eV past — Cp⁻ kuchli donor ligand.",
    color: "text-blue-400",
    bg: "bg-blue-600/10 border-blue-500/30"
  },
  preedge: {
    title: "Pre-edge — geometriya indikatori",
    icon: "🎯",
    desc: "Pre-edge intensivligi simmetriyaga bog'liq. Ferrosen (D₅d) — oktaedrik va tetraedrik orasida.",
    data: [
      { ion: "K₄[Fe(CN)₆] — O_h", intensity: "~0.02−0.05", note: "Markaziy simmetriya — eng kuchsiz" },
      { ion: "Ferrosen — D₅d", intensity: "~0.04−0.06", note: "Simmetriya pasaygan — o'rtacha" },
      { ion: "[FeCl₄]²⁻ — T_d", intensity: "~0.25", note: "Simmetriya yo'q — eng kuchli" },
    ],
    key: "Pre-edge: O_h {'<'} D₅d {'<'} T_d — simmetriya pasaygan sari intensivlik ortadi.",
    color: "text-emerald-400",
    bg: "bg-emerald-600/10 border-emerald-500/30"
  },
  oqchiziq: {
    title: "Oq chiziq — ligand ta'siri",
    icon: "⚡",
    desc: "Oq chiziq shakli ligand donor/akseptorligiga bog'liq. Cp⁻ — kuchli donor, CN⁻ — π-akseptor.",
    data: [
      { ion: "Ferrosen (Cp⁻)", shape: "O'rtacha, keng", note: "Cp⁻ donor — Fe 4p yuqoriroq" },
      { ion: "K₄[Fe(CN)₆] (CN⁻)", shape: "Kuchli, o'tkir", note: "CN⁻ π-akseptor — Fe 4p pastroq" },
    ],
    key: "Oq chiziq orqali ligand donor/akseptorligini aniqlash mumkin.",
    color: "text-purple-400",
    bg: "bg-purple-600/10 border-purple-500/30"
  }
}

export default function OksidlanishKalkulyatori() {
  const [method, setMethod] = useState("chegara")
  const m = methods[method]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Oksidlanish darajasi va ligand ta'siri</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Fe K-chegara XANES</strong> — 
          ferrosenning elektron tuzilishini tushunish uchun muhim.
          Cp⁻ ligandlarining <strong>kuchli donorlik xususiyati</strong> E₀ va oq chiziqda yaqqol ko'rinadi.
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