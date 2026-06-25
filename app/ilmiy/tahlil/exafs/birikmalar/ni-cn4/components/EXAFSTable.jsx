"use client"

import { exafsParametrlar, qobiqlar, basicInfo, msInfo } from "../data/ni-cn4-data"

export default function EXAFSTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 EXAFS strukturaviy parametrlari — [Ni(CN)₄]²⁻</h3>

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
                <th className="text-left py-3 px-3 text-yellow-400">FEFF path</th>
                <th className="text-left py-3 px-3 text-yellow-400">Izoh</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                { qobiq: "1", bog: "Ni−C", N: qobiqlar[0].N, R: qobiqlar[0].R, sigma: qobiqlar[0].sigma2, path: "Ni→C→Ni (SS)", izoh: "4 ta CN⁻ (C-uchlari)" },
                { qobiq: "2a", bog: "Ni−N (SS)", N: qobiqlar[1].N, R: qobiqlar[1].R, sigma: qobiqlar[1].sigma2, path: "Ni→N→Ni (SS)", izoh: "4 ta CN⁻ (N-uchlari)" },
                { qobiq: "2b", bog: "Ni−C−N (MS)", N: "8.0", R: "3.015 ± 0.010", sigma: "0.0018", path: "Ni→C→N→Ni (3-leg)", izoh: "Fokuslash — kuchli!" },
                { qobiq: "3", bog: "Ni−K/Na", N: qobiqlar[2].N, R: qobiqlar[2].R, sigma: qobiqlar[2].sigma2, path: "Ni→K→Ni (SS)", izoh: "Qarshi ionlar" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-3">{row.qobiq}</td>
                  <td className="py-2 px-3 font-bold text-blue-400">{row.bog}</td>
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
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Ni−C = 1.858 Å — juda qisqa?</p>
          <p className="text-purple-200">
            Ni²⁺ (d⁸) — kvadrat tekislik. CN⁻ kuchli σ-donor + π-akseptor.
            <strong> Kuchli σ-bog'</strong> (Ni−C) + <strong>π-backbonding</strong> (Ni→CN⁻ π*) 
            bog'ni mustahkamlaydi va qisqartiradi. Bu — 
            <strong> kuchli maydon ligandlarining klassik effekti</strong>.
          </p>
        </div>

        <div className="mt-3 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 {msInfo.title}</p>
          <p className="text-purple-200">{msInfo.desc}</p>
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