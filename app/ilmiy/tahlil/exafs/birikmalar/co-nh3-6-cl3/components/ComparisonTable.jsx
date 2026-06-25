"use client"

import { comparisonData } from "../data/co-nh3-6-cl3-data"
import { useState } from "react"

export default function ComparisonTable() {
  const [highlight, setHighlight] = useState(null)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚖️ Co³⁺ vs Co²⁺ — to'liq taqqoslash</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Co³⁺ va Co²⁺</strong> — 
          kobaltning eng muhim ikki oksidlanish darajasi. Co³⁺ (d⁶) — deyarli har doim 
          <strong> past spinli va oktaedrik</strong>. Co²⁺ (d⁷) — 
          <strong> yuqori yoki past spinli</strong> bo'lishi mumkin.
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50 bg-purple-900/30">
                <th className="text-left py-3 px-4 text-yellow-400">Parametr</th>
                <th className="text-left py-3 px-4 text-blue-400 bg-blue-600/5">Co³⁺</th>
                <th className="text-left py-3 px-4 text-pink-400 bg-pink-600/5">Co²⁺</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {comparisonData.map((row, i) => (
                <tr key={i} className={`border-b border-purple-800/30 cursor-pointer ${highlight === i ? "bg-yellow-600/10" : "hover:bg-purple-800/20"}`}
                  onClick={() => setHighlight(highlight === i ? null : i)}>
                  <td className="py-2 px-4"><strong>{row.param}</strong></td>
                  <td className="py-2 px-4 text-blue-400">{row.co3}</td>
                  <td className="py-2 px-4 text-pink-400">{row.co2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {highlight !== null && (
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-xs">
            <p className="text-yellow-400 font-bold mb-2">📖 {comparisonData[highlight].param}</p>
            <p className="text-purple-200">{getExplanation(highlight)}</p>
          </div>
        )}

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs mt-4">
          <p className="text-yellow-400 font-bold mb-1">💡 Asosiy farq:</p>
          <p className="text-purple-200">
            Co³⁺ — <strong>inert (kinetik barqaror)</strong>, Co²⁺ — <strong>labil (tez almashinadi)</strong>.
            Bu farq CFSE bilan izohlanadi: Co³⁺ (LS, d⁶) da CFSE = −2.4Δ₀ — juda katta.
            Co²⁺ (HS, d⁷) da CFSE = −0.8Δ₀ — kichikroq. Shuning uchun Co³⁺ komplekslari
            <strong> sekin hosil bo'ladi, lekin juda barqaror</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

function getExplanation(index) {
  const explanations = [
    "Co³⁺ (+3) — yuqori zaryad, kichik ion radiusi (61 pm). Co²⁺ (+2) — pastroq zaryad, kattaroq radius (75 pm). Zaryad farqi koordinatsion son va geometriyaga ta'sir qiladi.",
    "Co³⁺ (d⁶) — kuchli maydon ligandlari bilan har doim LS (t₂g⁶). Co²⁺ (d⁷) — HS yoki LS bo'lishi mumkin. NH₃ bilan Co²⁺ HS (t₂g⁵ e_g²), CN⁻ bilan LS (t₂g⁶ e_g¹).",
    "Co³⁺ (LS, t₂g⁶): S=0, diamagnit. Co²⁺ (HS): S=3/2, paramagnit (μ≈3.87 μB). Co²⁺ (LS): S=1/2, paramagnit (μ≈1.73 μB).",
    "Co³⁺: diamagnit — magnit maydonga tortilmaydi. Co²⁺: paramagnit — tortiladi. Bu farq Gui usuli bilan oson aniqlanadi.",
    "Co³⁺: KS=6 (oktaedrik) — deyarli har doim. Co²⁺: KS=4 (tetraedrik) yoki 6 (oktaedrik). [CoCl₄]²⁻ — tetraedrik, [Co(H₂O)₆]²⁺ — oktaedrik.",
    "Co³⁺: sariq-to'q sariq (d−d + LMCT). Co²⁺: pushti (oktaedrik, [Co(H₂O)₆]²⁺) yoki ko'k (tetraedrik, [CoCl₄]²⁻). Rang farqi geometriya va Δ ga bog'liq.",
    "Co³⁺: 7727.5 eV. Co²⁺: 7725.5 eV. Farq ~2 eV — oksidlanish darajasini aniqlash uchun yetarli.",
    "Co³⁺: ~0.03−0.05 (juda kuchsiz). Co²⁺: ~0.08−0.15 (kuchliroq). Sababi: Co²⁺ da bo'sh d-orbitallar ko'proq.",
    "Co³⁺: Δ₀ ≈ 23 000 sm⁻¹ (katta). Co²⁺: Δ₀ ≈ 9 000−12 000 sm⁻¹. CN⁻ > NH₃ > H₂O > Cl⁻ tartibida kamayadi.",
    "Co³⁺: inert — ligand almashinishi sekin (soat/kun). Co²⁺: labil — ligand almashinishi tez (sekund/minut). CFSE farqi tufayli.",
  ]
  return explanations[index] || ""
}