"use client"

import { exafsParametrlar, qobiqlar } from "../data/k3-fe-cn6-data"

export default function EXAFSTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 EXAFS strukturaviy parametrlari — to'liq jadval</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">EXAFS tahlili</strong> natijasida olingan strukturaviy parametrlar.
          Fit diapazoni: <strong className="text-emerald-400">k = {exafsParametrlar.kRange}</strong>, 
          R-diapazon: <strong className="text-emerald-400">{exafsParametrlar.rRange}</strong>.
          S₀² = <strong>{exafsParametrlar.S02.value}</strong> ({exafsParametrlar.S02.note}).
          ΔE₀ = <strong>{exafsParametrlar.deltaE0.value} {exafsParametrlar.deltaE0.note}</strong>.
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
                <th className="text-left py-3 px-3 text-yellow-400">Degeneratsiya</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                { qobiq: "1", bog: "Fe−C", N: "6.0", R: "1.942 ± 0.008", sigma: "0.0018 ± 0.0003", path: "Fe→C→Fe (SS)", deg: "6 × 1 = 6" },
                { qobiq: "2a", bog: "Fe−N (SS)", N: "6.0", R: "3.104 ± 0.012", sigma: "0.0022 ± 0.0004", path: "Fe→N→Fe (SS)", deg: "6 × 1 = 6" },
                { qobiq: "2b", bog: "Fe−C−N (MS)", N: "12.0", R: "3.104 ± 0.012", sigma: "0.0022 ± 0.0004", path: "Fe→C→N→Fe (3-leg)", deg: "6 × 2 = 12" },
                { qobiq: "2c", bog: "Fe−C−N−C (MS)", N: "6.0", R: "3.104 ± 0.012", sigma: "0.0022 ± 0.0004", path: "Fe→C→N→C→Fe (4-leg)", deg: "6 × 1 = 6" },
                { qobiq: "3", bog: "Fe−K", N: "~8", R: "4.2−5.8 (tarqoq)", sigma: "0.0035 ± 0.0008", path: "Fe→K→Fe (SS)", deg: "~8 × 1 ≈ 8" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-3">{row.qobiq}</td>
                  <td className="py-2 px-3 font-bold text-emerald-400">{row.bog}</td>
                  <td className="py-2 px-3 text-yellow-400 font-mono">{row.N}</td>
                  <td className="py-2 px-3 text-green-400 font-mono">{row.R}</td>
                  <td className="py-2 px-3 font-mono">{row.sigma}</td>
                  <td className="py-2 px-3 text-purple-400 text-xs">{row.path}</td>
                  <td className="py-2 px-3 text-purple-400">{row.deg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Global fit parametrlari:</p>
          <p className="text-purple-200">
            <strong>R-faktor = {exafsParametrlar.rFactor.value}</strong> — {exafsParametrlar.rFactor.note}.<br/>
            <strong>S₀² = {exafsParametrlar.S02.value}</strong> — {exafsParametrlar.S02.note}.<br/>
            <strong>ΔE₀ = {exafsParametrlar.deltaE0.value} eV</strong> — {exafsParametrlar.deltaE0.note}.<br/>
            <strong>Mustaqil parametrlar soni:</strong> 8 (Nᵢ, Rᵢ, σ²ᵢ). 
            <strong>O'lchov nuqtalari soni:</strong> ~24 (k = 2−14 Å⁻¹, Δk = 0.5 Å⁻¹).
            <strong>Erkinlik darajasi:</strong> 16 — ishonchli fit.
          </p>
        </div>

        <div className="mt-3 bg-purple-900/30 rounded-lg p-4 text-xs">
          <p className="text-purple-400">
            <strong className="text-yellow-400">FEFF hisoblash:</strong> K₃[Fe(CN)₆] monoklin kristall tuzilishi 
            (fazoviy guruh <strong>P2₁/c</strong>) asosida FEFF8 dasturi yordamida sochilish amplitudalari 
            va faza siljishlari hisoblangan. Fit Artemis dasturida amalga oshirilgan.
          </p>
        </div>
      </div>
    </div>
  )
}