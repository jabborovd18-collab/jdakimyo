"use client"

import { comparisonData } from "../data/ni-cn4-data"
import { useState } from "react"

export default function ComparisonTable() {
  const [highlight, setHighlight] = useState(null)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚖️ Ni²⁺ vs Pt²⁺ vs Pd²⁺ — d⁸ kvadrat tekislik</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Ni²⁺, Pt²⁺, Pd²⁺</strong> — 
          uchala metall ham d⁸ konfiguratsiyali, kvadrat tekislik komplekslar hosil qiladi.
          Lekin <strong>davr bo'ylab</strong> xossalar sezilarli farq qiladi.
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50 bg-purple-900/30">
                <th className="text-left py-3 px-4 text-yellow-400">Parametr</th>
                <th className="text-left py-3 px-4 text-blue-400 bg-blue-600/5">[Ni(CN)₄]²⁻</th>
                <th className="text-left py-3 px-4 text-yellow-400 bg-yellow-600/5">Sisplatin</th>
                <th className="text-left py-3 px-4 text-gray-400 bg-gray-600/5">[PdCl₄]²⁻</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {comparisonData.map((row, i) => (
                <tr key={i} className={`border-b border-purple-800/30 cursor-pointer ${highlight === i ? "bg-yellow-600/10" : "hover:bg-purple-800/20"}`}
                  onClick={() => setHighlight(highlight === i ? null : i)}>
                  <td className="py-2 px-4"><strong>{row.param}</strong></td>
                  <td className="py-2 px-4 text-blue-400">{row.ni2}</td>
                  <td className="py-2 px-4 text-yellow-400">{row.pt2}</td>
                  <td className="py-2 px-4 text-gray-400">{row.pd2}</td>
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
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Ni²⁺ labil-yu, Pt²⁺ inert?</p>
          <p className="text-purple-200">
            <strong>CFSE farqi:</strong> Ni²⁺ (3d⁸) da CFSE kichikroq — ligand almashinishi tez.
            Pt²⁺ (5d⁸) da CFSE kattaroq + 5d orbitallar kengroq — ligand almashinishi sekin.
            <strong> Davr bo'ylab inertlik ortadi:</strong> 3d {'<'} 4d {'<'} 5d.
          </p>
        </div>
      </div>
    </div>
  )
}

function getExplanation(index) {
  const explanations = [
    "Ni²⁺, Pt²⁺, Pd²⁺ — barchasi +2 oksidlanish darajasida. Bir xil d⁸ konfiguratsiya.",
    "Uchalasi ham d⁸ — kvadrat tekislik. dx²−y² orbital bo'sh — bu geometriyani barqarorlashtiradi.",
    "Ni−C: 1.858 Å (eng qisqa). Pt−N: 2.012 Å. Pd−Cl: 1.98 Å. Davr bo'ylab ion radiusi ortadi.",
    "Ni−N: 3.015 Å, Pt−N: 3.10 Å, Pd−N: 3.05 Å. Hammasi chiziqli M−C−N.",
    "Uchalasi ham LS d⁸ — S=0, diamagnit. Kvadrat tekislik d⁸ uchun barqaror.",
    "Ni: sariq. Pt: sariq. Pd: sariq-to'q sariq. Ranglar o'xshash — d−d o'tishlar.",
    "Ni: ~33 000 sm⁻¹. Pt: ~40 000 sm⁻¹. Pd: ~35 000 sm⁻¹. 5d > 4d > 3d.",
    "Ni²⁺: labil (tez almashinadi). Pt²⁺, Pd²⁺: inert (sekin almashinadi). CFSE va davr ta'siri.",
  ]
  return explanations[index] || ""
}