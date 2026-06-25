"use client"

import { mossbauer } from "../data/co-nh3-6-cl3-data"

export default function MossbauerSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔴 Mössbauer va magnit xossalari — [Co(NH₃)₆]Cl₃</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">⁵⁷Co Mössbauer spektroskopiyasi</strong> — 
          {mossbauer.note}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Magnit xossalari</p>
            <ul className="text-purple-200 space-y-2">
              <li>• <strong>Co³⁺ (LS, d⁶):</strong> t₂g⁶ — barcha elektronlar juftlashgan</li>
              <li>• <strong>Spin:</strong> S = 0 — diamagnit</li>
              <li>• <strong>Magnit moment:</strong> μ = 0 μB</li>
              <li>• <strong>EPR:</strong> Signal yo'q (S=0)</li>
            </ul>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Solishtirish: Co²⁺</p>
            <ul className="text-purple-200 space-y-2">
              <li>• <strong>Co²⁺ (HS, d⁷):</strong> t₂g⁵ e_g² — 3 ta toq elektron</li>
              <li>• <strong>Spin:</strong> S = 3/2 — paramagnit</li>
              <li>• <strong>Magnit moment:</strong> μ ≈ 3.87 μB</li>
              <li>• <strong>EPR:</strong> Kuchli signal (S=3/2)</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Co³⁺ vs Co²⁺ — Verner tajribasi:</p>
          <p className="text-purple-200">
            Verner aynan shu magnit farqi orqali Co³⁺ (diamagnit) va Co²⁺ (paramagnit) ni 
            farqlagan. [Co(NH₃)₆]Cl₃ — diamagnit, [CoCl₄]²⁻ — paramagnit.
            Bu — <strong>koordinatsion nazariyaning g'alabasi</strong> edi.
          </p>
        </div>

        <div className="mt-3 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Verner va Nobel mukofoti:</p>
          <p className="text-purple-200">
            Alfred Werner 1893-yilda koordinatsion nazariyani taklif qildi. 
            [Co(NH₃)₆]Cl₃ — bu nazariyaning <strong>eng muhim dalili</strong> bo'lgan.
            Werner 1913-yilda <strong>Nobel mukofoti</strong> ga sazovor bo'ldi — 
            koordinatsion birikmalar kimyosi bo'yicha birinchi Nobel.
          </p>
        </div>
      </div>
    </div>
  )
}