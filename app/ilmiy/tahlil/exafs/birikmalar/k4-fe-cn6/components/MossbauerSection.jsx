"use client"

import { mossbauer } from "../data/k4-fe-cn6-data"

export default function MossbauerSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔴 Mössbauer spektroskopiyasi — K₄[Fe(CN)₆]</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">⁵⁷Fe Mössbauer spektroskopiyasi</strong> — 
          K₄[Fe(CN)₆] diamagnit (S=0) bo'lgani uchun <strong>magnit o'ta nozik maydon yo'q</strong>.
          Izomer siljish (δ) va kvadrupol ajralish (ΔE_Q) Fe²⁺ (LS) holatini tasdiqlaydi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">Izomer siljish (δ)</p>
            <p className="text-yellow-400 text-3xl font-bold font-mono">{mossbauer.isomerShift.value}</p>
            <p className="text-purple-500 text-xs mt-2">{mossbauer.isomerShift.note}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">Kvadrupol ajralish (ΔE_Q)</p>
            <p className="text-green-400 text-3xl font-bold font-mono">{mossbauer.quadrupoleSplitting.value}</p>
            <p className="text-purple-500 text-xs mt-2">{mossbauer.quadrupoleSplitting.note}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">Magnit maydon</p>
            <p className="text-gray-400 text-3xl font-bold">{mossbauer.hyperfineField.value}</p>
            <p className="text-purple-500 text-xs mt-2">{mossbauer.hyperfineField.note}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Nima uchun δ = −0.04 mm/s?</p>
            <p className="text-purple-200">
              K₃[Fe(CN)₆] (−0.12 mm/s) ga nisbatan <strong>musbatroq</strong>. Sababi: 
              Fe²⁺ da yadro zaryadi pastroq — s-elektron zichligi kamroq.
              CN⁻ kuchli σ-donor bo'lsa ham, Fe²⁺/Fe³⁺ farqi sezilarli.
            </p>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Nima uchun ΔE_Q = 0?</p>
            <p className="text-purple-200">
              t₂g⁶ konfiguratsiyada <strong>Yahn-Teller effekti yo'q</strong> — 
              barcha t₂g orbitallar teng to'lgan. Oktaedrik simmetriya 
              <strong> mukammal saqlanadi</strong>. Elektr maydon gradienti nolga teng.
            </p>
          </div>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 K₃[Fe(CN)₆] vs K₄[Fe(CN)₆] — Mössbauer farqi:</p>
          <p className="text-purple-200">
            K₄[Fe(CN)₆]: δ = −0.04, ΔE_Q = 0.00 — <strong>mukammal simmetriya</strong>.<br/>
            K₃[Fe(CN)₆]: δ = −0.12, ΔE_Q = 0.38 — <strong>Yahn-Teller buzilishi</strong>.<br/>
            Bu farq <strong>bir elektron</strong> qo'shilishi/olinishi tufayli yuzaga keladi.
          </p>
        </div>
      </div>
    </div>
  )
}