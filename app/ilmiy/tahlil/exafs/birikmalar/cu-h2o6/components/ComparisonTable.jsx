"use client"

import { comparisonData } from "../data/cu-h2o6-data"
import { useState } from "react"

export default function ComparisonTable() {
  const [highlight, setHighlight] = useState(null)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚖️ Cu²⁺ vs Cu⁺ vs Ni²⁺</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Cu²⁺, Cu⁺, Ni²⁺</strong> — 
          davriy jadvalda yonma-yon, lekin xossalari tubdan farq qiladi.
          Cu²⁺ — Yahn-Teller faol, Cu⁺ — d¹⁰ barqaror, Ni²⁺ — kvadrat tekislik.
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50 bg-purple-900/30">
                <th className="text-left py-3 px-4 text-yellow-400">Parametr</th>
                <th className="text-left py-3 px-4 text-cyan-400 bg-cyan-600/5">Cu²⁺</th>
                <th className="text-left py-3 px-4 text-yellow-400 bg-yellow-600/5">Cu⁺</th>
                <th className="text-left py-3 px-4 text-green-400 bg-green-600/5">Ni²⁺</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {comparisonData.map((row, i) => (
                <tr key={i} className={`border-b border-purple-800/30 cursor-pointer ${highlight === i ? "bg-yellow-600/10" : "hover:bg-purple-800/20"}`}
                  onClick={() => setHighlight(highlight === i ? null : i)}>
                  <td className="py-2 px-4"><strong>{row.param}</strong></td>
                  <td className="py-2 px-4 text-cyan-400">{row.cu2}</td>
                  <td className="py-2 px-4 text-yellow-400">{row.cu1}</td>
                  <td className="py-2 px-4 text-green-400">{row.ni2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {highlight !== null && (
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-xs">
            <p className="text-yellow-400 font-bold mb-2">📖 {comparisonData[highlight].param}</p>
            <p className="text-purple-200">{getExplanation(highlight)}</p>
          </div>
        )}

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs mt-4">
          <p className="text-yellow-400 font-bold mb-1">💡 Irving-Williams qatori:</p>
          <p className="text-purple-200">
            Mn²⁺ {'<'} Fe²⁺ {'<'} Co²⁺ {'<'} Ni²⁺ {'<'} <strong className="text-cyan-400">Cu²⁺</strong> {'>'} Zn²⁺.
            Cu²⁺ eng barqaror komplekslar hosil qiladi — Yahn-Teller stabillashuvi tufayli.
          </p>
        </div>
      </div>
    </div>
  )
}

function getExplanation(index) {
  const explanations = [
    "Cu²⁺ (+2) — eng barqaror oksidlanish darajasi. Cu⁺ (+1) — yumshoq kislota, yumshoq asoslar bilan barqaror. Ni²⁺ (+2) — oraliq.",
    "Cu²⁺: d⁹, Yahn-Teller faol. Cu⁺: d¹⁰, to'liq to'lgan. Ni²⁺: d⁸, kvadrat tekislik. Uchala konfiguratsiya har xil geometriyaga olib keladi.",
    "Cu²⁺: cho'zilgan oktaedr (Yahn-Teller). Cu⁺: chiziqli yoki tetraedrik. Ni²⁺: kvadrat tekislik yoki oktaedrik.",
    "Cu²⁺: S=1/2, paramagnit. Cu⁺: S=0, diamagnit. Ni²⁺: S=0 (kvadrat) yoki S=1 (oktaedrik).",
    "Cu²⁺: havorang. Cu⁺: rangsiz. Ni²⁺: sariq/yashil. Rang farqi d−d o'tishlar va geometriyaga bog'liq.",
    "Cu²⁺: 1.97-2.28 Å (Yahn-Teller). Cu⁺: ~1.85 Å (chiziqli). Ni²⁺: ~2.05 Å (oktaedrik).",
    "Cu²⁺: 8995 eV (+16). Cu⁺: 8982 eV (+3). Ni²⁺: 8340 eV. Turli metallar — turli chegaralar.",
    "Cu²⁺: kuchli (S=1/2). Cu⁺: yo'q (S=0). Ni²⁺: yo'q (kvadrat S=0) yoki bor (oktaedrik S=1).",
    "Cu²⁺: BOR (kuchli, d⁹). Cu⁺: yo'q (d¹⁰). Ni²⁺: yo'q (d⁸ LS).",
  ]
  return explanations[index] || ""
}