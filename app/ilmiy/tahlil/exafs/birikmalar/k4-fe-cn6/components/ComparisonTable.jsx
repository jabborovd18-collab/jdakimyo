"use client"

import { fe2vsFe3 } from "../data/k4-fe-cn6-data"
import { useState } from "react"

export default function ComparisonTable() {
  const [highlight, setHighlight] = useState(null)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚖️ K₄[Fe(CN)₆] vs K₃[Fe(CN)₆] — to'liq taqqoslash</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">[Fe(CN)₆]⁴⁻ va [Fe(CN)₆]³⁻</strong> — 
          koordinatsion kimyoning eng klassik redoks jufti. Bir xil ligand (CN⁻), bir xil geometriya (oktaedrik),
          lekin <strong>bir elektron farqi</strong> deyarli barcha fizik-kimyoviy xossalarni tubdan o'zgartiradi.
          Quyidagi jadvalda har bir parametr bo'yicha solishtirish keltirilgan.
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50 bg-purple-900/30">
                <th className="text-left py-3 px-4 text-yellow-400">Parametr</th>
                <th className="text-left py-3 px-4 text-yellow-400 bg-yellow-600/5">
                  <span className="text-yellow-400">K₄[Fe(CN)₆]</span>
                  <br/><span className="text-yellow-500 text-xs">Sariq qon tuzi</span>
                </th>
                <th className="text-left py-3 px-4 text-yellow-400 bg-red-600/5">
                  <span className="text-red-400">K₃[Fe(CN)₆]</span>
                  <br/><span className="text-red-500 text-xs">Qizil qon tuzi</span>
                </th>
                <th className="text-left py-3 px-4 text-yellow-400">Farq sababi</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {fe2vsFe3.map((row, i) => (
                <tr 
                  key={i} 
                  className={`border-b border-purple-800/30 transition-colors cursor-pointer ${
                    highlight === i ? "bg-yellow-600/10" : "hover:bg-purple-800/20"
                  }`}
                  onClick={() => setHighlight(highlight === i ? null : i)}
                >
                  <td className="py-2 px-4"><strong>{row.param}</strong></td>
                  <td className="py-2 px-4 text-yellow-400 bg-yellow-600/5">{row.fe2}</td>
                  <td className="py-2 px-4 text-red-400 bg-red-600/5">{row.fe3}</td>
                  <td className="py-2 px-4 text-purple-400 text-xs">{getExplanation(i)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tanlangan qator tushuntirishi */}
        {highlight !== null && (
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-xs animate-fadeIn">
            <p className="text-yellow-400 font-bold mb-2">📖 {fe2vsFe3[highlight].param} — batafsil</p>
            <p className="text-purple-200">{getDetailedExplanation(highlight)}</p>
          </div>
        )}

        <p className="text-purple-500 text-xs mt-3 text-center">
          📌 Qatorga bosing — batafsil tushuntirishni ko'ring
        </p>
      </div>
    </div>
  )
}

function getExplanation(index) {
  const explanations = [
    "1 ta elektron farqi — barcha xossalarni o'zgartiradi",
    "CN⁻ kuchli maydon — LS holat. Fe²⁺: 6e⁻ juftlashgan, Fe³⁺: 5e⁻, 1 toq",
    "Fe²⁺: barcha spin juftlashgan (S=0). Fe³⁺: 1 toq e⁻ (S=1/2)",
    "Fe³⁺ da 1s elektron kuchliroq bog'langan — E₀ yuqori",
    "Fe³⁺ da bo'sh t₂g o'rni bor — pre-edge energiyasi yuqoriroq",
    "Fe²⁺ (t₂g⁶): bo'sh o'rin yo'q → pre-edge deyarli yo'q. Fe³⁺ (t₂g⁵): 5-10× kuchli",
    "Fe²⁺ da π-backbonding kuchliroq → bog' qisqaroq",
    "Fe³⁺ da 4p orbitallar pastroq → o'tish ehtimoli yuqori",
    "Fe²⁺ da LMCT UB da (320 nm) → sariq. Fe³⁺ da ko'rinadigan sohada (420 nm) → qizil",
    "Fe²⁺ (t₂g⁶): simmetriya mukammal → δ musbatroq",
    "Fe²⁺: Yahn-Teller yo'q → ΔE_Q = 0. Fe³⁺: buzilish → ΔE_Q = 0.38",
    "Fe²⁺: S=0 → EPR signali yo'q. Fe³⁺: S=1/2 → kuchli EPR",
  ]
  return explanations[index] || ""
}

function getDetailedExplanation(index) {
  const details = [
    "[Fe(CN)₆]⁴⁻ + oksidlovchi → [Fe(CN)₆]³⁻ + e⁻. Bu redoks jufti E° = +0.36 V potensialga ega va elektrokimyoviy standart sifatida ishlatiladi. Bir elektron farqi barcha spektroskopik xossalarni o'zgartiradi — bu koordinatsion kimyoning fundamental qonuniyatidir.",
    
    "CN⁻ — kuchli maydon ligand (spektrokimyoviy qatorda eng yuqorida). Δ₀ > P (juftlashish energiyasi) bo'lgani uchun ikkala kompleks ham past spinli. Fe²⁺ (d⁶): t₂g⁶ — barcha elektronlar juftlashgan. Fe³⁺ (d⁵): t₂g⁵ — 1 ta toq elektron. Spin holati farqi magnit xossalar, EPR va Mössbauer spektrlarida yaqqol ko'rinadi.",
    
    "Fe²⁺ (S=0): diamagnit — magnit maydonga tortilmaydi. Fe³⁺ (S=1/2): paramagnit — magnit maydonga tortiladi. Bu farq magnit sezgirlik o'lchashlari bilan oson aniqlanadi. K₃[Fe(CN)₆] ning paramagnitligi YaMR spektrlarida keng signal sifatida namoyon bo'ladi.",
    
    "XANES da yutilish chegarasi (E₀) oksidlanish darajasiga bevosita bog'liq. Fe³⁺ da yadro zaryadi yuqoriroq — 1s elektron kuchliroq bog'langan, ionlashuvi uchun ko'proq energiya kerak. Har bir oksidlanish darajasi uchun ~1-2 eV siljish kuzatiladi. Bu — XANES ning oksidlanish darajasini aniqlashdagi asosiy qo'llanilishi.",
    
    "Pre-edge energiyasi ham oksidlanish darajasiga bog'liq. Fe³⁺ da d-orbitallar pastroq energiyada — 1s va 3d orasidagi farq kattaroq. Ammo asosiy omil — intensivlik farqi: Fe²⁺ da bo'sh 3d o'rin yo'qligi tufayli pre-edge deyarli ko'rinmaydi.",
    
    "Bu — K₄[Fe(CN)₆] va K₃[Fe(CN)₆] ni farqlashning eng ishonchli XANES usuli. Fe²⁺ pre-edge intensivligi 0.02−0.05 (shovqin darajasida), Fe³⁺ esa 0.18−0.25 (aniq ko'rinadi). Farq 5-10 marta. Sababi: Pauli prinsipi — bo'sh o'rin bo'lmasa, 1s→3d o'tish taqiqlangan.",
    
    "π-backbonding: metallning to'ldirilgan t₂g orbitallaridan ligandning bo'sh π* orbitallariga elektron ko'chishi. Fe²⁺ (t₂g⁶) da 6 ta elektron — kuchli π-backbonding. Fe³⁺ (t₂g⁵) da 5 ta elektron — zaifroq. π-backbonding Fe−C bog'ini mustahkamlaydi va qisqartiradi. Bu — koordinatsion kimyoning asosiy tushunchalaridan biri.",
    
    "Oq chiziq (white line) — 1s → 4p o'tish. Fe³⁺ da 4p orbitallar pastroq energiyada (yuqori zaryad tufayli) — o'tish ehtimoli yuqori. Shuningdek, liganddan metallga zaryad ko'chishi (shakedown) ham Fe³⁺ da kuchliroq.",
    
    "LMCT energiyasi metall d-orbitallarining energiyasiga bog'liq. Fe³⁺ da d-orbitallar pastroq (yuqori zaryad) → LMCT energiyasi kichikroq → yutilish ko'rinadigan sohada (420 nm, ko'k). Fe²⁺ da d-orbitallar yuqoriroq → LMCT energiyasi kattaroq → yutilish UB sohada (320 nm). Ko'rinadigan sohada zaif yutilish sariq rang beradi.",
    
    "Mössbauer izomer siljishi (δ) yadro atrofidagi s-elektron zichligiga bog'liq. Fe²⁺ da yadro zaryadi pastroq — s-elektronlar yadrodan uzoqroq — δ musbatroq (−0.04 vs −0.12 mm/s). CN⁻ kuchli σ-donor bo'lgani uchun ikkala kompleksda ham δ manfiy.",
    
    "Kvadrupol ajralish (ΔE_Q) elektr maydon gradienti (EFG) ga bog'liq. Fe²⁺ (t₂g⁶) da barcha t₂g orbitallar teng to'lgan — EFG = 0, ΔE_Q = 0. Fe³⁺ (t₂g⁵) da Yahn-Teller buzilishi tufayli simmetriya pasaygan — EFG ≠ 0, ΔE_Q = 0.38 mm/s.",
    
    "EPR faqat toq elektronli tizimlarda signal beradi. Fe²⁺ (S=0) — EPR signali yo'q. Fe³⁺ (S=1/2) — kuchli EPR signali, xona haroratida ham kuzatiladi. g-faktor anizotropiyasi (g₁≠g₂≠g₃) Yahn-Teller buzilishini ko'rsatadi.",
  ]
  return details[index] || ""
}