"use client"

import { exafsParametrlar, qobiqlar, basicInfo, yahnTeller } from "../data/cu-h2o6-data"

export default function EXAFSTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 EXAFS strukturaviy parametrlari — [Cu(H₂O)₆]²⁺</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">EXAFS tahlili</strong> — Yahn-Teller effektini bevosita kuzatish imkonini beradi.
          Fit diapazoni: <strong className="text-emerald-400">k = {exafsParametrlar.kRange}</strong>.
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
                { qobiq: "1", bog: "Cu−O(ekv)", N: qobiqlar[0].N, R: qobiqlar[0].R, sigma: qobiqlar[0].sigma2, path: "Cu→O→Cu (SS)", izoh: "4 ta H₂O, xy tekisligi" },
                { qobiq: "2", bog: "Cu−O(aks)", N: qobiqlar[1].N, R: qobiqlar[1].R, sigma: qobiqlar[1].sigma2, path: "Cu→O→Cu (SS)", izoh: "2 ta H₂O, z o'qi" },
                { qobiq: "3", bog: "Cu−H", N: qobiqlar[2].N, R: qobiqlar[2].R, sigma: qobiqlar[2].sigma2, path: "Cu→H→Cu (SS)", izoh: "12 ta H atomi" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-3">{row.qobiq}</td>
                  <td className="py-2 px-3 font-bold text-cyan-400">{row.bog}</td>
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
          <p className="text-yellow-400 font-bold mb-1">💡 Yahn-Teller — EXAFS da qanday ko'rinadi?</p>
          <p className="text-purple-200">
            EXAFS FT spektrida <strong>Cu−O piki ikkiga ajralgan</strong>: 
            ~1.5 Å da kuchli pik (4 ta ekvatorial O) + ~1.9 Å da zaif yelka (2 ta aksial O).
            Bu — <strong>Yahn-Teller cho'zilishining bevosita EXAFS dalili</strong>.
            Oddiy oktaedrik komplekslarda bitta pik kuzatiladi.
          </p>
        </div>

        <div className="mt-3 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 σ² farqi — dinamik Yahn-Teller</p>
          <p className="text-purple-200">
            σ²(ekv) = 0.0022 — kichik, tartibli. σ²(aks) = 0.0035 — kattaroq.
            Aksial ligandlarning <strong>harakatchanligi yuqori</strong> — 
            bu <strong>dinamik Yahn-Teller effekti</strong> bilan bog'liq bo'lishi mumkin.
          </p>
        </div>

        <div className="mt-3 bg-purple-900/30 rounded-lg p-4 text-xs">
          <p className="text-purple-400">
            <strong className="text-yellow-400">Global fit:</strong> R-faktor = <strong>{exafsParametrlar.rFactor.value}</strong> — {exafsParametrlar.rFactor.note}.<br/>
            <strong className="text-yellow-400">Yahn-Teller:</strong> {yahnTeller.energyGain}
          </p>
        </div>
      </div>
    </div>
  )
}