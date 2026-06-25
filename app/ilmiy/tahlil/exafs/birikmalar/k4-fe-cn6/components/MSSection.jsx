"use client"

import { useState } from "react"

export default function MSSection() {
  const [showComparison, setShowComparison] = useState(false)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 Multiple Scattering — K₄[Fe(CN)₆] da fokuslash effekti</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">K₄[Fe(CN)₆]</strong> da Fe−C−N deyarli chiziqli (~178°).
          Bu <strong className="text-emerald-400">fokuslash effekti</strong> uchun ideal geometriya — 
          Multiple Scattering (MS) yo'llari Single Scattering (SS) dan kuchliroq.
          K₄[Fe(CN)₆] da Fe−C bog'i qisqaroq (1.918 Å) — fokuslash K₃[Fe(CN)₆] ga nisbatan ham kuchliroq.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">SS (Single Scattering)</p>
            <div className="space-y-2">
              <div className="bg-emerald-600/10 border border-emerald-500/30 rounded p-2">
                <p className="text-emerald-400 font-mono">Fe → C → Fe</p>
                <p className="text-purple-400">R_eff = 1.918 Å, N = 6</p>
              </div>
              <div className="bg-emerald-600/10 border border-emerald-500/30 rounded p-2">
                <p className="text-emerald-400 font-mono">Fe → N → Fe</p>
                <p className="text-purple-400">R_eff = 3.080 Å, N = 6</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">MS (Multiple Scattering)</p>
            <div className="space-y-2">
              <div className="bg-blue-600/10 border border-blue-500/30 rounded p-2">
                <p className="text-blue-400 font-mono">Fe → C → N → Fe (3-leg)</p>
                <p className="text-purple-400">R_eff = 3.080 Å, N = 12 (fokuslash!)</p>
                <p className="text-yellow-400 text-xs mt-1">⭐ Eng kuchli signal!</p>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/30 rounded p-2">
                <p className="text-blue-400 font-mono">Fe → C → N → C → Fe (4-leg)</p>
                <p className="text-purple-400">R_eff = 3.080 Å, N = 6</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowComparison(!showComparison)}
          className="w-full px-4 py-3 bg-purple-800/40 rounded-lg text-purple-300 text-xs font-semibold hover:bg-purple-700/50 transition-colors mb-4"
        >
          {showComparison ? "▲ K₃[Fe(CN)₆] bilan solishtirishni yashirish" : "▼ K₃[Fe(CN)₆] bilan solishtirishni ko'rish"}
        </button>

        {showComparison && (
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-xs animate-fadeIn">
            <p className="text-yellow-400 font-bold mb-2">K₄[Fe(CN)₆] vs K₃[Fe(CN)₆] — MS farqi:</p>
            <div className="space-y-2 text-purple-200">
              <p>• <strong>Fe−C masofasi:</strong> K₄ da 1.918 Å, K₃ da 1.942 Å — K₄ da qisqaroq → fokuslash kuchliroq</p>
              <p>• <strong>σ² (Fe−N):</strong> K₄ da 0.0019, K₃ da 0.0022 — K₄ da kamroq tartibsizlik → MS aniqroq</p>
              <p>• <strong>Yahn-Teller:</strong> K₃ da bor (t₂g⁵) → simmetriya buzilgan → MS zaifroq</p>
              <p>• <strong>Natija:</strong> K₄[Fe(CN)₆] da MS signallari K₃[Fe(CN)₆] ga nisbatan ~10-15% kuchliroq</p>
            </div>
          </div>
        )}

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Fokuslash effekti — K₄[Fe(CN)₆] da nima uchun kuchliroq?</p>
          <p className="text-purple-200">
            K₄[Fe(CN)₆] da Fe−C bog'i qisqaroq (1.918 vs 1.942 Å) — atomlar yaqinroq, 
            fotoelektron sochilishi samaraliroq. Yahn-Teller buzilishi yo'q — 
            simmetriya mukammal, fokuslash maksimal. Shu sababli K₄[Fe(CN)₆] 
            EXAFS si K₃[Fe(CN)₆] ga nisbatan <strong>aniqroq va ishonchliroq</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}