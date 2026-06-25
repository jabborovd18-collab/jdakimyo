"use client"

import { useState } from "react"

const methods = {
  chegara: {
    title: "Yutilish chegarasi siljishi (E₀)",
    icon: "📏",
    desc: "Co K-chegara energiyasi oksidlanish darajasiga bog'liq. Co³⁺ da yadro zaryadi yuqori — 1s elektron kuchliroq bog'langan.",
    data: [
      { ion: "Co⁰", e0: "7709 eV", note: "Metall kobalt" },
      { ion: "Co²⁺", e0: "7725−7726 eV", note: "[Co(H₂O)₆]²⁺, [CoCl₄]²⁻" },
      { ion: "Co³⁺", e0: "7727−7728 eV", note: "[Co(NH₃)₆]³⁺, [Co(CN)₆]³⁻" },
    ],
    key: "Har bir oksidlanish darajasi uchun ~1.5-2.0 eV siljish. Co³⁺ da +1.5-2.0 eV (Co²⁺ ga nisbatan).",
    color: "text-blue-400",
    bg: "bg-blue-600/10 border-blue-500/30"
  },
  preedge: {
    title: "Pre-edge energiyasi va intensivligi",
    icon: "🎯",
    desc: "Co³⁺ (LS, t₂g⁶) da pre-edge deyarli yo'q. Co²⁺ (HS yoki LS) da bo'sh d-orbitallar mavjud — pre-edge kuchliroq.",
    data: [
      { ion: "Co³⁺ (LS, t₂g⁶)", energy: "7713.5 eV", intensity: "~0.03−0.05", note: "Bo'sh o'rin yo'q — eng kuchsiz" },
      { ion: "Co²⁺ (LS, t₂g⁶ e_g¹)", energy: "7712.2 eV", intensity: "~0.05−0.08", note: "e_g da 1 ta bo'sh o'rin" },
      { ion: "Co²⁺ (HS, t₂g⁵ e_g²)", energy: "7711.8 eV", intensity: "~0.08−0.15", note: "e_g da 2 ta bo'sh o'rin" },
    ],
    key: "Pre-edge intensivligi Co³⁺ {'<'} Co²⁺ (LS) {'<'} Co²⁺ (HS). Bo'sh d-orbitallar soniga proporsional.",
    color: "text-emerald-400",
    bg: "bg-emerald-600/10 border-emerald-500/30"
  },
  oqchiziq: {
    title: "Oq chiziq (white line) shakli",
    icon: "⚡",
    desc: "Oq chiziq — 1s → 4p o'tish. Co³⁺ da 4p orbitallar pastroq energiyada — o'tish ehtimoli yuqori.",
    data: [
      { ion: "Co²⁺", shape: "Kuchsiz, keng", note: "4p yuqoriroq — o'tish zaif" },
      { ion: "Co³⁺", shape: "O'rtacha-kuchli", note: "4p pastroq — o'tish kuchliroq" },
    ],
    key: "Oq chiziq — Co³⁺/Co²⁺ farqlashning tezkor usuli.",
    color: "text-purple-400",
    bg: "bg-purple-600/10 border-purple-500/30"
  }
}

export default function OksidlanishKalkulyatori() {
  const [method, setMethod] = useState("chegara")
  const m = methods[method]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Oksidlanish darajasini aniqlash — Co³⁺ vs Co²⁺</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">XANES</strong> — Co oksidlanish darajasini aniqlashning 
          eng ishonchli usullaridan biri. Co³⁺ va Co²⁺ orasidagi farq <strong>1.5-2.0 eV</strong> ni tashkil qiladi.
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
                  <th className="text-left py-2 px-3 text-yellow-400">Ion / Holat</th>
                  {method === "chegara" && <th className="text-left py-2 px-3 text-yellow-400">E₀</th>}
                  {method === "preedge" && <><th className="text-left py-2 px-3 text-yellow-400">Energiya</th><th className="text-left py-2 px-3 text-yellow-400">Intensivlik</th></>}
                  {method === "oqchiziq" && <th className="text-left py-2 px-3 text-yellow-400">Shakli</th>}
                  <th className="text-left py-2 px-3 text-yellow-400">Izoh</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {m.data.map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30">
                    <td className="py-2 px-3 font-bold">{row.ion}</td>
                    {method === "chegara" && <td className="py-2 px-3 text-blue-400 font-mono">{row.e0}</td>}
                    {method === "preedge" && <><td className="py-2 px-3 text-emerald-400 font-mono">{row.energy}</td><td className="py-2 px-3">{row.intensity}</td></>}
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