"use client"

import { mossbauer } from "../data/fe-co5-data"

export default function MossbauerSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔴 Mössbauer spektroskopiyasi — [Fe(CO)₅]</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">⁵⁷Fe Mössbauer spektroskopiyasi</strong> — 
          Fe⁰ (d⁸) uchun xarakterli parametrlar. Katta kvadrupol ajralish (2.52 mm/s)
          <strong> trigonal bipiramidal anizotropiyani</strong> ko'rsatadi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">Izomer siljish (δ)</p>
            <p className="text-yellow-400 text-3xl font-bold font-mono">{mossbauer.isomerShift.value}</p>
            <p className="text-purple-500 text-xs mt-2">{mossbauer.isomerShift.note}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">Kvadrupol ajralish (ΔE_Q)</p>
            <p className="text-blue-400 text-3xl font-bold font-mono">{mossbauer.quadrupoleSplitting.value}</p>
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
            <p className="text-yellow-400 font-bold mb-2">Nima uchun δ = −0.18 mm/s?</p>
            <p className="text-purple-200">
              Fe⁰ — <strong>eng past oksidlanish darajasi</strong>. CO kuchli π-akseptor — 
              Fe dan elektron zichligini tortib oladi, s-elektron zichligi <strong>nisbatan yuqori</strong> 
              (yadro yaqinida). δ manfiy — Fe²⁺/Fe³⁺ ga nisbatan musbatroq.
              Taqqoslash: K₄[Fe(CN)₆] (Fe²⁺) δ = −0.04, K₃[Fe(CN)₆] (Fe³⁺) δ = −0.12.
            </p>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Nima uchun ΔE_Q = 2.52 mm/s?</p>
            <p className="text-purple-200">
              Trigonal bipiramida — <strong>kuchli anizotrop</strong> elektr maydon gradienti.
              Aksial va ekvatorial CO ligandlari har xil masofada — 
              <strong> EFG katta</strong>. Harorat ko'tarilganda Berry psevdorotatsiyasi 
              tezlashadi — ΔE_Q <strong>kamayadi</strong> (o'rtacha simmetriya).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}