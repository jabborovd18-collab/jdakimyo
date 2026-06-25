"use client"

import { comparisonData } from "../data/ag-nh3-2-data"
import { useState } from "react"

export default function ComparisonTable() {
  const [highlight, setHighlight] = useState(null)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚖️ Ag⁺ vs Cu⁺ vs Au⁺ — d¹⁰ chiziqli</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Ag⁺, Cu⁺, Au⁺</strong> — 
          uchala metall ham d¹⁰ konfiguratsiyali, chiziqli komplekslar hosil qiladi (KS=2).
          HSAB bo'yicha yumshoqlik: Cu⁺ {'<'} Ag⁺ {'<'} Au⁺.
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50 bg-purple-900/30">
                <th className="text-left py-3 px-4 text-yellow-400">Parametr</th>
                <th className="text-left py-3 px-4 text-gray-300 bg-gray-600/5">[Ag(NH₃)₂]⁺</th>
                <th className="text-left py-3 px-4 text-yellow-400 bg-yellow-600/5">[Cu(NH₃)₂]⁺</th>
                <th className="text-left py-3 px-4 text-amber-300 bg-amber-600/5">[Au(CN)₂]⁻</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {comparisonData.map((row, i) => (
                <tr key={i} className={`border-b border-purple-800/30 cursor-pointer ${highlight === i ? "bg-yellow-600/10" : "hover:bg-purple-800/20"}`}
                  onClick={() => setHighlight(highlight === i ? null : i)}>
                  <td className="py-2 px-4"><strong>{row.param}</strong></td>
                  <td className="py-2 px-4 text-gray-300">{row.ag1}</td>
                  <td className="py-2 px-4 text-yellow-400">{row.cu1}</td>
                  <td className="py-2 px-4 text-amber-300">{row.au1}</td>
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
          <p className="text-yellow-400 font-bold mb-1">💡 HSAB va davr ta'siri:</p>
          <p className="text-purple-200">
            Yumshoqlik: Cu⁺ {'<'} Ag⁺ {'<'} Au⁺ (relativistik effekt tufayli).
            Au⁺ — o'ta yumshoq kislota, CN⁻ (yumshoq asos) bilan mustahkam bog'lanadi.
            Ag⁺ — Tollens reaktivi, Cu⁺ — osongina oksidlanadi (Cu²⁺ ga).
          </p>
        </div>
      </div>
    </div>
  )
}

function getExplanation(index) {
  const explanations = [
    "Ag⁺, Cu⁺, Au⁺ — barchasi +1 oksidlanish darajasida. Bir xil d¹⁰ konfiguratsiya.",
    "Uchalasi ham d¹⁰ — barcha d-orbitallar to'lgan. d−d o'tish yo'q. Rangsiz yoki och sariq.",
    "Uchalasi ham KS=2, chiziqli geometriya. sp-gibridlanish. CFSE=0.",
    "Uchalasi ham S=0, diamagnit. d¹⁰ — barcha elektronlar juftlashgan.",
    "Ag⁺: rangsiz. Cu⁺: rangsiz. Au⁺: rangsiz/sariq (relativistik effekt). d−d o'tish yo'q.",
    "Ag−N: 2.115 Å. Cu−N: ~1.90 Å. Au−C: ~2.00 Å. Ion radiusi: Cu⁺ {'<'} Ag⁺ {'<'} Au⁺.",
    "Ag: 25517 eV (K). Cu: 8982 eV (K). Au: 11920 eV (L₃). Turli metallar — turli chegaralar.",
    "Cu⁺ — yumshoq, Ag⁺ — yumshoqroq, Au⁺ — o'ta yumshoq. Relativistik effekt tufayli.",
    "Ag⁺: Tollens reaktivi. Cu⁺: katalizator. Au⁺: dorilar (auronofin).",
  ]
  return explanations[index] || ""
}