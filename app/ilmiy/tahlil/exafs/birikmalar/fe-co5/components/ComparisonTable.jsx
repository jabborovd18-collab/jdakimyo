"use client"

import { comparisonData } from "../data/fe-co5-data"
import { useState } from "react"

export default function ComparisonTable() {
  const [highlight, setHighlight] = useState(null)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚖️ Fe(CO)₅ vs Cr(CO)₆ vs Ni(CO)₄</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Metall karbonil komplekslari</strong> — 
          barchasi 18 elektron qoidasiga bo'ysunadi. Turli geometriyalar — turli xossalar.
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50 bg-purple-900/30">
                <th className="text-left py-3 px-4 text-yellow-400">Parametr</th>
                <th className="text-left py-3 px-4 text-yellow-400 bg-yellow-600/5">[Fe(CO)₅]</th>
                <th className="text-left py-3 px-4 text-gray-300 bg-gray-600/5">[Cr(CO)₆]</th>
                <th className="text-left py-3 px-4 text-green-400 bg-green-600/5">[Ni(CO)₄]</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {comparisonData.map((row, i) => (
                <tr key={i} className={`border-b border-purple-800/30 cursor-pointer ${highlight === i ? "bg-yellow-600/10" : "hover:bg-purple-800/20"}`}
                  onClick={() => setHighlight(highlight === i ? null : i)}>
                  <td className="py-2 px-4"><strong>{row.param}</strong></td>
                  <td className="py-2 px-4 text-yellow-400">{row.feco5}</td>
                  <td className="py-2 px-4 text-gray-300">{row.crco6}</td>
                  <td className="py-2 px-4 text-green-400">{row.nico4}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs mt-4">
          <p className="text-yellow-400 font-bold mb-1">💡 18 elektron qoidasi:</p>
          <p className="text-purple-200">
            Fe(CO)₅: 8(Fe⁰) + 5×2(CO) = 18e⁻ — trigonal bipiramida.<br/>
            Cr(CO)₆: 6(Cr⁰) + 6×2(CO) = 18e⁻ — oktaedrik.<br/>
            Ni(CO)₄: 10(Ni⁰) + 4×2(CO) = 18e⁻ — tetraedrik.
          </p>
        </div>
      </div>
    </div>
  )
}