"use client"

import { comparisonData } from "../data/zn-oh4-data"
import { useState } from "react"

export default function ComparisonTable() {
  const [highlight, setHighlight] = useState(null)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚖️ Zn²⁺ vs Cd²⁺ vs Hg²⁺ — d¹⁰ guruh</h3>
      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Zn²⁺, Cd²⁺, Hg²⁺</strong> — 
          barchasi d¹⁰ konfiguratsiyali, lekin davr bo'ylab xossalari farq qiladi.
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-purple-700/50 bg-purple-900/30"><th className="text-left py-3 px-4 text-yellow-400">Parametr</th><th className="text-left py-3 px-4 text-blue-400 bg-blue-600/5">[Zn(OH)₄]²⁻</th><th className="text-left py-3 px-4 text-yellow-400 bg-yellow-600/5">[Cd(OH)₄]²⁻</th><th className="text-left py-3 px-4 text-gray-300 bg-gray-600/5">[Hg(NH₃)₂]²⁺</th></tr></thead>
            <tbody className="text-purple-200">
              {comparisonData.map((row, i) => (
                <tr key={i} className={`border-b border-purple-800/30 cursor-pointer ${highlight === i ? "bg-yellow-600/10" : "hover:bg-purple-800/20"}`} onClick={() => setHighlight(highlight === i ? null : i)}>
                  <td className="py-2 px-4"><strong>{row.param}</strong></td><td className="py-2 px-4 text-blue-400">{row.zn}</td><td className="py-2 px-4 text-yellow-400">{row.cd}</td><td className="py-2 px-4 text-gray-300">{row.hg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs mt-4">
          <p className="text-yellow-400 font-bold mb-1">💡 HSAB va davr ta'siri:</p>
          <p className="text-purple-200">Zn²⁺ — chegaraviy kislota (biologik ahamiyatli). Cd²⁺ — yumshoq kislota (zaharli). Hg²⁺ — yumshoq kislota (juda zaharli). Davr bo'ylab yumshoqlik ortadi.</p>
        </div>
      </div>
    </div>
  )
}