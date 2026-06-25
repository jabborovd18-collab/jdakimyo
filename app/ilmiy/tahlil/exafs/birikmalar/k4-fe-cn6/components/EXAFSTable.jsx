"use client"

import { exafsParametrlar, qobiqlar } from "../data/k4-fe-cn6-data"

export default function EXAFSTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 EXAFS strukturaviy parametrlari — K₄[Fe(CN)₆]</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">EXAFS tahlili</strong> natijasida olingan parametrlar.
          Fit diapazoni: <strong className="text-emerald-400">k = {exafsParametrlar.kRange}</strong>, 
          R-diapazon: <strong className="text-emerald-400">{exafsParametrlar.rRange}</strong>.
          S₀² = <strong>{exafsParametrlar.S02.value}</strong> ({exafsParametrlar.S02.note}).
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
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                { qobiq: "1", bog: "Fe−C", N: qobiqlar[0].N, R: qobiqlar[0].R, sigma: qobiqlar[0].sigma2, path: "Fe→C→Fe (SS)" },
                { qobiq: "2a", bog: "Fe−N (SS)", N: qobiqlar[1].N, R: qobiqlar[1].R, sigma: qobiqlar[1].sigma2, path: "Fe→N→Fe (SS)" },
                { qobiq: "2b", bog: "Fe−C−N (MS)", N: "12.0", R: qobiqlar[1].R, sigma: qobiqlar[1].sigma2, path: "Fe→C→N→Fe (3-leg)" },
                { qobiq: "3", bog: "Fe−K", N: qobiqlar[2].N, R: qobiqlar[2].R, sigma: qobiqlar[2].sigma2, path: "Fe→K→Fe (SS)" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-3">{row.qobiq}</td>
                  <td className="py-2 px-3 font-bold text-emerald-400">{row.bog}</td>
                  <td className="py-2 px-3 text-yellow-400 font-mono">{row.N}</td>
                  <td className="py-2 px-3 text-green-400 font-mono">{row.R}</td>
                  <td className="py-2 px-3 font-mono">{row.sigma}</td>
                  <td className="py-2 px-3 text-purple-400 text-xs">{row.path}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 K₃[Fe(CN)₆] bilan asosiy farqlar:</p>
          <p className="text-purple-200">
            <strong>Fe−C:</strong> 1.918 Å vs 1.942 Å — <strong>0.024 Å qisqaroq</strong> (π-backbonding kuchliroq).<br/>
            <strong>Fe−N:</strong> 3.080 Å vs 3.104 Å — <strong>0.024 Å qisqaroq</strong>.<br/>
            <strong>σ²:</strong> K₄[Fe(CN)₆] da barcha σ² qiymatlari <strong>kichikroq</strong> — Fe²⁺ (t₂g⁶) da Yahn-Teller yo'q, struktura tartibliroq.<br/>
            <strong>R-faktor:</strong> 0.010 vs 0.012 — K₄[Fe(CN)₆] da fit sifati yuqoriroq.
          </p>
        </div>

        <div className="mt-3 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 π-backbonding va bog' uzunligi:</p>
          <p className="text-purple-200">
            Fe²⁺ (t₂g⁶) da to'liq to'lgan t₂g orbitallari CN⁻ ning bo'sh π* orbitallariga 
            <strong> kuchliroq elektron beradi</strong> (π-backbonding). Bu Fe−C bog'ini 
            <strong> mustahkamlaydi va qisqartiradi</strong>. Fe³⁺ (t₂g⁵) da bitta elektron kam — 
            π-backbonding zaifroq, bog' uzunroq.
          </p>
        </div>
      </div>
    </div>
  )
}