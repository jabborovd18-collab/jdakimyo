"use client"

import { epr } from "../data/cr-h2o6-data"

export default function EPRSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧲 EPR spektroskopiyasi — [Cr(H₂O)₆]³⁺</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Cr³⁺ (S=3/2)</strong> — 
          EPR signali <strong>xona haroratida ham</strong> kuzatiladi.
          Oktaedrik simmetriya — <strong>g-faktor izotrop</strong> (g ≈ 1.98).
          Nol-maydon ajralishi (ZFS) kichik — bu Cr³⁺ uchun xarakterli.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">g-faktor</p>
            <p className="text-emerald-400 text-lg font-bold font-mono">{epr.gFactor}</p>
            <p className="text-purple-500 text-xs mt-2">Izotrop (O_h)</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">O'ta nozik tuzilish</p>
            <p className="text-yellow-400 text-lg font-bold font-mono">{epr.hyperfine}</p>
            <p className="text-purple-500 text-xs mt-2">⁵³Cr (I=3/2)</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-400 text-xs mb-2">Sharoit</p>
            <p className="text-green-400 text-sm">{epr.condition}</p>
            <p className="text-purple-500 text-xs mt-2">ZFS kichik</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Nima uchun g ≈ 1.98?</p>
            <p className="text-purple-200">
              Cr³⁺ (d³) — t₂g yarim to'lgan. Orbital burchak momenti 
              <strong> "muzlatilgan"</strong> (L=0 effektiv). g-faktor 
              <strong> erkin elektron qiymatiga yaqin</strong> (g_e = 2.0023).
              g ≈ 1.98 — spin-orbita bog'lanishi tufayli kichik siljish.
              Oktaedrik simmetriya — <strong>g_x ≈ g_y ≈ g_z</strong> (izotrop).
            </p>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">ZFS nima uchun kichik?</p>
            <p className="text-purple-200">
              Cr³⁺ (S=3/2) da nol-maydon ajralishi parametri D ≈ 0.1−0.5 sm⁻¹.
              <strong>Oktaedrik simmetriya</strong> deyarli mukammal — 
              elektr maydon gradienti kichik. Taqqoslash: Co²⁺ (T_d) da D ≈ 5−15 sm⁻¹.
              Kichik ZFS tufayli <strong>xona haroratida ham signal</strong> kuzatiladi.
            </p>
          </div>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Cr³⁺ — EPR uchun ideal:</p>
          <p className="text-purple-200">
            Cr³⁺ (d³, S=3/2) — xona haroratida EPR signali beradigan kam sonli metallardan biri.
            Izotrop g-faktor, kichik ZFS, o'ta nozik tuzilish — 
            <strong> Cr³⁺ EPR standarti</strong> sifatida ishlatiladi.
          </p>
        </div>
      </div>
    </div>
  )
}