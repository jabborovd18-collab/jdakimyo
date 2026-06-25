"use client"

export default function EXAFSTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 EXAFS strukturaviy parametrlari — [Cr(H₂O)₆]³⁺</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">EXAFS tahlili</strong> natijasida olingan parametrlar.
          S₀² = 0.83, ΔE₀ = 1.8 eV, R-faktor = 0.009.
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
              <tr className="border-b border-purple-800/30">
                <td className="py-2 px-3">1</td>
                <td className="py-2 px-3 font-bold text-emerald-400">Cr−O</td>
                <td className="py-2 px-3 text-yellow-400">6.0</td>
                <td className="py-2 px-3 text-green-400">1.966 ± 0.006</td>
                <td className="py-2 px-3">0.0017</td>
                <td className="py-2 px-3 text-purple-400 text-xs">6 ta H₂O, oktaedrik</td>
              </tr>
              <tr className="border-b border-purple-800/30">
                <td className="py-2 px-3">2</td>
                <td className="py-2 px-3 font-bold text-emerald-400">Cr−H</td>
                <td className="py-2 px-3 text-yellow-400">12.0</td>
                <td className="py-2 px-3 text-green-400">2.68 ± 0.02</td>
                <td className="py-2 px-3">0.0040</td>
                <td className="py-2 px-3 text-purple-400 text-xs">12 ta H atomi</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Cr³⁺ — inert kompleks:</p>
          <p className="text-purple-200">
            CFSE = −1.2Δ₀ (katta). t₂g yarim to'lgan. Yahn-Teller yo'q.
            σ² kichik (0.0017) — tartibli struktura.
          </p>
        </div>
      </div>
    </div>
  )
}