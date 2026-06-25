"use client"

import Link from "next/link"
import { basicInfo } from "./data/ag-nh3-2-data"
import EXAFSSimulator from "./components/EXAFSSimulator"
import XANESPreEdge from "./components/XANESPreEdge"
import EXAFSTable from "./components/EXAFSTable"
import OksidlanishKalkulyatori from "./components/OksidlanishKalkulyatori"
import ComparisonTable from "./components/ComparisonTable"

export default function AgNH32() {
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
          <span className="text-gray-300">{basicInfo.formula}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-300">⚪ {basicInfo.formula}</h1>
          <p className="text-purple-400 text-sm">{basicInfo.oksidlanishDarajasi} ({basicInfo.elektronKonfig}) • {basicInfo.magnitXossasi} • {basicInfo.geometriya}</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="bg-purple-900/40 border border-gray-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl font-extrabold font-mono text-gray-300">{basicInfo.formula}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{basicInfo.iupac}</h2>
              <p className="text-purple-400">"{basicInfo.tarixiy}" — {basicInfo.ahamiyati}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            {[
              { label: "Oksidlanish", value: basicInfo.oksidlanishDarajasi, color: "text-gray-300" },
              { label: "Konfiguratsiya", value: basicInfo.elektronKonfig, color: "text-green-400" },
              { label: "Geometriya", value: basicInfo.geometriya, color: "text-blue-400" },
              { label: "Bog' uzunligi", value: "Ag−N = 2.115 Å", color: "text-yellow-400" },
            ].map((item, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
                <p className="text-purple-400 text-xs">{item.label}</p>
                <p className={`font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><EXAFSSimulator /></div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><XANESPreEdge /></div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><EXAFSTable /></div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><OksidlanishKalkulyatori /></div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><ComparisonTable /></div>

        <div className="bg-gradient-to-r from-gray-600/10 to-purple-600/10 border border-gray-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Umumiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Ag⁺ (d¹⁰) — <strong className="text-gray-300">chiziqli, diamagnit, rangsiz</strong></li>
            <li>Ag−N = <strong className="text-gray-300">2.115 Å</strong> — KS=2, sp-gibridlanish</li>
            <li>XANES: oq chiziq <strong className="text-gray-300">minimal</strong> — d¹⁰ konfiguratsiya belgisi</li>
            <li>EXAFS: <strong className="text-gray-300">oddiy spektr</strong> — faqat 1 ta kuchli qobiq</li>
            <li>HSAB: Ag⁺ yumshoq kislota — <strong className="text-gray-300">Tollens reaktivi</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/exafs/birikmalar/cu-h2o6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← [Cu(H₂O)₆]²⁺</Link>
          <Link href="/ilmiy/tahlil/exafs/birikmalar/co-cl4" className="px-6 py-3 bg-gray-400/80 rounded-xl hover:bg-gray-400 text-white font-semibold">[CoCl₄]²⁻ →</Link>
        </div>

      </section>
    </main>
  )
}