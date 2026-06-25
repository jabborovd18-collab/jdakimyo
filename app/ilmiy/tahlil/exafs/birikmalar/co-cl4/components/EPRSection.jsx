"use client"

import { epr } from "../data/co-cl4-data"

export default function EPRSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧲 EPR spektroskopiyasi — [CoCl₄]²⁻</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Co²⁺ (HS, S=3/2)</strong> — 
          EPR signali beradi, lekin faqat <strong>past haroratda</strong> (≤20 K).
          Tetraedrik simmetriyada <strong>nol-maydon ajralishi (ZFS)</strong> katta —
          xona haroratida signal juda keng bo'lib, kuzatilmaydi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">g-faktor</p>
            <p className="text-blue-400 text-lg font-bold font-mono">{epr.gFactor}</p>
            <p className="text-purple-500 text-xs mt-2">Keng signal</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">Spin holati</p>
            <p className="text-red-400 text-3xl font-bold">S = 3/2</p>
            <p className="text-purple-500 text-xs mt-2">3 ta toq elektron</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">Sharoit</p>
            <p className="text-green-400 text-sm">{epr.condition}</p>
            <p className="text-purple-500 text-xs mt-2">ZFS katta</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Nima uchun faqat past haroratda?</p>
            <p className="text-purple-200">
              Tetraedrik Co²⁺ da <strong>nol-maydon ajralishi (ZFS)</strong> parametri 
              D ≈ 5−15 sm⁻¹ — bu juda katta. ZFS spin sathlarini ajratadi.
              Xona haroratida (kT ≈ 200 sm⁻¹) barcha sathlar band — 
              <strong> signal juda keng</strong> bo'lib ketadi.
              Past haroratda (kT {'<'} D) faqat eng past sath band — signal torayadi.
            </p>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">[Co(H₂O)₆]²⁺ bilan solishtirish</p>
            <p className="text-purple-200">
              Oktaedrik Co²⁺ (HS, S=3/2) ham xuddi shunday — keng signal, past haroratda.
              Co³⁺ (LS, S=0) — EPR signali yo'q.
              <strong>EPR Co²⁺/Co³⁺ farqlash uchun ideal:</strong> Co²⁺ da signal bor (past T da),
              Co³⁺ da signal yo'q.
            </p>
          </div>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 EPR ning EXAFS dan afzalligi:</p>
          <p className="text-purple-200">
            EPR <strong>spin holatini va simmetriyani</strong> bevosita aniqlaydi.
            EXAFS esa <strong>geometrik parametrlarni</strong> beradi.
            Ikkala usul birgalikda Co²⁺ komplekslarining to'liq tavsifini beradi.
          </p>
        </div>
      </div>
    </div>
  )
}