"use client"

export default function LMCTSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌈 Rang sababi — LMCT (Ligand → Metall zaryad ko'chishi)</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">K₃[Fe(CN)₆] ning to'q qizil rangi</strong> — 
          d−d o'tishlardan emas (ular Laporte taqiqlangan va kuchsiz), balki 
          <strong className="text-red-400"> LMCT (Ligand-to-Metal Charge Transfer)</strong> dan keladi.
          Elektron CN⁻ ning π orbitallaridan Fe³⁺ ning bo'sh t₂g orbitallariga ko'chadi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
          <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 font-bold text-sm mb-2">LMCT mexanizmi</p>
            <ul className="text-purple-200 space-y-1">
              <li>• <strong>O'tish:</strong> CN⁻(π) → Fe³⁺(t₂g)</li>
              <li>• <strong>λ_max:</strong> ~420 nm (ko'k-binafsha yutilishi)</li>
              <li>• <strong>To'ldiruvchi rang:</strong> Qizil-to'q sariq (yutilgan ko'k nur o'rniga)</li>
              <li>• <strong>Intensivlik:</strong> ε ≈ 1 000−2 000 M⁻¹sm⁻¹</li>
              <li>• <strong>Laporte:</strong> Ruxsat etilgan (π→d — Δl=1)</li>
            </ul>
          </div>
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold text-sm mb-2">Fe²⁺ vs Fe³⁺ — rang farqi</p>
            <ul className="text-purple-200 space-y-1">
              <li>• <strong>K₄[Fe(CN)₆] (Fe²⁺):</strong> Sariq rang</li>
              <li>• <strong>LMCT energiyasi:</strong> Fe³⁺ da pastroq (420 nm), Fe²⁺ da yuqoriroq (320 nm)</li>
              <li>• <strong>Sababi:</strong> Fe³⁺ da t₂g orbitallar pastroq energiyada</li>
              <li>• <strong>Natija:</strong> Fe³⁺ — qizil, Fe²⁺ — sariq</li>
            </ul>
          </div>
        </div>

        <div className="bg-purple-900/30 rounded-lg p-4 text-xs">
          <p className="text-yellow-400 font-bold mb-2">🧪 Nima uchun bu muhim?</p>
          <p className="text-purple-200">
            LMCT energiyasi <strong>metall oksidlanish darajasiga bevosita bog'liq</strong>.
            K₃[Fe(CN)₆] ning qizil rangi va K₄[Fe(CN)₆] ning sariq rangi orasidagi farq —
            <strong>Fe³⁺/Fe²⁺ redoks juftining UB-Vis spektroskopik indikatori</strong>.
            Shu sababli, bu juftlik elektrokimyoviy va analitik kimyoda keng qo'llaniladi.
          </p>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-red-600/10 border border-red-500/30 rounded p-2">
            <p className="text-red-400 font-bold">K₃[Fe(CN)₆]</p>
            <p className="text-purple-300">Fe³⁺ (t₂g⁵)</p>
            <p className="text-purple-400">λ = 420 nm</p>
            <p className="text-red-400 font-bold">🔴 Qizil</p>
          </div>
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-2">
            <p className="text-yellow-400 font-bold">K₄[Fe(CN)₆]</p>
            <p className="text-purple-300">Fe²⁺ (t₂g⁶)</p>
            <p className="text-purple-400">λ = 320 nm</p>
            <p className="text-yellow-400 font-bold">🟡 Sariq</p>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/30 rounded p-2">
            <p className="text-blue-400 font-bold">Farq</p>
            <p className="text-purple-300">Δλ ≈ 100 nm</p>
            <p className="text-purple-400">ΔE ≈ 0.9 eV</p>
            <p className="text-blue-400 font-bold">Oksidlanish indikatori</p>
          </div>
        </div>
      </div>
    </div>
  )
}