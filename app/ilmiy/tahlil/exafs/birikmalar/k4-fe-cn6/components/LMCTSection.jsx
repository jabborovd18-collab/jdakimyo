"use client"

import { useState } from "react"

export default function LMCTSection() {
  const [showSpectrum, setShowSpectrum] = useState(false)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌈 Rang sababi — LMCT va solishtirish</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">K₄[Fe(CN)₆] ning sariq rangi</strong> — 
          d−d o'tishlardan emas (Fe²⁺ LS, t₂g⁶ — barcha orbitallar to'lgan, d−d o'tish yo'q), balki 
          <strong className="text-yellow-400"> LMCT (Ligand-to-Metal Charge Transfer)</strong> dan keladi.
          Elektron CN⁻ ning π orbitallaridan Fe²⁺ ning bo'sh e_g orbitallariga ko'chadi.
          <strong> K₃[Fe(CN)₆] dan farqli</strong> — K₄[Fe(CN)₆] da LMCT UB sohada (~320 nm), 
          shuning uchun ko'rinadigan sohada zaif yutilish → <strong>sariq rang</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold text-sm mb-3">K₄[Fe(CN)₆] — LMCT mexanizmi</p>
            <ul className="text-purple-200 space-y-2">
              <li>• <strong>O'tish:</strong> CN⁻(π) → Fe²⁺(e_g) — LMCT</li>
              <li>• <strong>λ_max:</strong> ~320 nm (UB soha, ko'zga ko'rinmas)</li>
              <li>• <strong>Ko'rinadigan sohada:</strong> Zaif yutilish ~400-450 nm</li>
              <li>• <strong>To'ldiruvchi rang:</strong> Sariq (binafsha yutilishi hisobiga)</li>
              <li>• <strong>Intensivlik:</strong> ε ≈ 500−1 000 M⁻¹sm⁻¹</li>
              <li>• <strong>Laporte:</strong> Ruxsat etilgan (π→d — Δl=1)</li>
            </ul>
          </div>
          <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 font-bold text-sm mb-3">K₃[Fe(CN)₆] — LMCT mexanizmi (solishtirish)</p>
            <ul className="text-purple-200 space-y-2">
              <li>• <strong>O'tish:</strong> CN⁻(π) → Fe³⁺(t₂g) — LMCT</li>
              <li>• <strong>λ_max:</strong> ~420 nm (ko'rinadigan soha)</li>
              <li>• <strong>Ko'rinadigan sohada:</strong> Kuchli yutilish (ko'k nur)</li>
              <li>• <strong>To'ldiruvchi rang:</strong> Qizil (ko'k yutilishi hisobiga)</li>
              <li>• <strong>Intensivlik:</strong> ε ≈ 1 000−2 000 M⁻¹sm⁻¹</li>
              <li>• <strong>Sabab:</strong> Fe³⁺ da t₂g pastroq energiyada</li>
            </ul>
          </div>
        </div>

        {/* Rang vizualizatsiyasi */}
        <div className="bg-purple-900/30 rounded-lg p-4 mb-4">
          <p className="text-yellow-400 font-bold text-xs mb-3">🎨 Rang spektri — nima uchun sariq?</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-purple-400 w-20">Yutiladi:</span>
              <div className="flex-1 h-6 rounded bg-gradient-to-r from-violet-400 to-blue-400"></div>
              <span className="text-xs text-purple-400 w-24">~320-400 nm (UB-binafsha)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-purple-400 w-20">Qaytadi:</span>
              <div className="flex-1 h-6 rounded bg-gradient-to-r from-yellow-300 to-yellow-500"></div>
              <span className="text-xs text-purple-400 w-24">~500-600 nm (sariq)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-purple-400 w-20">Ko'rinadi:</span>
              <div className="w-12 h-12 rounded-full bg-yellow-400 border-2 border-white shadow-lg"></div>
              <span className="text-xs text-yellow-400 font-bold">Sariq rang</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Nima uchun Fe²⁺ LMCT energiyasi yuqoriroq?</p>
            <p className="text-purple-200">
              Fe²⁺ da <strong>yadro zaryadi pastroq</strong> — d-orbitallar yuqoriroq energiyada.
              CN⁻(π) → Fe²⁺(d) orasidagi energiya farqi <strong>kattaroq</strong> → 
              LMCT <strong>UB sohada</strong> (320 nm). Fe³⁺ da d-orbitallar pastroq — 
              LMCT <strong>ko'rinadigan sohada</strong> (420 nm).
            </p>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Nima uchun K₄[Fe(CN)₆] sariq, K₃[Fe(CN)₆] qizil?</p>
            <p className="text-purple-200">
              <strong>Sariq:</strong> binafsha/UB yutilishi → sariq qaytadi.<br/>
              <strong>Qizil:</strong> ko'k yutilishi (420 nm) → qizil qaytadi.<br/>
              Bir elektron farqi LMCT energiyasini <strong>~100 nm ga siljitadi</strong> — 
              bu rang farqini keltirib chiqaradi.
            </p>
          </div>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Amaliy ahamiyati:</p>
          <p className="text-purple-200">
            K₄[Fe(CN)₆] (sariq) va K₃[Fe(CN)₆] (qizil) orasidagi rang farqi 
            <strong> Fe²⁺/Fe³⁺ redoks juftining vizual indikatori</strong> sifatida ishlatiladi.
            Eritmada rang o'zgarishi oksidlanish-qaytarilish jarayonini kuzatish imkonini beradi.
            Bu juftlik analitik kimyoda <strong>redoks titrlash</strong> uchun standart hisoblanadi.
          </p>
        </div>
      </div>
    </div>
  )
}