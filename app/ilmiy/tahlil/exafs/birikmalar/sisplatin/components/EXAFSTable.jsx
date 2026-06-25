"use client"

import { exafsParametrlar, qobiqlar } from "../data/sisplatin-data"

export default function EXAFSTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 EXAFS strukturaviy parametrlari — Sisplatin</h3>

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
                { qobiq: "1", bog: "Pt−Cl", N: qobiqlar[0].N, R: qobiqlar[0].R, sigma: qobiqlar[0].sigma2, path: "Pt→Cl→Pt (SS)", izoh: "2 ta Cl⁻ (sis-pozitsiya)" },
                { qobiq: "2", bog: "Pt−N", N: qobiqlar[1].N, R: qobiqlar[1].R, sigma: qobiqlar[1].sigma2, path: "Pt→N→Pt (SS)", izoh: "2 ta NH₃ (sis-pozitsiya)" },
                { qobiq: "3", bog: "Pt−Pt", N: qobiqlar[2].N, R: qobiqlar[2].R, sigma: qobiqlar[2].sigma2, path: "Pt→Pt→Pt (SS)", izoh: "Kristall stacking" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-3">{row.qobiq}</td>
                  <td className="py-2 px-3 font-bold text-yellow-400">{row.bog}</td>
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
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Pt−Cl σ² Pt−N dan katta?</p>
          <p className="text-purple-200">
            Pt−Cl bog'i <strong>trans-ta'sir</strong> tufayli labil — gidrolizga moyil.
            σ² = 0.0016 (Pt−Cl) vs 0.0015 (Pt−N). Farq kichik, lekin 
            <strong> Cl⁻ ligandlarining harakatchanligi</strong> yuqoriroq.
            Bu sisplatinning <strong>prodori sifatida ishlash mexanizmiga</strong> mos keladi.
          </p>
        </div>

        <div className="mt-3 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Sis- vs trans- izomer — EXAFS farqi:</p>
          <p className="text-purple-200">
            Sisplatinda Pt−Cl va Pt−N masofalari <strong>deyarli bir xil</strong>.
            Transplatinda ham shunga o'xshash. EXAFS sis- va trans- izomerlarni 
            <strong> bevosita farqlay olmaydi</strong> — buning uchun 
            <strong> IQ spektroskopiya yoki rentgen difraksiyasi</strong> kerak.
          </p>
        </div>

        <div className="mt-3 bg-purple-900/30 rounded-lg p-4 text-xs">
          <p className="text-purple-400">
            <strong className="text-yellow-400">Global fit:</strong> R-faktor = <strong>{exafsParametrlar.rFactor.value}</strong> — {exafsParametrlar.rFactor.note}.<br/>
            <strong className="text-yellow-400">Mustaqil parametrlar:</strong> 8 ta. <strong>Erkinlik darajasi:</strong> 16 — ishonchli fit.
          </p>
        </div>
      </div>
    </div>
  )
}