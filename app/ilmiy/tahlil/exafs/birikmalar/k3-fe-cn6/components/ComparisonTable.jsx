"use client"

import { fe2vsFe3 } from "../data/k3-fe-cn6-data"

export default function ComparisonTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚖️ Fe²⁺ vs Fe³⁺ — K₄[Fe(CN)₆] va K₃[Fe(CN)₆] taqqoslanishi</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">[Fe(CN)₆]⁴⁻ va [Fe(CN)₆]³⁻</strong> — 
          koordinatsion kimyoning eng klassik redoks jufti. Bir xil ligand (CN⁻), bir xil geometriya (oktaedrik),
          lekin <strong>bir elektron farqi</strong> barcha xossalarni tubdan o'zgartiradi.
          Bu juftlik <strong>koordinatsion birikmalar kimyosining fundamental qonuniyatlarini</strong> namoyish etadi.
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50 bg-purple-900/30">
                <th className="text-left py-3 px-4 text-yellow-400">Xususiyat</th>
                <th className="text-left py-3 px-4 text-yellow-400">
                  <span className="text-yellow-400">K₄[Fe(CN)₆]</span>
                  <br/><span className="text-yellow-500 text-xs">Sariq qon tuzi</span>
                </th>
                <th className="text-left py-3 px-4 text-yellow-400">
                  <span className="text-red-400">K₃[Fe(CN)₆]</span>
                  <br/><span className="text-red-500 text-xs">Qizil qon tuzi</span>
                </th>
                <th className="text-left py-3 px-4 text-yellow-400">Izoh</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {fe2vsFe3.map((row, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-4"><strong>{row.param}</strong></td>
                  <td className="py-2 px-4 text-yellow-400">{row.fe2}</td>
                  <td className="py-2 px-4 text-red-400">{row.fe3}</td>
                  <td className="py-2 px-4 text-purple-400 text-xs">{i === 0 ? "1 ta elektron farqi" : i === 3 ? "E₀ siljishi" : i === 6 ? "π-backbonding farqi" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Nima uchun Fe−C bog'i uzunroq?</p>
            <p className="text-purple-200">
              <strong>π-backbonding:</strong> Fe²⁺ (t₂g⁶) da to'liq to'lgan t₂g orbitallari 
              CN⁻ ning bo'sh π* orbitallariga elektron beradi → Fe−C bog'i <strong>mustahkamlanadi</strong> va 
              <strong>qisqaradi</strong> (1.918 Å). Fe³⁺ (t₂g⁵) da bitta elektron kam — 
              π-backbonding <strong>zaifroq</strong> → Fe−C <strong>uzunroq</strong> (1.942 Å).
            </p>
          </div>
          <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 font-bold mb-2">Nima uchun rang farqi bor?</p>
            <p className="text-purple-200">
              <strong>LMCT energiyasi:</strong> Fe³⁺ da t₂g orbitallar <strong>pastroq</strong> energiyada 
              (yuqori zaryad tufayli) → LMCT energiyasi <strong>kichikroq</strong> → yutilish 
              <strong> ko'rinadigan sohada</strong> (420 nm, ko'k) → <strong>qizil rang</strong>.
              Fe²⁺ da LMCT UB sohada (320 nm) → <strong>sariq rang</strong>.
            </p>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400 font-bold mb-2">Nima uchun magnit xossalari farq qiladi?</p>
            <p className="text-purple-200">
              CN⁻ <strong>kuchli maydon ligand</strong> — Δ₀ {'>'} P (juftlashish energiyasi).
              Fe²⁺ (d⁶): t₂g⁶ — barcha elektronlar juftlashgan → <strong>diamagnit</strong> (S=0).
              Fe³⁺ (d⁵): t₂g⁵ — 1 ta toq elektron → <strong>paramagnit</strong> (S=1/2).
            </p>
          </div>
          <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 font-bold mb-2">Redoks potensiali</p>
            <p className="text-purple-200">
              <strong>[Fe(CN)₆]³⁻ + e⁻ ⇌ [Fe(CN)₆]⁴⁻</strong><br/>
              <strong>E° = +0.36 V</strong> (SHE).<br/>
              Bu juftlik <strong>elektrokimyoviy standart</strong> sifatida ishlatiladi.
              Qaytariluvchan, tez elektron almashinuvi — ideal redoks jufti.
            </p>
          </div>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Asosiy xulosa:</p>
          <p className="text-purple-200">
            <strong>Bir elektron</strong> farqi — <strong>barcha xossalarni</strong> o'zgartiradi:
            bog' uzunligi, rangi, magnit xossasi, E₀, pre-edge intensivligi.
            Bu — <strong>koordinatsion birikmalar kimyosining eng yorqin namunasidir</strong>.
            Shu sababli, [Fe(CN)₆]³⁻/⁴⁻ juftligi deyarli barcha fizik-kimyoviy usullar uchun
            <strong> etalon tizim</strong> sifatida ishlatiladi.
          </p>
        </div>
      </div>
    </div>
  )
}