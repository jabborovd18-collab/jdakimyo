"use client"

import { useState } from "react"

const methods = {
  chegara: {
    title: "Cu K-chegara siljishi (E₀)",
    icon: "📏",
    desc: "Cu K-chegara energiyasi oksidlanish darajasiga kuchli bog'liq. Cu²⁺ da E₀ Cu⁰ ga nisbatan +16 eV siljigan.",
    data: [
      { ion: "Cu⁰ (metall)", e0: "8979 eV", note: "d¹⁰, minimal oq chiziq" },
      { ion: "Cu⁺ ([Cu(NH₃)₂]⁺)", e0: "8982 eV", note: "d¹⁰, +3 eV" },
      { ion: "Cu²⁺ ([Cu(H₂O)₆]²⁺)", e0: "8995 eV", note: "d⁹, Yahn-Teller, +16 eV" },
      { ion: "Cu³⁺ (K₃[CuF₆])", e0: "8999 eV", note: "d⁸, +20 eV, kam uchraydi" },
    ],
    key: "Har bir oksidlanish darajasi uchun sezilarli siljish. Cu²⁺ da +16 eV (Cu⁰ ga nisbatan).",
    color: "text-blue-400",
    bg: "bg-blue-600/10 border-blue-500/30"
  },
  preedge: {
    title: "Pre-edge — Yahn-Teller indikatori",
    icon: "🎯",
    desc: "Pre-edge intensivligi Yahn-Teller buzilishi tufayli kuchayadi. Oktaedrik simmetriya buzilgan.",
    data: [
      { ion: "Cu⁺ (O_h — yo'q, chiziqli)", intensity: "~0.01−0.02", note: "d¹⁰ to'lgan — eng kuchsiz" },
      { ion: "Cu²⁺ (cho'zilgan O_h)", intensity: "~0.04−0.06", note: "Yahn-Teller — simmetriya pasaygan" },
      { ion: "Cu²⁺ (tetraedrik)", intensity: "~0.10−0.15", note: "T_d — dipol taqiqi yo'q" },
    ],
    key: "Pre-edge: Cu⁺ {'<'} Cu²⁺(O_h) {'<'} Cu²⁺(T_d). Yahn-Teller oraliq holat.",
    color: "text-emerald-400",
    bg: "bg-emerald-600/10 border-emerald-500/30"
  },
  oqchiziq: {
    title: "Oq chiziq shakli",
    icon: "⚡",
    desc: "Cu²⁺ da oq chiziq kuchli — 4p orbitallar pastroq energiyada. Shakli Yahn-Teller buzilishini aks ettiradi.",
    data: [
      { ion: "Cu⁺", shape: "Minimal", note: "3d to'lgan — 4p yuqori" },
      { ion: "Cu²⁺", shape: "Kuchli, assimetrik", note: "Yahn-Teller — 4p ajralgan" },
    ],
    key: "Oq chiziq assimetriyasi — Yahn-Teller buzilishining qo'shimcha dalili.",
    color: "text-purple-400",
    bg: "bg-purple-600/10 border-purple-500/30"
  }
}

export default function OksidlanishKalkulyatori() {
  const [method, setMethod] = useState("chegara")
  const m = methods[method]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Oksidlanish darajasi va Yahn-Teller</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Cu K-chegara XANES</strong> — 
          Cu²⁺/Cu⁺ farqlash uchun eng ishonchli usul. Yahn-Teller effekti pre-edge va oq chiziqda ko'rinadi.
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