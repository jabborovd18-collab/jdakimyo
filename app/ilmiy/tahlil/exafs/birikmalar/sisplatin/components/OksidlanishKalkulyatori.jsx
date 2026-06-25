"use client"

import { useState } from "react"

const methods = {
  chegara: {
    title: "L₃-chegara siljishi (E₀)",
    icon: "📏",
    desc: "Pt L₃-chegara energiyasi oksidlanish darajasiga kuchli bog'liq. Har bir oksidlanish darajasi uchun ~3 eV siljish.",
    data: [
      { ion: "Pt⁰", e0: "11564 eV", note: "Metall platina, d¹⁰ — minimal oq chiziq" },
      { ion: "Pt²⁺", e0: "11567 eV", note: "Sisplatin, karboplatin — d⁸" },
      { ion: "Pt⁴⁺", e0: "11570 eV", note: "K₂[PtCl₆] — d⁶, maksimal oq chiziq" },
    ],
    key: "Har bir oksidlanish darajasi uchun ~3 eV siljish. Pt²⁺ da +3 eV (Pt⁰ ga nisbatan).",
    color: "text-blue-400",
    bg: "bg-blue-600/10 border-blue-500/30"
  },
  oqchiziq: {
    title: "Oq chiziq (white line) intensivligi",
    icon: "⚡",
    desc: "L₃-chegara oq chizig'i 2p → 5d o'tish. Intensivlik 5d bo'sh orbitallar soniga to'g'ridan-to'g'ri proporsional.",
    data: [
      { ion: "Pt⁰ (d¹⁰)", intensity: "Minimal", note: "5d to'liq to'lgan — bo'sh o'rin yo'q" },
      { ion: "Pt²⁺ (d⁸)", intensity: "Kuchli", note: "2 ta bo'sh 5d o'rin" },
      { ion: "Pt⁴⁺ (d⁶)", intensity: "Juda kuchli", note: "4 ta bo'sh 5d o'rin" },
    ],
    key: "Oq chiziq — Pt oksidlanish darajasining eng tezkor va ishonchli indikatori.",
    color: "text-purple-400",
    bg: "bg-purple-600/10 border-purple-500/30"
  },
  exafs: {
    title: "EXAFS — bog' uzunligi orqali",
    icon: "📐",
    desc: "Pt−L bog' uzunligi oksidlanish darajasiga bog'liq. Yuqori oksidlanish darajasida bog' qisqaroq.",
    data: [
      { ion: "Pt²⁺−Cl", R: "2.328 Å", note: "Sisplatin" },
      { ion: "Pt⁴⁺−Cl", R: "2.308 Å", note: "K₂[PtCl₆] — qisqaroq" },
      { ion: "Pt²⁺−N", R: "2.012 Å", note: "Sisplatin — NH₃ ligandlari" },
    ],
    key: "Bog' uzunligi farqi kichik (~0.02 Å), lekin sezilarli. Yuqori zaryad — qisqaroq bog'.",
    color: "text-emerald-400",
    bg: "bg-emerald-600/10 border-emerald-500/30"
  }
}

export default function OksidlanishKalkulyatori() {
  const [method, setMethod] = useState("chegara")
  const m = methods[method]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Pt oksidlanish darajasini aniqlash</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Pt L₃-chegara XANES</strong> — 
          oksidlanish darajasini aniqlashning eng ishonchli usuli.
          Sisplatin (Pt²⁺) ni Pt⁰ va Pt⁴⁺ dan farqlash oson.
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
                  <th className="text-left py-2 px-3 text-yellow-400">Ion / Birikma</th>
                  {method === "chegara" && <th className="text-left py-2 px-3 text-yellow-400">E₀</th>}
                  {method === "oqchiziq" && <th className="text-left py-2 px-3 text-yellow-400">Intensivlik</th>}
                  {method === "exafs" && <th className="text-left py-2 px-3 text-yellow-400">R (Å)</th>}
                  <th className="text-left py-2 px-3 text-yellow-400">Izoh</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {m.data.map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30">
                    <td className="py-2 px-3 font-bold">{row.ion}</td>
                    {method === "chegara" && <td className="py-2 px-3 text-blue-400 font-mono">{row.e0}</td>}
                    {method === "oqchiziq" && <td className="py-2 px-3">{row.intensity}</td>}
                    {method === "exafs" && <td className="py-2 px-3 text-green-400 font-mono">{row.R}</td>}
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