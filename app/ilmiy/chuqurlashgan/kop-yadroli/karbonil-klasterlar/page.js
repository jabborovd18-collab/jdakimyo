"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

// ============================================================================
// WADE QOIDALARI KALKULYATORI
// ============================================================================
function WadeKalkulyator() {
  const [metal, setMetal] = useState("fe3")
  const [result, setResult] = useState(null)

  const metals = {
    "fe3": { name: "[Fe₃(CO)₁₂]", m: 3, eMetal: 8, eCO: 24, total: 48, tve: 48, skelet: 6, pairs: 3, geo: "Uchburchak (closo −1)", note: "3 ta M−M bog' — Wade: closo = M+1 = 4 juft, lekin 3 juft (nido)" },
    "co4": { name: "[Co₄(CO)₁₂]", m: 4, eMetal: 9, eCO: 24, total: 60, tve: 60, skelet: 6, pairs: 3, geo: "Tetraedr (closo −1)", note: "4 ta Co, har biri 9e⁻ — 60 CVE. Closo = M+1 = 5 juft, 6 juft bor — nido" },
    "ru3": { name: "[Ru₃(CO)₁₂]", m: 3, eMetal: 8, eCO: 24, total: 48, tve: 48, skelet: 6, pairs: 3, geo: "Uchburchak", note: "Fe₃ analogi. 48 TVE — 3 ta M−M bog'" },
    "os5": { name: "[Os₅(CO)₁₆]", m: 5, eMetal: 8, eCO: 32, total: 72, tve: 72, skelet: 14, pairs: 7, geo: "Trigonal bipiramida (closo)", note: "5 ta Os — closo = M+1 = 6 juft. 7 juft — Wade bo'yicha closo!" },
    "rh6": { name: "[Rh₆(CO)₁₆]", m: 6, eMetal: 9, eCO: 32, total: 86, tve: 86, skelet: 18, pairs: 9, geo: "Oktaedr (closo)", note: "6 ta Rh — closo = M+1 = 7 juft. 9 juft — Wade: closo struktura" },
  }

  const calc = () => {
    const m = metals[metal]
    const totalVE = m.m * m.eMetal + m.eCO
    const tve = totalVE
    const skelElectrons = tve - 2 * m.m // har bir M−CO bog' 2e⁻
    const pairs = Math.floor(skelElectrons / 2)
    
    let geo = ""
    if (pairs === m.m + 1) geo = "closo (M+1) — eng barqaror"
    else if (pairs === m.m + 2) geo = "nido (M+2) — bitta cho'qqi ochiq"
    else if (pairs === m.m + 3) geo = "arachno (M+3) — ikkita cho'qqi ochiq"
    else geo = `${pairs} juft — ${pairs > m.m + 1 ? 'nido yoki arachno' : 'closo dan kam'}`

    setResult({ tve, skelElectrons, pairs, geo, note: m.note })
  }

  useEffect(() => { calc() }, [metal])

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Wade qoidalari — elektron sanash kalkulyatori</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-purple-400 text-xs block mb-1">Klaster tanlang</label>
          <select value={metal} onChange={(e) => setMetal(e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm">
            {Object.entries(metals).map(([k, v]) => (
              <option key={k} value={k}>{v.name}</option>
            ))}
          </select>
        </div>
        {result && (
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div><p className="text-green-400 font-bold text-lg">{result.tve}</p><p className="text-purple-400">TVE (jami valent e⁻)</p></div>
              <div><p className="text-yellow-400 font-bold text-lg">{result.skelElectrons}</p><p className="text-purple-400">Skelet e⁻</p></div>
              <div><p className="text-blue-400 font-bold text-lg">{result.pairs}</p><p className="text-purple-400">Skelet juftlari</p></div>
              <div><p className="text-fuchsia-400 font-bold text-sm">{result.geo}</p><p className="text-purple-400">Geometriya</p></div>
            </div>
            <p className="text-purple-300 text-xs mt-2">{result.note}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function KarbonilKlasterlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kop-yadroli" className="text-purple-400 hover:text-purple-300 text-lg">← Ko'p yadroli</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🪐 Metall karbonil klasterlari</h1>
          <p className="text-purple-400 text-sm">Wade qoidalari • PSEPT • [Fe₃(CO)₁₂] • Interaktiv kalkulyator</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Metall karbonil klasterlari haqida</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-green-400">Metall karbonil klasterlari</strong> — uch yoki undan 
              ortiq metall atomlari bevosita M−M bog'lar va CO ligandlari bilan bog'langan birikmalar.
              <strong className="text-green-400">Wade qoidalari (1971)</strong> — boran klasterlaridan 
              kelib chiqqan, metall karbonil klasterlarining <strong>geometriyasini elektronlar soniga 
              qarab bashorat qilish</strong> imkonini beradi. 
              <strong className="text-green-400">PSEPT (Polyhedral Skeletal Electron Pair Theory)</strong> 
              — Wade qoidalarining metall karbonillarga umumlashtirilgan shakli.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Wade qoidalari asoslari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>TVE (Total Valence Electrons):</strong> Metall valent e⁻ + ligand e⁻</li>
                <li>• <strong>Skelet elektron juftlari:</strong> TVE − 2M (har bir M−CO 2e⁻)</li>
                <li>• <strong>Closo (M+1 juft):</strong> Yopiq polihedr — eng barqaror</li>
                <li>• <strong>Nido (M+2 juft):</strong> Bitta cho'qqi ochiq</li>
                <li>• <strong>Arachno (M+3 juft):</strong> Ikkita cho'qqi ochiq</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Klassik misollar</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 text-purple-400">Klaster</th><th className="text-left py-2 text-green-400">TVE</th><th className="text-left py-2 text-yellow-400">Skelet e⁻</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["[Fe₃(CO)₁₂]","48","12 (6 juft) — nido"],["[Co₄(CO)₁₂]","60","12 (6 juft) — nido"],["[Ru₃(CO)₁₂]","48","12 (6 juft)"],["[Os₅(CO)₁₆]","72","14 (7 juft) — closo"],["[Rh₆(CO)₁₆]","86","18 (9 juft) — closo"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-1.5 font-mono">{r[0]}</td><td className="py-1.5">{r[1]}</td><td className="py-1.5">{r[2]}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. INTERAKTIV KALKULYATOR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <WadeKalkulyator />
        </div>

        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Wade qoidalari — <strong className="text-green-400">skelet elektron juftlari soni</strong> geometriyani belgilaydi</li>
            <li>TVE = metall valent e⁻ + ligand e⁻ — <strong className="text-green-400">klaster barqarorligi mezoni</strong></li>
            <li>Closo (M+1), Nido (M+2), Arachno (M+3) — <strong className="text-green-400">boran klasterlaridan olingan</strong></li>
            <li>PSEPT — <strong className="text-green-400">Wade qoidalarining metall karbonillarga qo'llanishi</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kop-yadroli/mm-boglar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← M−M bog'lar</Link>
          <Link href="/ilmiy/chuqurlashgan/kop-yadroli/magnit-klasterlar" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">Magnit klasterlar →</Link>
        </div>

      </section>
    </main>
  )
}