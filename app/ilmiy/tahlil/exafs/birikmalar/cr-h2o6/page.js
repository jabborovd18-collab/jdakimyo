"use client"

import Link from "next/link"
import { basicInfo } from "./data/cr-h2o6-data"
import EXAFSSimulator from "./components/EXAFSSimulator"
import XANESPreEdge from "./components/XANESPreEdge"
import OksidlanishKalkulyatori from "./components/OksidlanishKalkulyatori"
import EPRSection from "./components/EPRSection"
import ComparisonTable from "./components/ComparisonTable"

// EXAFSTable to'g'ridan-to'g'ri shu yerda
function EXAFSTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 EXAFS strukturaviy parametrlari — [Cr(H₂O)₆]³⁺</h3>
      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">EXAFS tahlili</strong> natijasida olingan parametrlar.
          S₀² = 0.83, ΔE₀ = 1.8 eV, R-faktor = 0.009.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50 bg-purple-900/30">
                <th className="text-left py-3 px-3 text-yellow-400">Qobiq</th>
                <th className="text-left py-3 px-3 text-yellow-400">Bog'</th>
                <th className="text-left py-3 px-3 text-yellow-400">N</th>
                <th className="text-left py-3 px-3 text-yellow-400">R (Å)</th>
                <th className="text-left py-3 px-3 text-yellow-400">σ² (Å²)</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              <tr className="border-b border-purple-800/30">
                <td className="py-2 px-3">1</td>
                <td className="py-2 px-3 font-bold text-emerald-400">Cr−O</td>
                <td className="py-2 px-3 text-yellow-400">6.0</td>
                <td className="py-2 px-3 text-green-400">1.966 ± 0.006</td>
                <td className="py-2 px-3">0.0017 ± 0.0003</td>
              </tr>
              <tr className="border-b border-purple-800/30">
                <td className="py-2 px-3">2</td>
                <td className="py-2 px-3 font-bold text-emerald-400">Cr−H</td>
                <td className="py-2 px-3 text-yellow-400">12.0</td>
                <td className="py-2 px-3 text-green-400">2.68 ± 0.02</td>
                <td className="py-2 px-3">0.0040 ± 0.0010</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function CrH2O6() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300">Tahlil</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/exafs" className="text-purple-400 hover:text-purple-300">EXAFS/XANES</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/exafs/birikmalar" className="text-purple-400 hover:text-purple-300">Birikmalar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-emerald-400">{basicInfo.formula}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-emerald-400">🟢 {basicInfo.formula}</h1>
          <p className="text-purple-400 text-sm">
            {basicInfo.oksidlanishDarajasi} ({basicInfo.elektronKonfig}) • {basicInfo.magnitXossasi} • {basicInfo.geometriya}
          </p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="bg-purple-900/40 border border-emerald-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl font-extrabold font-mono text-emerald-400">{basicInfo.formula}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{basicInfo.iupac}</h2>
              <p className="text-purple-400">{basicInfo.ahamiyati}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
              <p className="text-purple-400 text-xs">Oksidlanish</p>
              <p className="font-bold text-emerald-400">{basicInfo.oksidlanishDarajasi}</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
              <p className="text-purple-400 text-xs">Konfiguratsiya</p>
              <p className="font-bold text-green-400">{basicInfo.elektronKonfig}</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
              <p className="text-purple-400 text-xs">CFSE</p>
              <p className="font-bold text-yellow-400">−1.2Δ₀</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
              <p className="text-purple-400 text-xs">Bog' uzunligi</p>
              <p className="font-bold text-purple-400">Cr−O = 1.966 Å</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><EXAFSSimulator /></div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><XANESPreEdge /></div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><EXAFSTable /></div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><OksidlanishKalkulyatori /></div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><EPRSection /></div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><ComparisonTable /></div>

        <div className="bg-gradient-to-r from-emerald-600/10 to-purple-600/10 border border-emerald-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Umumiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Cr³⁺ (d³) — <strong className="text-emerald-400">t₂g yarim to'lgan, oktaedrik, inert</strong></li>
            <li>Cr−O = <strong className="text-emerald-400">1.966 Å</strong> — 6 ta teng bog', mukammal O_h</li>
            <li>σ² = <strong className="text-emerald-400">0.0017</strong> — juda kichik (inert kompleks)</li>
            <li>EPR: <strong className="text-emerald-400">g ≈ 1.98 (izotrop)</strong>, xona haroratida signal</li>
            <li>CFSE = <strong className="text-emerald-400">−1.2Δ₀</strong> — katta stabillashuv</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/exafs/birikmalar/zn-oh4" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Zn(OH)₄]²⁻
          </Link>
          <Link href="/ilmiy/tahlil/exafs/birikmalar" className="px-6 py-3 bg-emerald-600/80 rounded-xl hover:bg-emerald-500 text-white font-semibold">
            Barcha birikmalar →
          </Link>
        </div>

      </section>
    </main>
  )
}