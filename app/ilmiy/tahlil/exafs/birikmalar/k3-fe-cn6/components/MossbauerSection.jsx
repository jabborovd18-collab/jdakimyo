"use client"

import { mossbauer } from "../data/k3-fe-cn6-data"

export default function MossbauerSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔴 Mössbauer spektroskopiyasi</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">⁵⁷Fe Mössbauer spektroskopiyasi</strong> — 
          K₃[Fe(CN)₆] uchun EXAFS/XANES dan ham informativroq usul. 
          Izomer siljish (δ) va kvadrupol ajralish (ΔE_Q) oksidlanish darajasi, 
          spin holati va simmetriyani aniq ko'rsatadi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">Izomer siljish (δ)</p>
            <p className="text-red-400 text-3xl font-bold font-mono">{mossbauer.isomerShift.value}</p>
            <p className="text-purple-500 text-xs mt-2">{mossbauer.isomerShift.note}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">Kvadrupol ajralish (ΔE_Q)</p>
            <p className="text-yellow-400 text-3xl font-bold font-mono">{mossbauer.quadrupoleSplitting.value}</p>
            <p className="text-purple-500 text-xs mt-2">{mossbauer.quadrupoleSplitting.note}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">Magnit o'ta nozik maydon</p>
            <p className="text-gray-400 text-3xl font-bold">{mossbauer.hyperfineField.value}</p>
            <p className="text-purple-500 text-xs mt-2">{mossbauer.hyperfineField.note}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Nima uchun δ manfiy?</p>
            <p className="text-purple-200">
              δ = −0.12 mm/s — LS Fe³⁺ uchun xarakterli. Manfiy izomer siljish 
              <strong>s-elektron zichligi yuqori</strong> ekanligini ko'rsatadi. 
              CN⁻ kuchli σ-donor — Fe yadrosida s-elektron zichligi oshadi.
              Taqqoslash: HS Fe³⁺ (masalan, FeF₃) da δ ≈ +0.5 mm/s.
            </p>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">ΔE_Q nima deydi?</p>
            <p className="text-purple-200">
              ΔE_Q = 0.38 mm/s — kichik, lekin noldan farqli. 
              <strong>t₂g⁵ konfiguratsiya</strong> da Yahn-Teller effekti tufayli 
              oktaedrik simmetriya biroz buzilgan — elektr maydon gradienti hosil bo'ladi.
              Mukammal oktaedrik simmetriyada ΔE_Q = 0 bo'lar edi.
            </p>
          </div>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Mössbauer vs EXAFS:</p>
          <p className="text-purple-200">
            Mössbauer — <strong>valentlik va spin holatini</strong> aniqlashda EXAFS dan ustun.
            EXAFS — <strong>bog' uzunliklarini</strong> aniqlashda Mössbauer dan ustun.
            Ikkala usul birgalikda K₃[Fe(CN)₆] ning to'liq tuzilishiy-elektron tavsifini beradi.
          </p>
        </div>
      </div>
    </div>
  )
}