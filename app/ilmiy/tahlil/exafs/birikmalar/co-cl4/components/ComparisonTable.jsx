"use client"

import { comparisonData } from "../data/co-cl4-data"
import { useState } from "react"

export default function ComparisonTable() {
  const [highlight, setHighlight] = useState(null)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚖️ [CoCl₄]²⁻ vs [Co(H₂O)₆]²⁺ vs [Co(NH₃)₆]³⁺</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Co²⁺ tetraedrik, Co²⁺ oktaedrik, Co³⁺ oktaedrik</strong> — 
          bir xil metall, turli oksidlanish darajalari va geometriyalar.
          Xossalari tubdan farq qiladi.
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50 bg-purple-900/30">
                <th className="text-left py-3 px-4 text-yellow-400">Parametr</th>
                <th className="text-left py-3 px-4 text-blue-400 bg-blue-600/5">[CoCl₄]²⁻ (T_d)</th>
                <th className="text-left py-3 px-4 text-pink-400 bg-pink-600/5">[Co(H₂O)₆]²⁺ (O_h)</th>
                <th className="text-left py-3 px-4 text-yellow-400 bg-yellow-600/5">[Co(NH₃)₆]³⁺ (O_h)</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {comparisonData.map((row, i) => (
                <tr key={i} className={`border-b border-purple-800/30 cursor-pointer ${highlight === i ? "bg-yellow-600/10" : "hover:bg-purple-800/20"}`}
                  onClick={() => setHighlight(highlight === i ? null : i)}>
                  <td className="py-2 px-4"><strong>{row.param}</strong></td>
                  <td className="py-2 px-4 text-blue-400">{row.co2tetra}</td>
                  <td className="py-2 px-4 text-pink-400">{row.co2okta}</td>
                  <td className="py-2 px-4 text-yellow-400">{row.co3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs mt-4">
          <p className="text-yellow-400 font-bold mb-1">💡 Ko'k = tetraedrik, pushti = oktaedrik:</p>
          <p className="text-purple-200">
            Bu — koordinatsion kimyoning eng mashhur rang-geometriya korrelyatsiyasi.
            CoCl₄²⁻ (ko'k) — tetraedrik, Co(H₂O)₆²⁺ (pushti) — oktaedrik.
            Rang farqi Δ_t (3 100 sm⁻¹) va Δ₀ (9 300 sm⁻¹) farqidan kelib chiqadi.
          </p>
        </div>
      </div>
    </div>
  )
}