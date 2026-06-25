"use client"

import { mossbauer } from "../data/ferrosen-data"

export default function MossbauerSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔴 Mössbauer spektroskopiyasi — Ferrosen</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">⁵⁷Fe Mössbauer spektroskopiyasi</strong> — 
          ferrosen uchun juda informativ. Katta kvadrupol ajralish (ΔE_Q = 2.40 mm/s) 
          <strong> sendvich strukturaning anizotropiyasini</strong> ko'rsatadi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">Izomer siljish (δ)</p>
            <p className="text-orange-400 text-3xl font-bold font-mono">{mossbauer.isomerShift.value}</p>
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
            <p className="text-yellow-400 font-bold mb-2">Nima uchun δ = +0.54 mm/s?</p>
            <p className="text-purple-200">
              K₄[Fe(CN)₆] (−0.04 mm/s) dan keskin farq — <strong>+0.58 mm/s farq!</strong>
              Sababi: Cp⁻ <strong>kuchli donor ligand</strong> — Fe yadrosida 
              s-elektron zichligi kamayadi (δ musbatlashadi).
              CN⁻ esa π-akseptor — s-elektron zichligi oshadi (δ manfiylashadi).
            </p>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Nima uchun ΔE_Q = 2.40 mm/s?</p>
            <p className="text-purple-200">
              <strong>Juda katta kvadrupol ajralish</strong> — sendvich strukturaning 
              elektr maydon gradienti juda kuchli. Cp halqalari temir atomida 
              <strong> kuchli anizotrop elektr maydon</strong> hosil qiladi.
              Bu — ferrosenning Mössbauer "barmoq izi".
            </p>
          </div>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Ferrosen vs Ferrosenium — Mössbauer farqi:</p>
          <p className="text-purple-200">
            Ferrosen (Fe²⁺): δ = +0.54, ΔE_Q = 2.40 — <strong>katta kvadrupol ajralish</strong>.<br/>
            Ferrosenium (Fe³⁺): δ = +0.43, ΔE_Q = 0.50 — <strong>kichik kvadrupol ajralish</strong>.<br/>
            Bir elektron farqi ΔE_Q ni <strong>1.90 mm/s ga o'zgartiradi</strong> — 
            bu Mössbauer spektroskopiyasining yorqin namunasi.
          </p>
        </div>
      </div>
    </div>
  )
}