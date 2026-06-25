"use client"

import { epr } from "../data/k3-fe-cn6-data"

export default function EPRSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧲 EPR (Elektron Paramagnit Rezonans)</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">EPR spektroskopiyasi</strong> — 
          toq elektronli tizimlarni o'rganishning eng sezgir usuli.
          K₃[Fe(CN)₆] — Fe³⁺ (LS, S=1/2) — <strong>kuchli EPR signali</strong> beradi.
          K₄[Fe(CN)₆] (Fe²⁺, S=0) esa <strong>EPR signali bermaydi</strong> (diamagnit).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">g-faktorlar</p>
            <p className="text-blue-400 text-lg font-bold font-mono">{epr.gFactor}</p>
            <p className="text-purple-500 text-xs mt-2">Rombik simmetriya</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">Spin holati</p>
            <p className="text-red-400 text-3xl font-bold">S = ½</p>
            <p className="text-purple-500 text-xs mt-2">1 ta toq elektron</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">K₄[Fe(CN)₆]</p>
            <p className="text-gray-400 text-3xl font-bold">S = 0</p>
            <p className="text-purple-500 text-xs mt-2">EPR signali yo'q!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Nima uchun g₁ ≠ g₂ ≠ g₃?</p>
            <p className="text-purple-200">
              Mukammal oktaedrik simmetriyada (O_h) <strong>g₁ = g₂ = g₃ ≈ 2.0</strong> bo'lishi kerak.
              K₃[Fe(CN)₆] da <strong>rombik buzilish</strong> kuzatiladi — 
              bu <strong>Yahn-Teller effekti</strong> tufayli. t₂g⁵ konfiguratsiyada 
              t₂g orbitallar orasida elektronlar notekis taqsimlangan → 
              simmetriya O_h → D₄h yoki D₂h gacha pasaygan.
            </p>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">EPR shartlari</p>
            <p className="text-purple-200">
              K₃[Fe(CN)₆] uchun EPR signali <strong>xona haroratida ham kuzatiladi</strong> 
              (ko'pchilik Fe komplekslaridan farqli — ular faqat past haroratda signal beradi).
              Sababi: <strong>spin-panjara relaksatsiyasi sekin</strong> — 
              LS holatda orbital burchak momenti "muzlatilgan".
            </p>
          </div>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 EPR ning EXAFS dan afzalligi:</p>
          <p className="text-purple-200">
            EPR <strong>elektron tuzilishning nozik detallarini</strong> ko'rsatadi 
            (simmetriya buzilishi, spin zichligi taqsimoti). EXAFS esa faqat 
            <strong> geometrik parametrlarni</strong> beradi. Ikkala usul birgalikda 
            K₃[Fe(CN)₆] ning to'liq tavsifini beradi.
          </p>
        </div>

        <div className="mt-3 bg-purple-900/30 rounded-lg p-4 text-xs">
          <p className="text-purple-400">
            <strong className="text-yellow-400">Eksperimental sharoit:</strong> {epr.condition}
          </p>
          <p className="text-purple-400 mt-1">
            <strong className="text-yellow-400">Solishtirish:</strong> Fe²⁺ komplekslari (K₄[Fe(CN)₆], [Fe(bpy)₃]²⁺) 
            LS holatda diamagnit (S=0) — EPR signali yo'q. HS Fe²⁺ (S=2) — 
            butun sonli spin tufayli EPR signali faqat juda past haroratda (≤4 K) kuzatiladi.
          </p>
        </div>
      </div>
    </div>
  )
}