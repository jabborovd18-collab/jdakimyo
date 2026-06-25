"use client"

import { exafsParametrlar, qobiqlar } from "../data/co-nh3-6-cl3-data"

export default function EXAFSTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 EXAFS strukturaviy parametrlari — [Co(NH₃)₆]Cl₃</h3>

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
                { qobiq: "1", bog: "Co−N", N: qobiqlar[0].N, R: qobiqlar[0].R, sigma: qobiqlar[0].sigma2, path: "Co→N→Co (SS)", izoh: "6 ta NH₃, oktaedrik" },
                { qobiq: "2a", bog: "Co−H (SS)", N: "18.0", R: qobiqlar[1].R, sigma: qobiqlar[1].sigma2, path: "Co→H→Co (SS)", izoh: "18 ta H atomi" },
                { qobiq: "2b", bog: "Co−N−H (MS)", N: "12.0", R: "2.65 ± 0.015", sigma: "0.0025", path: "Co→N→H→Co (3-leg)", izoh: "Fokuslash zaif — burchak ~109°" },
                { qobiq: "3", bog: "Co−Cl", N: qobiqlar[2].N, R: qobiqlar[2].R, sigma: qobiqlar[2].sigma2, path: "Co→Cl→Co (SS)", izoh: "Cl⁻ qarshi ionlari" },
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
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Co−N σ² kichik?</p>
          <p className="text-purple-200">
            Co³⁺ (LS, d⁶) — <strong>Yahn-Teller effekti yo'q</strong>. 
            Oktaedrik simmetriya mukammal. σ² = 0.0012 Å² — 
            <strong> juda kichik</strong> tartibsizlik. Bu Co³⁺ komplekslarining 
            <strong> yuqori barqarorligi va inertligi</strong> bilan bog'liq.
          </p>
        </div>

        <div className="mt-3 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 MS fokuslash — nima uchun zaif?</p>
          <p className="text-purple-200">
            Fe−C≡N deyarli chiziqli (~178°) — fokuslash kuchli. 
            Co−N−H burchagi esa <strong>~109°</strong> (tetraedrik azot) — 
            <strong> fokuslash zaif</strong>. MS signallari SS dan kuchli emas.
            Bu geometriyani aniqlashda muhim diagnostik belgi.
          </p>
        </div>

        <div className="mt-3 bg-purple-900/30 rounded-lg p-4 text-xs">
          <p className="text-purple-400">
            <strong className="text-yellow-400">Global fit:</strong> R-faktor = <strong>{exafsParametrlar.rFactor.value}</strong> — {exafsParametrlar.rFactor.note}.<br/>
            <strong className="text-yellow-400">Mustaqil parametrlar:</strong> 8 ta. <strong>O'lchov nuqtalari:</strong> ~24 ta. 
            <strong>Erkinlik darajasi:</strong> 16 — ishonchli fit.
          </p>
        </div>
      </div>
    </div>
  )
}