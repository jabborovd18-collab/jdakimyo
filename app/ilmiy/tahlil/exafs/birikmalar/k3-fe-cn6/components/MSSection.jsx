"use client"

import { msPaths } from "../data/k3-fe-cn6-data"
import { useState } from "react"

export default function MSSection() {
  const [selectedPath, setSelectedPath] = useState(2)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 Multiple Scattering (MS) — ko'p karrali sochilish</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Multiple Scattering (MS)</strong> — 
          EXAFS signaliga qo'shiladigan muhim hissa. Fotoelektron bir nechta atomdan 
          ketma-ket sochiladi. <strong>Fe−C≡N chiziqli geometriyasi</strong> (~178°) tufayli 
          <strong className="text-emerald-400"> fokuslash effekti</strong> juda kuchli — 
          MS yo'llari Single Scattering (SS) dan ham intensivroq bo'lishi mumkin!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Single Scattering (SS)</p>
            <div className="space-y-2">
              <div className="bg-emerald-600/10 border border-emerald-500/30 rounded p-2">
                <p className="text-emerald-400 font-mono">Fe → C → Fe</p>
                <p className="text-purple-400">Fotoelektron C atomidan 1 marta sochilib qaytadi</p>
              </div>
              <div className="bg-emerald-600/10 border border-emerald-500/30 rounded p-2">
                <p className="text-emerald-400 font-mono">Fe → N → Fe</p>
                <p className="text-purple-400">Fotoelektron N atomidan 1 marta sochilib qaytadi</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Multiple Scattering (MS)</p>
            <div className="space-y-2">
              <div className="bg-blue-600/10 border border-blue-500/30 rounded p-2">
                <p className="text-blue-400 font-mono">Fe → C → N → Fe (3-leg)</p>
                <p className="text-purple-400">Fotoelektron C, keyin N atomidan sochiladi</p>
                <p className="text-yellow-400 text-xs mt-1">⭐ Fokuslash effekti — juda kuchli!</p>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/30 rounded p-2">
                <p className="text-blue-400 font-mono">Fe → C → N → C → Fe (4-leg)</p>
                <p className="text-purple-400">To'rt marta sochilish — o'rtacha intensivlik</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interaktiv yo'l tanlash */}
        <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
          <p className="text-yellow-400 font-bold text-xs mb-3">🔍 Sochilish yo'llari — interaktiv ko'rish</p>
          
          <div className="flex gap-2 flex-wrap mb-3">
            {msPaths.map((path, i) => (
              <button
                key={i}
                onClick={() => setSelectedPath(i)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  selectedPath === i 
                    ? "bg-emerald-600/80 text-white" 
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}
              >
                {path.type}: {path.path}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <p><strong className="text-yellow-400">Tur:</strong> <span className="text-purple-200">{msPaths[selectedPath].type} ({msPaths[selectedPath].legs}-leg)</span></p>
                <p><strong className="text-yellow-400">Yo'l:</strong> <span className="text-emerald-400 font-mono">{msPaths[selectedPath].path}</span></p>
              </div>
              <div className="space-y-1">
                <p><strong className="text-yellow-400">Samarali masofa:</strong> <span className="text-purple-200">{msPaths[selectedPath].Reff}</span></p>
                <p><strong className="text-yellow-400">Intensivlik:</strong> <span className="text-purple-200">{msPaths[selectedPath].strength}</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Fokuslash effekti nima?</p>
          <p className="text-purple-200">
            Chiziqli geometriyada (∠Fe−C−N ≈ 178°) birinchi atomdan sochilgan fotoelektron 
            <strong> ikkinchi atomga to'g'ri yo'naladi</strong> — xuddi parabola antennasi kabi.
            Bu MS signalini SS dan <strong>2-3 marta kuchliroq</strong> qiladi.
            Agar burchak 150° gacha kamaysa, fokuslash effekti <strong>keskin zaiflashadi</strong>.
            Bu — EXAFS yordamida <strong>bog' burchaklarini aniqlash</strong> imkonini beradi.
          </p>
        </div>

        <div className="mt-3 bg-purple-900/30 rounded-lg p-4 text-xs">
          <p className="text-purple-400">
            <strong className="text-yellow-400">Matematik asos:</strong> MS nazariyasi 
            <strong> Rehr-Albers matritsasi</strong> orqali hisoblanadi. Har bir sochilish yo'li uchun 
            samarali sochilish amplitudasi <strong>F_eff(k)</strong> va faza siljishi <strong>φ_eff(k)</strong> 
            FEFF dasturi yordamida hisoblanadi. MS yo'llarining soni va intensivligi 
            <strong> geometrik konfiguratsiyaga</strong> kuchli bog'liq.
          </p>
        </div>
      </div>
    </div>
  )
}