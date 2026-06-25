"use client"

import { comparisonData } from "../data/sisplatin-data"
import { useState } from "react"

export default function ComparisonTable() {
  const [highlight, setHighlight] = useState(null)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚖️ Sisplatin vs Transplatin vs Karboplatin</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Sisplatin, transplatin va karboplatin</strong> — 
          uchala kompleks ham Pt²⁺ (d⁸), kvadrat tekislik. Lekin 
          <strong> geometrik izomeriya</strong> (sis vs trans) va 
          <strong> ligand turi</strong> (Cl vs CBDCA) ularning biologik faolligini tubdan o'zgartiradi.
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50 bg-purple-900/30">
                <th className="text-left py-3 px-4 text-yellow-400">Parametr</th>
                <th className="text-left py-3 px-4 text-yellow-400 bg-yellow-600/5">Sisplatin</th>
                <th className="text-left py-3 px-4 text-gray-400 bg-gray-600/5">Transplatin</th>
                <th className="text-left py-3 px-4 text-blue-400 bg-blue-600/5">Karboplatin</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {comparisonData.map((row, i) => (
                <tr key={i} className={`border-b border-purple-800/30 cursor-pointer ${highlight === i ? "bg-yellow-600/10" : "hover:bg-purple-800/20"}`}
                  onClick={() => setHighlight(highlight === i ? null : i)}>
                  <td className="py-2 px-4"><strong>{row.param}</strong></td>
                  <td className="py-2 px-4 text-yellow-400">{row.sis}</td>
                  <td className="py-2 px-4 text-gray-400">{row.trans}</td>
                  <td className="py-2 px-4 text-blue-400">{row.karbo}</td>
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
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun transplatin faol emas?</p>
          <p className="text-purple-200">
            Transplatinda Cl⁻ ligandlari <strong>qarama-qarshi pozitsiyada</strong> — 
            DNK bilan 1,2-intrastrend cross-link hosil qila olmaydi. Faqat 
            <strong> 1,3-intrastrend yoki interstrend</strong> cross-link hosil qiladi, 
            lekin ular DNK ni yetarlicha egmaydi va <strong>apoptoz signali</strong> kamroq.
            Bu — <strong>koordinatsion geometriyaning farmakologik ahamiyati</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

function getExplanation(index) {
  const explanations = [
    "Uchala kompleksda ham Pt²⁺ (d⁸), kvadrat tekislik. Oksidlanish darajasi bir xil — XANES spektrlari deyarli farq qilmaydi.",
    "Sisplatin va transplatin — bir xil ligandlar (2×Cl⁻ + 2×NH₃), lekin fazoviy joylashuvi har xil. Karboplatinda Cl⁻ o'rniga CBDCA²⁻ (bidentat).",
    "Sisplatinda 2×Cl⁻ yonma-yon (sis), 2×NH₃ yonma-yon. Transplatinda Cl⁻ qarama-qarshi, NH₃ qarama-qarshi. Karboplatinda CBDCA²⁻ xelat.",
    "EXAFS: Pt−Cl masofasi sisplatinda 2.328 Å, transplatinda 2.320 Å — farq kichik. Karboplatinda Pt−Cl yo'q, Pt−O ~2.020 Å.",
    "EXAFS: Pt−N masofasi sisplatinda 2.012 Å, transplatinda 2.005 Å. Karboplatinda Pt−N emas, Pt−O (CBDCA).",
    "Karboplatin suvda yaxshi eriydi — vena ichiga yuborish oson. Sisplatin eruvchanligi past — infuziya kerak.",
    "Sisplatin — yuqori antikanser faollik (moyak saratoni 90%). Transplatin — faol emas. Karboplatin — yuqori faollik, kamroq nojo'ya.",
    "Sisplatin DNK da 1,2-intrastrend GpG cross-link (65%). Transplatin bunday qila olmaydi. Karboplatin — sekinroq, bir xil mahsulot.",
    "Sisplatin — nefrotoksik (buyrakka zarar). Karboplatin — miyelosupressiya (suyak ko'migi). Transplatin — nojo'ya ta'siri yuqori.",
  ]
  return explanations[index] || ""
}