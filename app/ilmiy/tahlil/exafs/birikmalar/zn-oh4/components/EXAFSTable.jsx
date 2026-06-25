"use client"

import { exafsParametrlar, qobiqlar, basicInfo } from "../data/zn-oh4-data"

export default function EXAFSTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 EXAFS strukturaviy parametrlari — [Zn(OH)₄]²⁻</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">EXAFS tahlili</strong> natijasida olingan parametrlar.
          Fit diapazoni: <strong className="text-emerald-400">k = {exafsParametrlar.kRange}</strong>, 
          R-diapazon: <strong className="text-emerald-400">{exafsParametrlar.rRange}</strong>.
          S₀² = <strong>{exafsParametrlar.S02.value}</strong>. ΔE₀ = <strong>{exafsParametrlar.deltaE0.value} eV</strong>.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50 bg-purple-900/30">
                <th className="text-left py-3 px-3 text-yellow-400">Qobiq</th>
                <th className="text-left py-3 px-3 text-yellow-400">Bog'</th>
                <th className="text-left py-3 px-3 text-yellow-400">N</th>
                <th className="text-left py-3 px-3 text-yellow-400">R (Å)</th>
                <th className="text-left py-3 px-3 text-yellow-400">σ² (Å²)</th>
                <th className="text-left py-3 px-3 text-yellow-400">Izoh</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                { qobiq: "1", bog: "Zn−O", N: qobiqlar[0].N, R: qobiqlar[0].R, sigma: qobiqlar[0].sigma2, izoh: "4 ta OH⁻, tetraedrik" },
                { qobiq: "2", bog: "Zn−Na/K", N: qobiqlar[1].N, R: qobiqlar[1].R, sigma: qobiqlar[1].sigma2, izoh: "Qarshi ionlar" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-3">{row.qobiq}</td>
                  <td className="py-2 px-3 font-bold text-blue-400">{row.bog}</td>
                  <td className="py-2 px-3 text-yellow-400 font-mono">{row.N}</td>
                  <td className="py-2 px-3 text-green-400 font-mono">{row.R}</td>
                  <td className="py-2 px-3 font-mono">{row.sigma}</td>
                  <td className="py-2 px-3 text-purple-400 text-xs">{row.izoh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Zn−O = 1.972 Å?</p>
          <p className="text-purple-200">
            Zn²⁺ tetraedrik ion radiusi (0.60 Å) + O²⁻ radiusi (~1.35 Å) ≈ 1.95 Å.
            Haqiqiy masofa 1.972 Å — <strong>ion radiuslariga juda yaqin</strong>.
            d¹⁰ konfiguratsiya — CFSE=0, bog' uzunligi faqat ion radiuslari bilan belgilanadi.
            Bu — <strong>CFSE yo'qligining klassik namunasi</strong>.
          </p>
        </div>

        <div className="mt-3 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 CFSE=0 — geometriya qanday aniqlanadi?</p>
          <p className="text-purple-200">
            Zn²⁺ (d¹⁰) da CFSE = 0 — <strong>hech qanday energetik afzallik yo'q</strong>.
            Geometriya faqat <strong>ligandlar soni va sterik itarilish</strong> bilan belgilanadi.
            4 ta ligand — tetraedrik geometriya (sterik optimal).
            Zn²⁺ — <strong>labillik</strong> (tez almashinadi), CFSE=0 tufayli.
          </p>
        </div>

        <div className="mt-3 bg-purple-900/30 rounded-lg p-4 text-xs">
          <p className="text-purple-400">
            <strong className="text-yellow-400">Global fit:</strong> R-faktor = <strong>{exafsParametrlar.rFactor.value}</strong>.<br/>
            <strong className="text-yellow-400">Qo'shimcha:</strong> {basicInfo.bondLength}
          </p>
        </div>
      </div>
    </div>
  )
}