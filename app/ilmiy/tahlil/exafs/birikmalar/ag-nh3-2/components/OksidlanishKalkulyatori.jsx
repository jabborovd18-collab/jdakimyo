"use client"

import { useState } from "react"

const methods = {
  chegara: {
    title: "Ag K-chegara siljishi (E₀)",
    icon: "📏",
    desc: "Ag K-chegara energiyasi oksidlanish darajasiga bog'liq. Ag⁺ da E₀ Ag⁰ ga nisbatan +3 eV siljigan.",
    data: [
      { ion: "Ag⁰ (metall)", e0: "25514 eV", note: "d¹⁰, minimal oq chiziq" },
      { ion: "Ag⁺ ([Ag(NH₃)₂]⁺)", e0: "25517 eV", note: "d¹⁰, chiziqli, +3 eV" },
      { ion: "Ag²⁺ (AgO)", e0: "25520 eV", note: "d⁹, +6 eV, kuchli oksidlovchi" },
    ],
    key: "Ag⁺ da +3 eV (Ag⁰ ga nisbatan). Siljish Cu ga nisbatan kichikroq — 4d orbitallar kengroq.",
    color: "text-blue-400",
    bg: "bg-blue-600/10 border-blue-500/30"
  },
  oqchiziq: {
    title: "Oq chiziq — d¹⁰ indikatori",
    icon: "⚡",
    desc: "d¹⁰ konfiguratsiyada oq chiziq minimal. d⁹ (Ag²⁺) da esa kuchli.",
    data: [
      { ion: "Ag⁺ (d¹⁰)", intensity: "Minimal", note: "4d to'liq to'lgan" },
      { ion: "Ag²⁺ (d⁹)", intensity: "Kuchli", note: "1 ta bo'sh 4d o'rin" },
      { ion: "Cu⁺ (d¹⁰)", intensity: "Minimal", note: "Ag⁺ bilan bir xil" },
    ],
    key: "Oq chiziq — d¹⁰/d⁹ farqlashning eng tezkor usuli.",
    color: "text-purple-400",
    bg: "bg-purple-600/10 border-purple-500/30"
  },
  chiziqli: {
    title: "Chiziqli geometriya — EXAFS dalili",
    icon: "📐",
    desc: "N−Ag−N = 180°. Faqat 2 ta bir xil masofadagi ligand. MS fokuslash effekti yo'q (burchak 180°).",
    data: [
      { ion: "[Ag(NH₃)₂]⁺", N: "2.0", R: "2.115 Å", burchak: "180°" },
      { ion: "[Cu(NH₃)₂]⁺", N: "2.0", R: "~1.90 Å", burchak: "180°" },
      { ion: "[Au(CN)₂]⁻", N: "2.0", R: "~2.00 Å", burchak: "180°" },
    ],
    key: "d¹⁰ + chiziqli — eng oddiy EXAFS spektri (faqat 1 ta qobiq kuchli).",
    color: "text-emerald-400",
    bg: "bg-emerald-600/10 border-emerald-500/30"
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
          <strong className="text-yellow-400">Ag K-chegara XANES</strong> — 
          Ag⁺/Ag⁰ farqlash uchun ishlatiladi. Chiziqli geometriya EXAFS da oddiy spektr beradi.
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
                  {method === "oqchiziq" && <th className="text-left py-2 px-3 text-yellow-400">Intensivlik</th>}
                  {method === "chiziqli" && <><th className="text-left py-2 px-3 text-yellow-400">N</th><th className="text-left py-2 px-3 text-yellow-400">R (Å)</th></>}
                  <th className="text-left py-2 px-3 text-yellow-400">Izoh</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {m.data.map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30">
                    <td className="py-2 px-3 font-bold">{row.ion}</td>
                    {method === "chegara" && <td className="py-2 px-3 text-blue-400 font-mono">{row.e0}</td>}
                    {method === "oqchiziq" && <td className="py-2 px-3">{row.intensity}</td>}
                    {method === "chiziqli" && <><td className="py-2 px-3 text-yellow-400 font-mono">{row.N}</td><td className="py-2 px-3 text-green-400 font-mono">{row.R}</td></>}
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