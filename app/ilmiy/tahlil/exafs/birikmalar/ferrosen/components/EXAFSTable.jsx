"use client"

import { exafsParametrlar, qobiqlar, basicInfo } from "../data/ferrosen-data"

export default function EXAFSTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 EXAFS strukturaviy parametrlari — Ferrosen</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">EXAFS tahlili</strong> natijasida olingan parametrlar.
          Fit diapazoni: <strong className="text-emerald-400">k = {exafsParametrlar.kRange}</strong>, 
          R-diapazon: <strong className="text-emerald-400">{exafsParametrlar.rRange}</strong>.
          S₀² = <strong>{exafsParametrlar.S02.value}</strong> ({exafsParametrlar.S02.note}).
          ΔE₀ = <strong>{exafsParametrlar.deltaE0.value} eV</strong> ({exafsParametrlar.deltaE0.note}).
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
                <th className="text-left py-3 px-3 text-yellow-400">FEFF path</th>
                <th className="text-left py-3 px-3 text-yellow-400">Izoh</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                { qobiq: "1", bog: "Fe−C", N: qobiqlar[0].N, R: qobiqlar[0].R, sigma: qobiqlar[0].sigma2, path: "Fe→C→Fe (SS)", izoh: "10 ta C, η⁵-koordinatsiya" },
                { qobiq: "2a", bog: "Fe−C−C (MS)", N: "20.0", R: "2.85 ± 0.02", sigma: "0.0035", path: "Fe→C→C→Fe (3-leg)", izoh: "Cp halqasi bo'ylab MS" },
                { qobiq: "2b", bog: "Fe−H", N: qobiqlar[1].N, R: qobiqlar[1].R, sigma: qobiqlar[1].sigma2, path: "Fe→H→Fe (SS)", izoh: "10 ta H, signal zaif" },
                { qobiq: "3", bog: "Fe−Fe", N: qobiqlar[2].N, R: qobiqlar[2].R, sigma: qobiqlar[2].sigma2, path: "Fe→Fe→Fe (SS)", izoh: "Molekulalararo" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-3">{row.qobiq}</td>
                  <td className="py-2 px-3 font-bold text-orange-400">{row.bog}</td>
                  <td className="py-2 px-3 text-yellow-400 font-mono">{row.N}</td>
                  <td className="py-2 px-3 text-green-400 font-mono">{row.R}</td>
                  <td className="py-2 px-3 font-mono">{row.sigma}</td>
                  <td className="py-2 px-3 text-purple-400 text-xs">{row.path}</td>
                  <td className="py-2 px-3 text-purple-400 text-xs">{row.izoh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Fe−C = 2.064 Å — barcha 10 ta C bir xil?</p>
          <p className="text-purple-200">
            Ferrosenda <strong>η⁵-koordinatsiya</strong> — temir atomi Cp halqasining 
            barcha 5 ta uglerod atomi bilan <strong>teng masofada</strong> bog'langan.
            Bu — <strong>sendvich strukturaning asosiy xususiyati</strong>.
            Fe−C masofasi 2.064 Å — bu <strong>Fe−C σ-bog' va π-bog'</strong> aralashmasi.
          </p>
        </div>

        <div className="mt-3 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 18 elektron qoidasi va EXAFS:</p>
          <p className="text-purple-200">
            Ferrosen — <strong>18 elektron qoidasining klassik namunasi</strong>:
            Fe²⁺ (6e⁻) + 2×Cp⁻ (12e⁻) = 18e⁻. Bu barqaror elektron konfiguratsiya
            <strong> barcha Fe−C masofalarini tenglashtiradi</strong> va 
            <strong> σ² qiymatini kichik qiladi</strong> (0.0021 — tartibli struktura).
          </p>
        </div>

        <div className="mt-3 bg-purple-900/30 rounded-lg p-4 text-xs">
          <p className="text-purple-400">
            <strong className="text-yellow-400">Global fit:</strong> R-faktor = <strong>{exafsParametrlar.rFactor.value}</strong> — {exafsParametrlar.rFactor.note}.<br/>
            <strong className="text-yellow-400">Qo'shimcha:</strong> {basicInfo.bondLength}
          </p>
        </div>
      </div>
    </div>
  )
}