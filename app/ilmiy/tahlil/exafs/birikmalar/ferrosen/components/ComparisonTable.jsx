"use client"

import { comparisonData } from "../data/ferrosen-data"
import { useState } from "react"

export default function ComparisonTable() {
  const [highlight, setHighlight] = useState(null)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚖️ Ferrosen vs Ferrosenium vs Asilferrosen</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Ferrosen va uning hosilalari</strong> — 
          organometallik kimyoning eng muhim oilasi. Ferrosen (Fe²⁺, 18e⁻) — barqaror,
          ferrosenium (Fe³⁺, 17e⁻) — oksidlangan shakl, asilferrosen — dori sintezi uchun.
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50 bg-purple-900/30">
                <th className="text-left py-3 px-4 text-yellow-400">Parametr</th>
                <th className="text-left py-3 px-4 text-orange-400 bg-orange-600/5">Ferrosen</th>
                <th className="text-left py-3 px-4 text-blue-400 bg-blue-600/5">Ferrosenium</th>
                <th className="text-left py-3 px-4 text-purple-400 bg-purple-600/5">Asilferrosen</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {comparisonData.map((row, i) => (
                <tr key={i} className={`border-b border-purple-800/30 cursor-pointer ${highlight === i ? "bg-yellow-600/10" : "hover:bg-purple-800/20"}`}
                  onClick={() => setHighlight(highlight === i ? null : i)}>
                  <td className="py-2 px-4"><strong>{row.param}</strong></td>
                  <td className="py-2 px-4 text-orange-400">{row.ferrosen}</td>
                  <td className="py-2 px-4 text-blue-400">{row.ferrosenium}</td>
                  <td className="py-2 px-4 text-purple-400">{row.asilferrosen}</td>
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
          <p className="text-yellow-400 font-bold mb-1">💡 18 elektron qoidasi:</p>
          <p className="text-purple-200">
            Ferrosen — <strong>18 elektron qoidasining mukammal namunasi</strong>.
            Fe²⁺ (d⁶) = 6e⁻, 2×Cp⁻ (η⁵) = 2×6e⁻ = 12e⁻. Jami: 18e⁻ — barqaror.
            Ferrosenium (17e⁻) — oksidlovchi sifatida ishlatiladi.
          </p>
        </div>
      </div>
    </div>
  )
}

function getExplanation(index) {
  const explanations = [
    "Ferrosen va asilferrosen — Fe²⁺. Ferrosenium — Fe³⁺. Oksidlanish ferrosen markazida sodir bo'ladi (Fe²⁺ → Fe³⁺ + e⁻).",
    "Ferrosen: d⁶ (LS), 18e⁻ — barqaror. Ferrosenium: d⁵ (LS), 17e⁻ — kamroq barqaror. Asilferrosen: d⁶ (LS), 18e⁻ — barqaror.",
    "Ferrosen: to'q sariq (d−d + MLCT). Ferrosenium: ko'k (LMCT kuchli). Asilferrosen: qizil-binafsha (o'rinbosar ta'siri).",
    "Ferrosen, asilferrosen: diamagnit (S=0). Ferrosenium: paramagnit (S=1/2) — EPR signali bor.",
    "Ferroseniumda Fe−C uzunroq (2.075 Å) — π-backbonding zaifroq (Fe³⁺). Asilferrosenda qisqaroq (2.060 Å) — akseptor o'rinbosar.",
    "Ferroseniumda E₀ yuqori (+2 eV) — Fe³⁺. Asilferrosenda E₀ biroz yuqori (+0.5 eV) — akseptor ta'siri.",
    "Ferrosen: δ = +0.54 — Cp⁻ donor. Ferrosenium: δ = +0.43 — Fe³⁺. Asilferrosen: δ = +0.58 — eng musbat.",
    "Ferrosen: ΔE_Q = 2.40 — katta anizotropiya. Ferrosenium: 0.50 — kichik. Asilferrosen: 2.30 — ferrosenga yaqin.",
    "Ferrosen: organometallik kimyo. Ferrosenium: oksidlovchi. Asilferrosen: ferrosenil dorilar sintezi.",
  ]
  return explanations[index] || ""
}