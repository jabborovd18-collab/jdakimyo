"use client"

import { yahnTeller } from "../data/cu-h2o6-data"
import { useState } from "react"

export default function YahnTellerSection() {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ Yahn-Teller effekti — [Cu(H₂O)₆]²⁺ da</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">{yahnTeller.title}</strong>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Elektron konfiguratsiya</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-purple-300">dx²−y²:</span>
                <span className="text-red-400 font-mono">↑↓ (2e⁻)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">dz²:</span>
                <span className="text-orange-400 font-mono">↑ (1e⁻)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">dxy, dxz, dyz:</span>
                <span className="text-green-400 font-mono">↑↓ ↑↓ ↑↓ (6e⁻)</span>
              </div>
              <p className="text-purple-500 mt-2">e_g da 3e⁻ — degeneratsiya buziladi!</p>
            </div>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Geometrik oqibat</p>
            <ul className="text-purple-200 space-y-2">
              <li>• <strong>dx²−y² ko'p elektron:</strong> xy ligandlari itariladi → <strong>uzoqroq</strong></li>
              <li>• <strong>dz² kam elektron:</strong> z ligandlari yaqinlashadi → <strong>yaqinroq</strong></li>
              <li>• <strong>Natija:</strong> cho'zilgan oktaedr</li>
              <li>• <strong>Cu−O(ekv):</strong> 1.968 Å (qisqa)</li>
              <li>• <strong>Cu−O(aks):</strong> 2.275 Å (uzun)</li>
              <li>• <strong>Farq:</strong> ΔR = 0.307 Å</li>
            </ul>
          </div>
        </div>

        <button onClick={() => setShowDetails(!showDetails)} className="w-full px-4 py-3 bg-purple-800/40 rounded-lg text-purple-300 text-xs font-semibold hover:bg-purple-700/50 transition-colors mb-4">
          {showDetails ? "▲ Batafsil mexanizmni yashirish" : "▼ Batafsil mexanizmni ko'rish"}
        </button>

        {showDetails && (
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-xs space-y-3 animate-fadeIn">
            <p className="text-purple-200">{yahnTeller.desc}</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-purple-800/30 rounded p-2">
                <p className="text-purple-400">E(cho'zilgan)</p>
                <p className="text-green-400 font-mono">E₀ − ½δ</p>
              </div>
              <div className="bg-purple-800/30 rounded p-2">
                <p className="text-purple-400">Stabillashuv</p>
                <p className="text-yellow-400 font-mono">{yahnTeller.energyGain}</p>
              </div>
              <div className="bg-purple-800/30 rounded p-2">
                <p className="text-purple-400">E(siqilgan)</p>
                <p className="text-red-400 font-mono">E₀ + ½δ</p>
              </div>
            </div>
            <p className="text-purple-200">{yahnTeller.impact}</p>
          </div>
        )}

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 EXAFS uchun ahamiyati:</p>
          <p className="text-purple-200">
            Yahn-Teller effekti tufayli Cu−O masofalari <strong>ikki xil</strong> — 
            bu EXAFS FT spektrida <strong>Cu−O pikining ikkiga ajralishi</strong> sifatida kuzatiladi.
            Bu — Yahn-Teller effektini EXAFS orqali aniqlashning klassik usuli.
          </p>
        </div>
      </div>
    </div>
  )
}