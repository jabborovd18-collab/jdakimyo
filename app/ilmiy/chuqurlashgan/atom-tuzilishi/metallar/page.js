"use client"

import Link from "next/link"
import { useState } from "react"

// ============================================================================
// INTERAKTIV DAVRIY JADVAL
// ============================================================================
function DavriyJadvalInteraktiv() {
  const [selected, setSelected] = useState(null)
  
  const metals3d = [
    { symbol: "Sc", z: 21, config: "d¹", ks: "6", note: "Skandiy — kuchsiz komplekslar" },
    { symbol: "Ti", z: 22, config: "d²", ks: "6", note: "Titan — Ti³⁺/Ti⁴⁺, oksidlar" },
    { symbol: "V", z: 23, config: "d³", ks: "4-6", note: "Vanadiy — turli rangdagi komplekslar" },
    { symbol: "Cr", z: 24, config: "d³-d⁶", ks: "6", note: "Xrom — eng barqaror Cr³⁺, yashil/binafsha" },
    { symbol: "Mn", z: 25, config: "d⁵", ks: "6", note: "Marganes — Mn²⁺(HS) rangsiz, Mn⁷⁺ binafsha" },
    { symbol: "Fe", z: 26, config: "d⁶", ks: "4-6", note: "Temir — gemoglobin, ferrosen, eng muhim!" },
    { symbol: "Co", z: 27, config: "d⁷", ks: "4-6", note: "Kobalt — Co³⁺(LS) Verner, B₁₂ vitamini" },
    { symbol: "Ni", z: 28, config: "d⁸", ks: "4-6", note: "Nikel — kvadrat tekislik yoki oktaedr" },
    { symbol: "Cu", z: 29, config: "d⁹", ks: "4-6", note: "Mis — Jahn-Teller, havorang, Cu²⁺/Cu⁺" },
    { symbol: "Zn", z: 30, config: "d¹⁰", ks: "4", note: "Rux — rangsiz, tetraedrik, karboangidraza" },
  ]

  const metals4d = [
    { symbol: "Ru", z: 44, config: "d⁶", ks: "6", note: "Ruteniy — fotokimyo, [Ru(bpy)₃]²⁺" },
    { symbol: "Rh", z: 45, config: "d⁶", ks: "6", note: "Rodiy — faqat LS, katalizator" },
    { symbol: "Pd", z: 46, config: "d⁸", ks: "4", note: "Palladiy — tekis kvadrat, katalizator" },
    { symbol: "Ag", z: 47, config: "d¹⁰", ks: "2", note: "Kumush — chiziqli, Ag⁺ antimikrob" },
    { symbol: "Cd", z: 48, config: "d¹⁰", ks: "4", note: "Kadmiy — tetraedrik, zaharli" },
  ]

  const metals5d = [
    { symbol: "Os", z: 76, config: "d⁶", ks: "6", note: "Osmiy — eng inert, NIR emissiya" },
    { symbol: "Ir", z: 77, config: "d⁶", ks: "6", note: "Iridiy — OLED, TADF, [Ir(ppy)₃]" },
    { symbol: "Pt", z: 78, config: "d⁸", ks: "4", note: "Platina — sisplatin! Saraton davosi" },
    { symbol: "Au", z: 79, config: "d⁸-d¹⁰", ks: "4", note: "Oltin — auronofin, revmatoid artrit" },
    { symbol: "Hg", z: 80, config: "d¹⁰", ks: "2-4", note: "Simob — chiziqli, zaharli" },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🗺️ Interaktiv metallar jadvali</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        {/* 3d metallar */}
        <div className="mb-6">
          <h4 className="text-green-400 font-bold text-xs mb-3">3d metallar (birinchi qator)</h4>
          <div className="flex flex-wrap gap-2">
            {metals3d.map((m, i) => (
              <button
                key={i}
                onClick={() => setSelected(selected?.symbol === m.symbol ? null : m)}
                className={`px-4 py-3 rounded-xl text-center transition-all hover:scale-110 ${
                  selected?.symbol === m.symbol 
                    ? "bg-green-600/40 border-2 border-green-400 scale-110" 
                    : "bg-purple-900/50 border border-purple-700/30"
                }`}
              >
                <p className="text-white font-bold text-sm">{m.symbol}</p>
                <p className="text-purple-400 text-xs">{m.z}</p>
                <p className="text-green-400 text-xs">{m.config}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 4d metallar */}
        <div className="mb-6">
          <h4 className="text-blue-400 font-bold text-xs mb-3">4d metallar (ikkinchi qator)</h4>
          <div className="flex flex-wrap gap-2">
            {metals4d.map((m, i) => (
              <button
                key={i}
                onClick={() => setSelected(selected?.symbol === m.symbol ? null : m)}
                className={`px-4 py-3 rounded-xl text-center transition-all hover:scale-110 ${
                  selected?.symbol === m.symbol 
                    ? "bg-blue-600/40 border-2 border-blue-400 scale-110" 
                    : "bg-purple-900/50 border border-purple-700/30"
                }`}
              >
                <p className="text-white font-bold text-sm">{m.symbol}</p>
                <p className="text-purple-400 text-xs">{m.z}</p>
                <p className="text-blue-400 text-xs">{m.config}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 5d metallar */}
        <div className="mb-4">
          <h4 className="text-purple-400 font-bold text-xs mb-3">5d metallar (uchinchi qator)</h4>
          <div className="flex flex-wrap gap-2">
            {metals5d.map((m, i) => (
              <button
                key={i}
                onClick={() => setSelected(selected?.symbol === m.symbol ? null : m)}
                className={`px-4 py-3 rounded-xl text-center transition-all hover:scale-110 ${
                  selected?.symbol === m.symbol 
                    ? "bg-purple-600/40 border-2 border-purple-400 scale-110" 
                    : "bg-purple-900/50 border border-purple-700/30"
                }`}
              >
                <p className="text-white font-bold text-sm">{m.symbol}</p>
                <p className="text-purple-400 text-xs">{m.z}</p>
                <p className="text-purple-400 text-xs">{m.config}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tanlangan metall haqida */}
        {selected && (
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-yellow-400">{selected.symbol}</span>
              <span className="text-purple-400">Z={selected.z}</span>
              <span className="text-purple-400">Konfig: {selected.config}</span>
              <span className="text-purple-400">KS: {selected.ks}</span>
            </div>
            <p className="text-purple-200 text-xs">{selected.note}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// 3D vs 4D vs 5D TAQQOSLASH
// ============================================================================
function DavrTaqqoslash() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚖️ 3d vs 4d vs 5d — taqqoslash</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-3 text-yellow-400">Xususiyat</th>
                <th className="text-left py-3 px-3 text-green-400">3d metallar</th>
                <th className="text-left py-3 px-3 text-blue-400">4d metallar</th>
                <th className="text-left py-3 px-3 text-purple-400">5d metallar</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Ion radiusi", "Kichik (60-80 pm)", "O'rtacha (70-90 pm)", "Katta (70-100 pm)"],
                ["Odatiy KS", "4, 6", "6, 7", "6, 7, 8, 9"],
                ["Δ₀ (nisbiy)", "Kichik (~10 000 sm⁻¹)", "Katta (~20 000 sm⁻¹)", "Juda katta (~30 000 sm⁻¹)"],
                ["Spin holati", "HS yoki LS", "Asosan LS", "Faqat LS"],
                ["Kinetik inertlik", "Labil (tez almashinadi)", "Inert (sekin)", "Juda inert (eng sekin)"],
                ["Rang intensivligi", "Kuchsiz-o'rtacha", "Kuchli (MLCT)", "Juda kuchli (SOC)"],
                ["Lyuminessensiya", "Kam uchraydi (Fe — yo'q)", "Bor (Ru — τ~1μs)", "Kuchli (Os, Ir)"],
                ["SOC (ξ, sm⁻¹)", "Kuchsiz (~400)", "Kuchli (~1000)", "Juda kuchli (~3000-4000)"],
                ["Eng muhim metall", "Fe (gemoglobin)", "Ru (fotokataliz)", "Pt (sisplatin), Ir (OLED)"],
                ["Misol kompleks", "[Fe(H₂O)₆]²⁺", "[Ru(bpy)₃]²⁺", "[Ir(ppy)₃]"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-3"><strong>{row[0]}</strong></td>
                  <td className="py-2 px-3">{row[1]}</td>
                  <td className="py-2 px-3">{row[2]}</td>
                  <td className="py-2 px-3">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// IRVING-WILLIAMS QATORI
// ============================================================================
function IrvingWilliams() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📈 Irving-Williams qatori — barqarorlik</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Irving-Williams qatori</strong> — 
          ikki valentli 3d metallar komplekslarining barqarorlik tartibi.
          Bu qator <strong>CFSE va ion radiusi</strong> bilan izohlanadi.
        </p>

        <div className="flex items-end gap-1 h-24 mb-4">
          {[
            { metal: "Mn²⁺", value: 1, color: "bg-gray-400" },
            { metal: "Fe²⁺", value: 1.5, color: "bg-yellow-500" },
            { metal: "Co²⁺", value: 2, color: "bg-orange-500" },
            { metal: "Ni²⁺", value: 2.5, color: "bg-green-500" },
            { metal: "Cu²⁺", value: 4, color: "bg-blue-500" },
            { metal: "Zn²⁺", value: 1.2, color: "bg-gray-500" },
          ].map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className={`w-full ${item.color} rounded-t`} style={{ height: `${item.value * 20}%` }}></div>
              <span className="text-xs text-purple-300 mt-1">{item.metal}</span>
            </div>
          ))}
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">Qator:</p>
          <p className="text-purple-200 font-mono">
            Mn²⁺ {'<'} Fe²⁺ {'<'} Co²⁺ {'<'} Ni²⁺ {'<'} <strong className="text-blue-400">Cu²⁺</strong> {'>'} Zn²⁺
          </p>
          <p className="text-purple-400 mt-1">
            Cu²⁺ eng barqaror komplekslar hosil qiladi (Jahn-Teller stabillashuvi). 
            Zn²⁺ da CFSE=0 — barqarorlik pasayadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function KompleksMetallar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300">Chuqurlashgan</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="text-purple-400 hover:text-purple-300">Atom tuzilishi</Link>
          <span className="text-purple-600">›</span>
          <span className="text-red-400">Kompleks metallar</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🧲 Kompleks hosil qiluvchi metallar</h1>
          <p className="text-purple-400 text-sm">3d, 4d, 5d elementlari • Ion radiusi • Irving-Williams • Davr taqqoslash</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Kompleks hosil qiluvchi metallar haqida</h2>
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">d-elementlar</strong> — kompleks birikmalarning asosiy markaziy atomlari.
              Ular <strong className="text-yellow-400">bo'sh d-orbitallarga</strong> ega bo'lgani uchun ligandlardan 
              elektron juftlarini qabul qiladi (Lyuis kislotasi). 3d, 4d va 5d elementlari orasida kompleks hosil qilish 
              qobiliyati <strong>ion radiusi, zaryad, elektron konfiguratsiya va CFSE</strong> ga bog'liq.
            </p>
          </div>
        </div>

        {/* INTERAKTIV DAVRIY JADVAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <DavriyJadvalInteraktiv />
        </div>

        {/* DAVR TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <DavrTaqqoslash />
        </div>

        {/* IRVING-WILLIAMS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <IrvingWilliams />
        </div>

        {/* ION RADIUSI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📏 Ion radiusining KS ga ta'siri</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
                <p className="text-green-400 font-bold text-lg">3d metallar</p>
                <p className="text-purple-300 mt-2">Kichik radius (60-80 pm)</p>
                <p className="text-white font-bold mt-2">KS = 4 yoki 6</p>
                <p className="text-purple-400 text-xs mt-2">Ti³⁺ (67), Cr³⁺ (62), Fe²⁺ (78)</p>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
                <p className="text-blue-400 font-bold text-lg">4d metallar</p>
                <p className="text-purple-300 mt-2">O'rtacha radius (70-90 pm)</p>
                <p className="text-white font-bold mt-2">KS = 6 yoki 7</p>
                <p className="text-purple-400 text-xs mt-2">Ru²⁺ (72), Rh³⁺ (67), Pd²⁺ (86)</p>
              </div>
              <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
                <p className="text-purple-400 font-bold text-lg">5d metallar</p>
                <p className="text-purple-300 mt-2">Katta radius (70-100 pm)</p>
                <p className="text-white font-bold mt-2">KS = 6, 7, 8, 9</p>
                <p className="text-purple-400 text-xs mt-2">Pt²⁺ (80), Au³⁺ (85), Hg²⁺ (102)</p>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>3d metallar — <strong className="text-green-400">eng ko'p o'rganilgan</strong>, KS asosan 4 yoki 6, HS/LS</li>
            <li>4d/5d metallar — <strong className="text-blue-400">katta ion radiusi</strong>, yuqori KS, asosan LS, inert</li>
            <li><strong className="text-yellow-400">Irving-Williams qatori:</strong> Mn²⁺ {'<'} Fe²⁺ {'<'} Co²⁺ {'<'} Ni²⁺ {'<'} Cu²⁺ {'>'} Zn²⁺</li>
            <li><strong className="text-red-400">Eng muhim metallar:</strong> Fe (gemoglobin), Ru (fotokataliz), Pt (sisplatin), Ir (OLED)</li>
            <li>Ion radiusi ortishi bilan <strong className="text-yellow-400">KS ham ortadi</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/elektron-konfig" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Elektron konfiguratsiyalar</Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Atom tuzilishi →</Link>
        </div>

      </section>
    </main>
  )
}