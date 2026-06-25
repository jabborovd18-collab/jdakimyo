"use client"

import { useState } from "react"

const methods = {
  chegara: {
    title: "Zn K-chegara siljishi (E₀)",
    icon: "📏",
    desc: "Zn K-chegara energiyasi oksidlanish darajasiga bog'liq. Zn²⁺ da E₀ Zn⁰ ga nisbatan +6 eV siljigan.",
    data: [
      { ion: "Zn⁰ (metall)", e0: "9659 eV", note: "d¹⁰s² — metall" },
      { ion: "Zn²⁺ ([Zn(OH)₄]²⁻, T_d)", e0: "9665 eV", note: "d¹⁰, tetraedrik, +6 eV" },
      { ion: "Zn²⁺ (ZnO, O_h)", e0: "9666 eV", note: "d¹⁰, oktaedrik, +7 eV" },
    ],
    key: "Zn²⁺ da +6−7 eV (Zn⁰ ga nisbatan). Geometriya E₀ ga kam ta'sir qiladi.",
    color: "text-blue-400", bg: "bg-blue-600/10 border-blue-500/30"
  },
  oqchiziq: {
    title: "Oq chiziq — d¹⁰ indikatori",
    icon: "⚡",
    desc: "d¹⁰ konfiguratsiyada oq chiziq kuchli (4p bo'sh). Zn²⁺ da Cu⁺ ga nisbatan kuchliroq.",
    data: [
      { ion: "Zn²⁺ (d¹⁰)", intensity: "Kuchli", note: "4p bo'sh, yadro zaryadi yuqori" },
      { ion: "Cu⁺ (d¹⁰)", intensity: "Minimal", note: "4p yuqoriroq energiyada" },
    ],
    key: "Zn²⁺ oq chiziq > Cu⁺ oq chiziq — yadro zaryadi farqi.",
    color: "text-purple-400", bg: "bg-purple-600/10 border-purple-500/30"
  },
  cfse: {
    title: "CFSE = 0 — geometriya erkinligi",
    icon: "📐",
    desc: "d¹⁰ da CFSE = 0. Geometriya faqat sterik omillar bilan belgilanadi.",
    data: [
      { ion: "Zn²⁺ (d¹⁰)", ks: "4 (T_d), 6 (O_h)", note: "CFSE=0 — har qanday geometriya" },
      { ion: "Cu²⁺ (d⁹)", ks: "4, 6 (Yahn-Teller)", note: "CFSE ≠ 0 — oktaedrik afzal" },
      { ion: "Ni²⁺ (d⁸)", ks: "4 (kvadrat)", note: "CFSE katta — kvadrat tekislik" },
    ],
    key: "CFSE=0 — Zn²⁺ komplekslari labil, geometriya xilma-xil.",
    color: "text-emerald-400", bg: "bg-emerald-600/10 border-emerald-500/30"
  }
}

export default function OksidlanishKalkulyatori() {
  const [method, setMethod] = useState("chegara")
  const m = methods[method]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Oksidlanish darajasi va CFSE</h3>
      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Zn K-chegara XANES</strong> — 
          Zn²⁺/Zn⁰ farqlash uchun ishlatiladi. d¹⁰ — CFSE=0, geometriya erkin.
        </p>
        <div className="flex gap-2 flex-wrap mb-4">
          {Object.entries(methods).map(([key, val]) => (
            <button key={key} onClick={() => setMethod(key)} className={`px-3 py-2 rounded-lg text-xs font-semibold ${method === key ? `${val.bg} ${val.color}` : "bg-purple-800/40 text-purple-300"}`}>{val.icon} {val.title.split("(")[0].trim()}</button>
          ))}
        </div>
        <div className={`rounded-lg p-4 border ${m.bg}`}>
          <h4 className={`font-bold text-sm mb-2 ${m.color}`}>{m.icon} {m.title}</h4>
          <p className="text-purple-200 text-xs mb-4">{m.desc}</p>
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 px-3 text-yellow-400">Birikma</th>{method === "chegara" && <th className="text-left py-2 px-3 text-yellow-400">E₀</th>}{method === "oqchiziq" && <th className="text-left py-2 px-3 text-yellow-400">Intensivlik</th>}{method === "cfse" && <><th className="text-left py-2 px-3 text-yellow-400">KS</th></>}<th className="text-left py-2 px-3 text-yellow-400">Izoh</th></tr></thead>
              <tbody className="text-purple-200">
                {m.data.map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30"><td className="py-2 px-3 font-bold">{row.ion}</td>{method === "chegara" && <td className="py-2 px-3 text-blue-400 font-mono">{row.e0}</td>}{method === "oqchiziq" && <td className="py-2 px-3">{row.intensity}</td>}{method === "cfse" && <td className="py-2 px-3">{row.ks}</td>}<td className="py-2 px-3 text-purple-400">{row.note}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
            <p className="text-yellow-400 font-bold mb-1">🔑 Asosiy qoida:</p><p className="text-purple-200">{m.key}</p>
          </div>
        </div>
      </div>
    </div>
  )
}