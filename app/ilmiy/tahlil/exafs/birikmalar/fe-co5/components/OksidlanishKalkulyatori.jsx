"use client"

import { useState } from "react"

const methods = {
  chegara: {
    title: "Fe K-chegara — oksidlanish darajasi",
    icon: "📏",
    desc: "Fe⁰ da E₀ eng past. Har bir oksidlanish darajasi uchun ~5-6 eV siljish.",
    data: [
      { ion: "Fe⁰ — [Fe(CO)₅]", e0: "7114.5 eV", note: "Eng past E₀, CO π-akseptor" },
      { ion: "Fe⁰ — metall", e0: "7110 eV", note: "Sof metall — eng past" },
      { ion: "Fe²⁺ — K₄[Fe(CN)₆]", e0: "7126.0 eV", note: "+11.5 eV (Fe⁰ metallga nisbatan)" },
      { ion: "Fe³⁺ — K₃[Fe(CN)₆]", e0: "7127.5 eV", note: "+13 eV" },
    ],
    key: "Fe⁰ → Fe²⁺ → Fe³⁺: har bir qadamda +1.5-2 eV siljish. CO ta'siri +4.5 eV.",
    color: "text-blue-400", bg: "bg-blue-600/10 border-blue-500/30"
  },
  oqchiziq: {
    title: "Oq chiziq — elektron zichlik indikatori",
    icon: "⚡",
    desc: "CO kuchli π-akseptor — Fe elektron zichligini kamaytiradi, oq chiziq minimal.",
    data: [
      { ion: "[Fe(CO)₅] — Fe⁰", intensity: "Minimal", note: "CO π-akseptor — Fe elektron kambag'al" },
      { ion: "Ferrosen — Fe²⁺", intensity: "O'rtacha", note: "Cp⁻ donor — Fe elektron boy" },
      { ion: "K₃[Fe(CN)₆] — Fe³⁺", intensity: "Kuchli", note: "CN⁻ π-akseptor + Fe³⁺" },
    ],
    key: "Oq chiziq: Fe⁰(CO) {'<'} Fe²⁺(Cp) {'<'} Fe³⁺(CN). π-akseptorlik oq chiziqni pasaytiradi.",
    color: "text-purple-400", bg: "bg-purple-600/10 border-purple-500/30"
  },
  geometriya: {
    title: "Trigonal bipiramida — Berry almashinuvi",
    icon: "📐",
    desc: "Berry psevdorotatsiyasi orqali aksial va ekvatorial CO lar almashinadi.",
    data: [
      { ion: "Xona harorati (298 K)", structure: "5 ta CO — bitta signal (YaMR)", note: "Tez almashinish" },
      { ion: "Past harorat (−100°C)", structure: "2 ta signal (2:3 nisbat)", note: "Sekin almashinish" },
    ],
    key: "Berry mexanizmi — trigonal bipiramida ↔ kvadrat piramida o'tish. Faollanish energiyasi ~15 kJ/mol.",
    color: "text-emerald-400", bg: "bg-emerald-600/10 border-emerald-500/30"
  }
}

export default function OksidlanishKalkulyatori() {
  const [method, setMethod] = useState("chegara")
  const m = methods[method]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Oksidlanish darajasi va Berry mexanizmi</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Fe K-chegara XANES</strong> — 
          Fe⁰ ni Fe²⁺/Fe³⁺ dan farqlash uchun ideal. Berry psevdorotatsiyasi EXAFS da ikki xil Fe−C masofasi sifatida ko'rinadi.
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
                  {method === "geometriya" && <th className="text-left py-2 px-3 text-yellow-400">Struktura</th>}
                  <th className="text-left py-2 px-3 text-yellow-400">Izoh</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {m.data.map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30">
                    <td className="py-2 px-3 font-bold">{row.ion}</td>
                    {method === "chegara" && <td className="py-2 px-3 text-blue-400 font-mono">{row.e0}</td>}
                    {method === "oqchiziq" && <td className="py-2 px-3">{row.intensity}</td>}
                    {method === "geometriya" && <td className="py-2 px-3">{row.structure}</td>}
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