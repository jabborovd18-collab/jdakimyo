"use client"

import { useState } from "react"

const methods = {
  chegara: {
    title: "Cr K-chegara siljishi (E₀)",
    icon: "📏",
    desc: "Cr K-chegara energiyasi oksidlanish darajasiga kuchli bog'liq. Cr³⁺ da E₀ Cr⁰ ga nisbatan +16 eV.",
    data: [
      { ion: "Cr⁰ (metall)", e0: "5989 eV", note: "Metall" },
      { ion: "Cr²⁺ ([Cr(H₂O)₆]²⁺)", e0: "6003 eV", note: "d⁴, +14 eV" },
      { ion: "Cr³⁺ ([Cr(H₂O)₆]³⁺)", e0: "6005 eV", note: "d³, +16 eV" },
      { ion: "Cr⁶⁺ (CrO₄²⁻)", e0: "6010 eV", note: "d⁰, +21 eV" },
    ],
    key: "Har bir oksidlanish darajasi uchun sezilarli siljish. Cr³⁺ da +16 eV.",
    color: "text-blue-400", bg: "bg-blue-600/10 border-blue-500/30"
  },
  preedge: {
    title: "Pre-edge — geometriya va oksidlanish darajasi",
    icon: "🎯",
    desc: "Pre-edge intensivligi geometriyaga kuchli bog'liq. T_d (Cr⁶⁺) da kuchli, O_h (Cr³⁺) da kuchsiz.",
    data: [
      { ion: "Cr³⁺ (O_h)", intensity: "~0.03−0.05", note: "Dipol taqiqi bor" },
      { ion: "Cr²⁺ (O_h, Yahn-Teller)", intensity: "~0.05−0.08", note: "Simmetriya pasaygan" },
      { ion: "Cr⁶⁺ (T_d)", intensity: "~0.25", note: "Dipol taqiqi yo'q — 5-8× kuchliroq" },
    ],
    key: "Pre-edge: Cr³⁺(O_h) {'<'} Cr²⁺(O_h, JT) {'<'} Cr⁶⁺(T_d).",
    color: "text-emerald-400", bg: "bg-emerald-600/10 border-emerald-500/30"
  },
  cfse: {
    title: "CFSE va inertlik",
    icon: "📐",
    desc: "Cr³⁺ (d³) — CFSE = −1.2Δ₀ (katta). Eng inert komplekslardan biri.",
    data: [
      { ion: "Cr³⁺ (d³, O_h)", cfse: "−1.2Δ₀", labillik: "Inert (t₁/₂ ~soat)" },
      { ion: "Cr²⁺ (d⁴, HS)", cfse: "−0.6Δ₀", labillik: "Labil (tez)" },
      { ion: "Co³⁺ (d⁶, LS)", cfse: "−2.4Δ₀", labillik: "Juda inert (t₁/₂ ~kun)" },
    ],
    key: "CFSE qancha katta bo'lsa, kompleks shuncha inert. Cr³⁺ — oraliq holat.",
    color: "text-purple-400", bg: "bg-purple-600/10 border-purple-500/30"
  }
}

export default function OksidlanishKalkulyatori() {
  const [method, setMethod] = useState("chegara")
  const m = methods[method]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Oksidlanish darajasi, geometriya va CFSE</h3>
      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Cr K-chegara XANES</strong> — 
          Cr³⁺/Cr⁶⁺ farqlash uchun eng ishonchli usul. Pre-edge geometriyani aniqlaydi.
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
              <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 px-3 text-yellow-400">Birikma</th>{method === "chegara" && <th className="text-left py-2 px-3 text-yellow-400">E₀</th>}{method === "preedge" && <th className="text-left py-2 px-3 text-yellow-400">Intensivlik</th>}{method === "cfse" && <><th className="text-left py-2 px-3 text-yellow-400">CFSE</th><th className="text-left py-2 px-3 text-yellow-400">Labillik</th></>}<th className="text-left py-2 px-3 text-yellow-400">Izoh</th></tr></thead>
              <tbody className="text-purple-200">
                {m.data.map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30"><td className="py-2 px-3 font-bold">{row.ion}</td>{method === "chegara" && <td className="py-2 px-3 text-blue-400 font-mono">{row.e0}</td>}{method === "preedge" && <td className="py-2 px-3">{row.intensity}</td>}{method === "cfse" && <><td className="py-2 px-3 text-yellow-400 font-mono">{row.cfse}</td><td className="py-2 px-3">{row.labillik}</td></>}<td className="py-2 px-3 text-purple-400">{row.note}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs"><p className="text-yellow-400 font-bold mb-1">🔑 Asosiy qoida:</p><p className="text-purple-200">{m.key}</p></div>
        </div>
      </div>
    </div>
  )
}