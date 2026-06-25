"use client"

import { useState } from "react"

const methods = {
  chegara: {
    title: "Yutilish chegarasi siljishi (E₀)",
    icon: "📏",
    desc: "Oksidlanish darajasi oshgan sari yadro zaryadi samaraliroq tortadi — 1s elektron kuchliroq bog'lanadi → E₀ yuqoriga siljiydi.",
    data: [
      { ion: "Fe⁰", e0: "7110 eV", note: "Metall temir" },
      { ion: "Fe²⁺", e0: "7124−7126 eV", note: "[Fe(CN)₆]⁴⁻, [Fe(H₂O)₆]²⁺" },
      { ion: "Fe³⁺", e0: "7127−7129 eV", note: "[Fe(CN)₆]³⁻, [FeCl₄]⁻" },
      { ion: "Fe⁴⁺", e0: "7130+ eV", note: "Kam uchraydi (ferratlar)" },
    ],
    key: "Har bir oksidlanish darajasi uchun ~1-2 eV siljish. K₃[Fe(CN)₆] da +1.5 eV (Fe²⁺ ga nisbatan).",
    color: "text-blue-400",
    bg: "bg-blue-600/10 border-blue-500/30"
  },
  preedge: {
    title: "Pre-edge energiyasi va intensivligi",
    icon: "🎯",
    desc: "Pre-edge energiyasi va intensivligi oksidlanish darajasi va spin holatiga bog'liq. Bo'sh d-orbitallar soni qancha ko'p bo'lsa, pre-edge shuncha kuchli.",
    data: [
      { ion: "Fe²⁺ (LS, t₂g⁶)", energy: "7111.8 eV", intensity: "~0.02−0.05", note: "Bo'sh o'rin yo'q — juda kuchsiz" },
      { ion: "Fe³⁺ (LS, t₂g⁵)", energy: "7113.0 eV", intensity: "~0.18−0.25", note: "1 ta bo'sh o'rin — kuchli" },
      { ion: "Fe²⁺ (HS, t₂g⁴e_g²)", energy: "7112.5 eV", intensity: "~0.25", note: "Tetraedrik — p-d aralashuvi" },
    ],
    key: "Pre-edge — oksidlanish darajasini va geometriyani bir vaqtda aniqlash imkonini beradi.",
    color: "text-emerald-400",
    bg: "bg-emerald-600/10 border-emerald-500/30"
  },
  oqchiziq: {
    title: "Oq chiziq (white line) shakli",
    icon: "⚡",
    desc: "Oq chiziq — 1s → 4p o'tish + liganddan metallga zaryad ko'chishi (shakedown). Yuqori oksidlanish darajasida 4p orbitallar pastroq — o'tish ehtimoli yuqori.",
    data: [
      { ion: "Fe²⁺", shape: "Kuchsiz, keng", note: "4p orbitallar yuqoriroq — o'tish zaif" },
      { ion: "Fe³⁺", shape: "Kuchli, o'tkir", note: "4p orbitallar pastroq — o'tish kuchli" },
      { ion: "Fe⁴⁺", shape: "Juda kuchli", note: "4p orbitallar eng past — maksimal o'tish" },
    ],
    key: "Oq chiziq intensivligi — oksidlanish darajasining tezkor indikatori.",
    color: "text-purple-400",
    bg: "bg-purple-600/10 border-purple-500/30"
  }
}

export default function OksidlanishKalkulyatori() {
  const [method, setMethod] = useState("chegara")

  const m = methods[method]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Oksidlanish darajasini aniqlash usullari</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">XANES</strong> — oksidlanish darajasini aniqlashning 
          eng ishonchli usullaridan biri. Uch xil mustaqil metod orqali tekshirish mumkin:
        </p>

        {/* Tab tugmalari */}
        <div className="flex gap-2 flex-wrap mb-4">
          {Object.entries(methods).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setMethod(key)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                method === key ? `${val.bg} ${val.color}` : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}
            >
              {val.icon} {val.title.split("(")[0].trim()}
            </button>
          ))}
        </div>

        {/* Kontent */}
        <div className={`rounded-lg p-4 border ${m.bg}`}>
          <h4 className={`font-bold text-sm mb-2 ${m.color}`}>{m.icon} {m.title}</h4>
          <p className="text-purple-200 text-xs mb-4">{m.desc}</p>

          {/* Jadval */}
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="text-left py-2 px-3 text-yellow-400">Ion / Holat</th>
                  {method === "chegara" && <th className="text-left py-2 px-3 text-yellow-400">E₀</th>}
                  {method === "preedge" && (
                    <>
                      <th className="text-left py-2 px-3 text-yellow-400">Energiya</th>
                      <th className="text-left py-2 px-3 text-yellow-400">Intensivlik</th>
                    </>
                  )}
                  {method === "oqchiziq" && <th className="text-left py-2 px-3 text-yellow-400">Shakli</th>}
                  <th className="text-left py-2 px-3 text-yellow-400">Izoh</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {m.data.map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 font-bold">{row.ion}</td>
                    {method === "chegara" && <td className="py-2 px-3 text-blue-400 font-mono">{row.e0}</td>}
                    {method === "preedge" && (
                      <>
                        <td className="py-2 px-3 text-emerald-400 font-mono">{row.energy}</td>
                        <td className="py-2 px-3">{row.intensity}</td>
                      </>
                    )}
                    {method === "oqchiziq" && <td className="py-2 px-3">{row.shape}</td>}
                    <td className="py-2 px-3 text-purple-400">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kalit xulosa */}
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
            <p className="text-yellow-400 font-bold mb-1">🔑 Asosiy qoida:</p>
            <p className="text-purple-200">{m.key}</p>
          </div>
        </div>
      </div>
    </div>
  )
}