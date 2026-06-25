"use client"

import { exafsParametrlar, qobiqlar, basicInfo } from "../data/ag-nh3-2-data"

export default function EXAFSTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 EXAFS strukturaviy parametrlari — [Ag(NH₃)₂]⁺</h3>

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
                { qobiq: "1", bog: "Ag−N", N: qobiqlar[0].N, R: qobiqlar[0].R, sigma: qobiqlar[0].sigma2, izoh: "2 ta NH₃, chiziqli" },
                { qobiq: "2a", bog: "Ag−H (SS)", N: qobiqlar[1].N, R: qobiqlar[1].R, sigma: qobiqlar[1].sigma2, izoh: "6 ta H atomi" },
                { qobiq: "2b", bog: "Ag−N−H (MS)", N: "4.0", R: "2.85 ± 0.02", sigma: "0.0045", izoh: "3-leg MS, zaif fokuslash" },
                { qobiq: "3", bog: "Ag−O/Ag−N", N: qobiqlar[2].N, R: qobiqlar[2].R, sigma: qobiqlar[2].sigma2, izoh: "Qarshi ionlar" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-3">{row.qobiq}</td>
                  <td className="py-2 px-3 font-bold text-gray-300">{row.bog}</td>
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
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Ag−N = 2.115 Å?</p>
          <p className="text-purple-200">
            Ag⁺ ion radiusi (1.15 Å, KS=2) + NH₃ donor atomi radiusi (~0.70 Å) ≈ 1.85 Å.
            Haqiqiy masofa 2.115 Å — <strong>ion radiuslaridan kattaroq</strong>.
            Sababi: <strong>sp-gibridlanish</strong> — gibrid orbitallar ion radiusidan uzoqroqqa cho'zilgan.
            Chiziqli geometriya (N−Ag−N = 180°) EXAFS da MS orqali tasdiqlanadi.
          </p>
        </div>

        <div className="mt-3 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 KS=2 — eng kichik koordinatsion son:</p>
          <p className="text-purple-200">
            Ag⁺ (d¹⁰) — CFSE = 0, geometriya faqat ligandlar soni va sterikasi bilan belgilanadi.
            NH₃ — o'rtacha kattalikdagi ligand, 2 ta ligand chiziqli joylashadi.
            KS=2 — <strong>sp-gibridlanish</strong> uchun ideal.
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