"use client"

import { epr } from "../data/cu-h2o6-data"

export default function EPRSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧲 EPR spektroskopiyasi — [Cu(H₂O)₆]²⁺</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Cu²⁺ (S=1/2)</strong> — 
          kuchli EPR signali beradi. Yahn-Teller cho'zilishi tufayli 
          <strong> aksial simmetriya</strong> (g∥ ≠ g⊥).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">g-faktor</p>
            <p className="text-cyan-400 text-lg font-bold font-mono">{epr.gFactor}</p>
            <p className="text-purple-500 text-xs mt-2">Aksial simmetriya</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">O'ta nozik tuzilish</p>
            <p className="text-yellow-400 text-lg font-bold font-mono">{epr.hyperfine}</p>
            <p className="text-purple-500 text-xs mt-2">⁶³Cu (I=3/2)</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">Sharoit</p>
            <p className="text-green-400 text-sm">{epr.condition}</p>
            <p className="text-purple-500 text-xs mt-2">S=1/2 — ideal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Nima uchun g∥ {'>'} g⊥?</p>
            <p className="text-purple-200">
              Cho'zilgan oktaedrda <strong>dz² orbital energiyasi pasaygan</strong> — 
              spin-orbita bog'lanishi orqali g∥ kattalashadi.
              g∥ ≈ 2.40, g⊥ ≈ 2.08 — <strong>g∥ {'>'} g⊥ {'>'} 2.00</strong> — 
              Cu²⁺ cho'zilgan oktaedr uchun xarakterli.
            </p>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">O'ta nozik tuzilish (A∥)</p>
            <p className="text-purple-200">
              A∥ ≈ 120−140 × 10⁻⁴ sm⁻¹ — <strong>4 ta parallel chiziq</strong>.
              ⁶³Cu yadro spini I=3/2 bo'lgani uchun (2I+1=4 chiziq).
              O'ta nozik tuzilish <strong>spin zichligining Cu atomida lokalizatsiyasini</strong> ko'rsatadi.
            </p>
          </div>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 EPR vs EXAFS:</p>
          <p className="text-purple-200">
            EPR — <strong>elektron tuzilish va simmetriyani</strong> aniqlaydi (g-faktor, A∥).
            EXAFS — <strong>geometrik parametrlarni</strong> beradi (Cu−O masofalari).
            Ikkala usul birgalikda Yahn-Teller effektining to'liq tavsifini beradi.
          </p>
        </div>
      </div>
    </div>
  )
}